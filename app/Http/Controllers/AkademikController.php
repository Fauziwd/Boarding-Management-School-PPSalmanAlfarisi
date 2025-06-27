<?php

namespace App\Http\Controllers;

use App\Models\Akademik;
use App\Models\Santri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AkademikController extends Controller
{
   public function index(Request $request)
    {
        $akademiks = Akademik::with('santri:id,nama_santri,nis,foto')
            ->select(
                'santri_id',
                DB::raw('COUNT(DISTINCT kitab) as jumlah_kitab'),
                DB::raw('COUNT(id) as total_pencapaian'),
                DB::raw('MAX(created_at) as terakhir_update')
            )
            ->groupBy('santri_id')
            ->orderBy('terakhir_update', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        $akademiks->getCollection()->transform(function ($item) {
            if ($item->santri) {
                $item->santri->foto = $item->santri->foto ? Storage::url($item->santri->foto) : null;
            }
            return $item;
        });

        return Inertia::render('Akademik/Index', [
            'akademiks' => $akademiks,
        ]);
    }

    public function getBySantriId($santriId)
    {
        // Urutkan berdasarkan tanggal terbaru
        $akademiks = Akademik::where('santri_id', $santriId)->latest()->get();
        return response()->json($akademiks);
    }

    public function create()
    {
        $santris = Santri::select('id', 'nama_santri', 'nis')->orderBy('nama_santri')->get();
        return inertia('Akademik/Create', [
            'santris' => $santris,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'kitab' => 'required|string|max:255',
            'bab' => 'required|string',
            'status' => 'required|string|in:Belum Selesai,Ikhtibar,Tamat', // Menambahkan validasi status
        ]);

        Akademik::create($request->all());

        return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil ditambahkan!');
    }
    
    public function edit(Akademik $akademik)
    {
        $santris = Santri::select('id', 'nama_santri')->orderBy('nama_santri')->get();
        return inertia('Akademik/Edit', [
            'akademik' => $akademik,
            'santris' => $santris
        ]);
    }

    public function update(Request $request, Akademik $akademik)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'kitab' => 'required|string|max:255',
            'bab' => 'required|string',
            'status' => 'required|string|in:Belum Selesai,Ikhtibar,Tamat',
        ]);

        $akademik->update($request->all());

        return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil diupdate.');
    }

    public function destroy(Akademik $akademik)
    {
        $akademik->delete();
        return redirect()->route('akademik.index')->with('success', 'Pencapaian berhasil dihapus.');
    }
}