<?php

namespace App\Http\Controllers;

use App\Models\Hafalan;
use App\Models\Santri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HafalanController extends Controller
{
    /**
     * Menampilkan ringkasan pencapaian hafalan per santri.
     */
    public function index()
    {
        $hafalans = Hafalan::with('santri:id,nama_santri,nis,foto')
            ->select(
                'santri_id',
                DB::raw('COUNT(DISTINCT juz) as total_juz'),
                DB::raw('COUNT(id) as total_setoran'),
                DB::raw('MAX(created_at) as terakhir_update')
            )
            ->groupBy('santri_id')
            ->orderBy('terakhir_update', 'desc')
            ->paginate(10);
        
        // Menambahkan URL foto ke setiap santri
        $hafalans->getCollection()->transform(function ($item) {
            if ($item->santri) {
                // Pastikan menggunakan kolom 'foto' yang benar
                $item->santri->foto_url = $item->santri->foto ? Storage::url($item->santri->foto) : null;
            }
            return $item;
        });

        return Inertia::render('Hafalan/Index', [
            'hafalans' => $hafalans,
        ]);
    }

    /**
     * Mengambil riwayat hafalan untuk santri tertentu (API untuk panel detail).
     */
    public function getBySantriId($santriId)
    {
        // PERBAIKAN: Memilih kolom secara spesifik untuk mencegah error serialisasi.
        $hafalans = Hafalan::where('santri_id', $santriId)
            ->select('id', 'month', 'juz', 'halaman', 'baris', 'nilai')
            ->latest()
            ->get();
            
        return response()->json($hafalans);
    }

    /**
     * Menampilkan formulir untuk membuat data hafalan baru.
     */
    public function create(Request $request)
    {
        $santris = Santri::orderBy('nama_santri')->get(['id', 'nama_santri', 'nis']);
        
        $selectedSantri = null;
        if ($request->has('santri_id')) {
            $selectedSantri = Santri::find($request->input('santri_id'));
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
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'juz' => 'required|integer|min:1|max:30',
            'halaman' => 'nullable|string|max:255',
            'baris' => 'nullable|string|max:255',
            'nilai' => 'required|integer|min:0|max:100',
            'month' => 'required|date_format:Y-m',
        ]);

        Hafalan::create($request->all());

        return redirect()->route('hafalan.index')->with('success', 'Data hafalan berhasil ditambahkan.');
    }

    /**
     * Menampilkan formulir untuk mengedit data hafalan.
     */
    public function edit(Hafalan $hafalan)
    {
        $hafalan->load('santri:id,nama_santri');

        return Inertia::render('Hafalan/Edit', [
            'hafalan' => $hafalan,
        ]);
    }

    /**
     * Memperbarui data hafalan di database.
     */
    public function update(Request $request, Hafalan $hafalan)
    {
        $request->validate([
            'juz' => 'required|integer|min:1|max:30',
            'halaman' => 'nullable|string|max:255',
            'baris' => 'nullable|string|max:255',
            'nilai' => 'required|integer|min:0|max:100',
            'month' => 'required|date_format:Y-m',
        ]);

        $hafalan->update($request->all());

        return redirect()->route('hafalan.index')->with('success', 'Data hafalan berhasil diperbarui.');
    }

    /**
     * Menghapus data hafalan dari database.
     */
    public function destroy(Hafalan $hafalan)
    {
        $hafalan->delete();
        
        return redirect()->route('hafalan.index')->with('success', 'Data hafalan berhasil dihapus.');
    }
}
