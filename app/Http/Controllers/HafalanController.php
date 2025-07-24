<?php

namespace App\Http\Controllers;

use App\Models\Hafalan;
use App\Models\Santri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class HafalanController extends Controller
{
    /**
     * Helper function untuk mengubah format halaman (e.g., '10B') menjadi nilai numerik (1-20).
     */
    private function convertHalamanToValue($halaman)
    {
        if (!preg_match('/^(\d{1,2})([AB])$/i', $halaman, $matches)) return 0;
        return (($matches[1] - 1) * 2) + (strtoupper($matches[2]) === 'A' ? 1 : 2);
    }

    /**
     * Helper function untuk mendapatkan teks perempat juz dari nilai halaman (1-20).
     */
    private function getQuarterJuzText($pageValue)
    {
        if ($pageValue >= 1 && $pageValue <= 5) return 'Mencapai 1/4 Juz';
        if ($pageValue >= 6 && $pageValue <= 10) return 'Mencapai 1/2 Juz';
        if ($pageValue >= 11 && $pageValue <= 15) return 'Mencapai 3/4 Juz';
        if ($pageValue >= 16 && $pageValue <= 20) return 'Juz Selesai';
        return '';
    }

    /**
     * Menampilkan laporan progres hafalan santri dengan filter tanggal.
     */
    public function index(Request $request)
    {
        $request->validate([
            'filter_preset' => 'nullable|string|in:last_week,last_2_weeks,last_month,last_3_months',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $filterPreset = $request->input('filter_preset', 'last_week');
        $startDate = null;
        $endDate = now();

        if ($filterPreset === 'custom' && $request->has('start_date')) {
            $startDate = Carbon::parse($request->input('start_date'));
            $endDate = Carbon::parse($request->input('end_date'));
        } else {
            switch ($filterPreset) {
                case 'last_2_weeks': $startDate = now()->subWeeks(2); break;
                case 'last_month': $startDate = now()->subMonth(); break;
                case 'last_3_months': $startDate = now()->subMonths(3); break;
                default: $startDate = now()->subWeek(); break;
            }
        }

        $santris = Santri::where('status_santri', 'Aktif')->get();
        $hafalanSummary = [];

        foreach ($santris as $santri) {
            $startHafalan = $santri->hafalans()->where('created_at', '<', $startDate)->orderBy('created_at', 'desc')->first();
            $endHafalan = $santri->hafalans()->whereBetween('created_at', [$startDate, $endDate->endOfDay()])->orderBy('created_at', 'desc')->first();

            if (!$endHafalan) continue;

            $progressPages = 0;
            if ($startHafalan) {
                if ($startHafalan->juz == $endHafalan->juz) {
                    $progressPages = $this->convertHalamanToValue($endHafalan->halaman) - $this->convertHalamanToValue($startHafalan->halaman);
                } else {
                    $juzDifference = $endHafalan->juz - $startHafalan->juz;
                    $pagesInStartJuz = 20 - $this->convertHalamanToValue($startHafalan->halaman);
                    $pagesInEndJuz = $this->convertHalamanToValue($endHafalan->halaman);
                    $pagesInBetween = ($juzDifference - 1) * 20;
                    $progressPages = $pagesInStartJuz + $pagesInBetween + $pagesInEndJuz;
                }
            } else {
                $progressPages = (($endHafalan->juz - 1) * 20) + $this->convertHalamanToValue($endHafalan->halaman);
            }
            
            $progressPages = max(0, $progressPages);
            $progressSheets = floor($progressPages / 2);
            $remainingPage = $progressPages % 2;
            $progressText = $progressPages > 0 ? "{$progressSheets} Lembar" . ($remainingPage ? " & 1 Halaman" : "") : "Tidak ada progres";

            $hafalanSummary[] = [
                'santri_id' => $santri->id,
                'nama_santri' => $santri->nama_santri,
                'nis' => $santri->nis,
                'foto_url' => $santri->foto ? Storage::url($santri->foto) : null,
                'start_hafalan' => $startHafalan ? "Juz {$startHafalan->juz} Hal. {$startHafalan->halaman}" : 'Setoran Pertama',
                'end_hafalan' => "Juz {$endHafalan->juz} Hal. {$endHafalan->halaman}",
                'progress_text' => $progressText,
                'end_quarter_text' => $this->getQuarterJuzText($this->convertHalamanToValue($endHafalan->halaman)),
                'last_update' => Carbon::parse($endHafalan->created_at)->locale('id')->diffForHumans(),
            ];
        }

        return Inertia::render('Hafalan/Index', [
            'hafalanSummary' => $hafalanSummary,
            'filters' => ['filter_preset' => $filterPreset, 'start_date' => $startDate->toDateString(), 'end_date' => $endDate->toDateString()],
            'success' => session('success'),
        ]);
    }

    /**
     * Menampilkan formulir untuk membuat data hafalan baru.
     */
    public function create(Request $request)
    {
        // Mengambil santri aktif dan memuat relasi usroh mereka.
        $santris = Santri::with('usrohs:id,nama_usroh')
                         ->where('status_santri', 'Aktif')
                         ->orderBy('nama_santri')
                         ->get();
        
        $selectedSantri = null;
        if ($request->has('santri_id')) {
            $selectedSantri = Santri::with('usrohs:id,nama_usroh')->find($request->input('santri_id'));
        }

        return Inertia::render('Hafalan/Create', [
            'santris' => $santris,
            'selectedSantri' => $selectedSantri,
        ]);
    }

    /**
     * Menyimpan data hafalan baru ke database.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'juz' => 'required|integer|min:1|max:30',
            'halaman' => ['required', 'string', 'regex:/^([1-9]|10)[AB]$/i'],
            'nilai' => 'required|integer|min:0|max:100',
        ]);
        
        $validatedData['halaman'] = strtoupper($validatedData['halaman']);
        Hafalan::create($validatedData);

        return redirect()->route('hafalan.index')->with('success', 'Data hafalan berhasil ditambahkan.');
    }
    
    public function edit(Hafalan $hafalan)
    {
        $hafalan->load('santri:id,nama_santri');
        return Inertia::render('Hafalan/Edit', [
            'hafalan' => $hafalan,
        ]);
    }

    public function update(Request $request, Hafalan $hafalan)
    {
        $validatedData = $request->validate([
            'juz' => 'required|integer|min:1|max:30',
            'halaman' => ['required', 'string', 'regex:/^([1-9]|10)[AB]$/i'],
            'nilai' => 'required|integer|min:0|max:100',
        ]);
        
        $validatedData['halaman'] = strtoupper($validatedData['halaman']);
        $hafalan->update($validatedData);

        return redirect()->route('hafalan.index')->with('success', 'Data hafalan berhasil diperbarui.');
    }

    public function destroy(Hafalan $hafalan)
    {
        $hafalan->delete();
        return redirect()->route('hafalan.index')->with('success', 'Data hafalan berhasil dihapus.');
    }
}
