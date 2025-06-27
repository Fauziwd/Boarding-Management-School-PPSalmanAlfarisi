<?php

namespace App\Http\Controllers;

use App\Models\Hafalan;
use App\Models\Santri;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HafalanController extends Controller
{
   public function index()
    {
        // ========== PERBAIKAN DI SINI ==========
        // Mengganti 'foto_santri' menjadi 'foto' agar sesuai dengan kolom database Anda
        $hafalans = Hafalan::with('santri:id,nama_santri,nis,foto') 
            ->select(
                'santri_id',
                DB::raw('COUNT(DISTINCT juz) as total_juz'),
                DB::raw('MAX(created_at) as terakhir_update')
            )
            ->groupBy('santri_id')
            ->orderBy('terakhir_update', 'desc')
            ->paginate(10);
            
        // Menambahkan URL foto ke setiap santri
        $hafalans->getCollection()->transform(function ($item) {
            if ($item->santri) {
                // Menggunakan 'foto' untuk mengecek dan membuat URL
                $item->santri->foto = $item->santri->foto ? Storage::url($item->santri->foto) : null;
            }
            return $item;
        });

        return Inertia::render('Hafalan/Index', [
            'hafalans' => $hafalans,
        ]);
    }


    public function create()
    {
        $santris = Santri::select('id', 'nama_santri', 'nis')->orderBy('nama_santri')->get();
        return Inertia::render('Hafalan/Create', ['santris' => $santris]);
    }



    public function store(Request $request)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'juz' => 'required|integer|min:1|max:30',
            'month' => 'required|date_format:Y-m',
        ]);

        Hafalan::create($request->all());
        return redirect()->route('hafalan.index')->with('success', 'Hafalan berhasil ditambahkan.');
    }

    public function edit(Hafalan $hafalan)
    {
        $santris = Santri::select('id', 'nama_santri')->orderBy('nama_santri')->get();
        return Inertia::render('Hafalan/Edit', [
            'hafalan' => $hafalan, 
            'santris' => $santris
        ]);
    }

    public function update(Request $request, Hafalan $hafalan)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'juz' => 'required|integer|min:1|max:30',
            'month' => 'required|date_format:Y-m',
        ]);

        $hafalan->update($request->all());
        return redirect()->route('hafalan.index')->with('success', 'Hafalan berhasil diperbarui.');
    }

     public function destroy(Hafalan $hafalan)
    {
        $hafalan->delete();
        return redirect()->route('hafalan.index')->with('success', 'Hafalan berhasil dihapus.');
    }
    
    public function getBySantriId($santriId)
    {
        $hafalans = Hafalan::where('santri_id', $santriId)->orderBy('created_at', 'desc')->get();
        return response()->json($hafalans);
    }
    
    public function monthlySummary(Request $request)
    {
        $month = $request->input('month', date('Y-m'));

        $summary = Hafalan::with('santri:id,nama_santri')
            ->where('month', 'like', $month . '%')
            ->get()
            ->groupBy('juz')
            ->map(function ($group) {
                return $group->map(function ($hafalan) {
                    return [
                        'nama' => $hafalan->santri->nama_santri,
                        'created_at' => $hafalan->created_at->format('d/m/Y'), 
                    ];
                });
            });

        return response()->json($summary);
    }
}