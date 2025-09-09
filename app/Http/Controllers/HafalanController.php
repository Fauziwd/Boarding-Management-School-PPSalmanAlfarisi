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
    private function convertHalamanToValue($halaman)
    {
        if (!preg_match('/^(\d{1,2})([AB])$/i', $halaman, $matches)) return 0;
        return (($matches[1] - 1) * 2) + (strtoupper($matches[2]) === 'A' ? 1 : 2);
    }

    private function getQuarterJuzText($halaman)
    {
        $halaman = strtoupper($halaman);
        if ($halaman === '3A') return 'Mencapai 1/4 Juz';
        if ($halaman === '5B') return 'Mencapai 1/2 Juz';
        if ($halaman === '8A') return 'Mencapai 3/4 Juz';
        if ($halaman === '10B') return 'Juz Selesai';
        return '';
    }

    public function index(Request $request)
    {
        $request->validate([
            'filter_preset' => 'nullable|string|in:last_week,last_2_weeks,last_month,last_3_months,custom',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $filterPreset = $request->input('filter_preset', 'last_week');
        $startDate = null;
        $endDate = now();

        if ($filterPreset === 'custom' && $request->filled('start_date')) {
            $startDate = Carbon::parse($request->start_date);
            $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date) : now();
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
            $startHafalan = $santri->hafalans()
                ->where('created_at', '<', $startDate)
                ->orderBy('created_at', 'desc')->first();

            $endHafalan = $santri->hafalans()
                ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
                ->orderBy('created_at', 'desc')->first();

            if (!$endHafalan) continue;

            if ($startHafalan) {
                $startTotal = (($startHafalan->juz - 1) * 20) + $this->convertHalamanToValue($startHafalan->halaman);
                $endTotal = (($endHafalan->juz - 1) * 20) + $this->convertHalamanToValue($endHafalan->halaman);
                $progressPages = $endTotal - $startTotal;
            } else {
                $firstInPeriod = $santri->hafalans()
                    ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
                    ->orderBy('created_at', 'asc')->first();

                $startPoint = (($firstInPeriod->juz - 1) * 20);
                $endPoint = (($endHafalan->juz - 1) * 20) + $this->convertHalamanToValue($endHafalan->halaman);
                $progressPages = $endPoint - $startPoint;
            }

            $progressPages = max(0, $progressPages);

            $hafalanSummary[] = [
                'santri_id' => $santri->id,
                'nama_santri' => $santri->nama_santri,
                'nis' => $santri->nis,
                'foto_url' => $santri->foto ? Storage::url($santri->foto) : null,
                'start_hafalan' => $startHafalan ? "Juz {$startHafalan->juz} Hal. {$startHafalan->halaman}" : 'Setoran Pertama',
                'end_hafalan' => "Juz {$endHafalan->juz} Hal. {$endHafalan->halaman}",
                'progress_text' => $progressPages > 0 ? "{$progressPages} Halaman" : "Tidak ada progres",
                'end_quarter_text' => $this->getQuarterJuzText($endHafalan->halaman),
                'last_update' => Carbon::parse($endHafalan->created_at)->locale('id')->diffForHumans(),
            ];
        }

        return Inertia::render('Hafalan/Index', [
            'hafalanSummary' => $hafalanSummary,
            'filters' => [
                'filter_preset' => $filterPreset,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString()
            ],
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        $santris = Santri::with(['halaqohs.teacher.user:id,name'])
            ->where('status_santri', 'Aktif')
            ->orderBy('nama_santri')
            ->get(['id', 'nama_santri', 'nis']);

        return Inertia::render('Hafalan/Create', [ 'santris' => $santris ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'teacher_id' => 'nullable|exists:teachers,id',
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
        return Inertia::render('Hafalan/Edit', [ 'hafalan' => $hafalan ]);
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

    public function getHafalanHistory(Request $request, Santri $santri)
    {
        $history = $santri->hafalans()->with('teacher.user:id,name')->orderBy('created_at', 'asc')->get();
        if ($history->isEmpty()) {
            return response()->json(['history' => [], 'chartData' => []]);
        }

        $progressData = collect();
        foreach ($history as $item) {
            $progressData->push([
                'date' => Carbon::parse($item->created_at),
                'total_pages' => (($item->juz - 1) * 20) + $this->convertHalamanToValue($item->halaman),
            ]);
        }

        $period = $request->input('period', 'monthly');
        $format = $period === 'weekly' ? 'W Y' : 'M Y';

        $groupedData = $progressData->groupBy(fn($item) => $item['date']->format($format))
            ->map(fn($group) => $group->max('total_pages'));

        $finalChartData = collect();
        $lastPeriodTotal = 0;

        $firstRecord = $history->first();
        $beforeFirst = $santri->hafalans()->where('created_at', '<', $firstRecord->created_at)->orderBy('created_at', 'desc')->first();
        if ($beforeFirst) {
            $lastPeriodTotal = (($beforeFirst->juz - 1) * 20) + $this->convertHalamanToValue($beforeFirst->halaman);
        }

        foreach ($groupedData as $periodKey => $currentTotal) {
            $increase = $currentTotal - $lastPeriodTotal;
            $finalChartData->push(['x' => $periodKey, 'y' => $increase]);
            $lastPeriodTotal = $currentTotal;
        }

        return response()->json(['history' => $history, 'chartData' => []]); 
    }
}
