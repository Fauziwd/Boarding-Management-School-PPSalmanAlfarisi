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
    /**
     * Menampilkan ringkasan pencapaian akademik per santri.
     */
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

    /**
     * Mengambil data akademik untuk santri tertentu (digunakan di API).
     */
    public function getBySantriId($santriId)
    {
        $akademiks = Akademik::where('santri_id', $santriId)->latest()->get();
        return response()->json($akademiks);
    }

    /**
     * Menampilkan formulir untuk menambah data akademik.
     */
    public function create(Request $request)
    {
        $santris = Santri::select('id', 'nama_santri', 'nis')->orderBy('nama_santri')->get();
        
        $selectedSantri = null;
        if ($request->has('santri_id')) {
            $selectedSantri = Santri::find($request->input('santri_id'));
        }
        
        return inertia('Akademik/Create', [
            'santris' => $santris,
            'selectedSantri' => $selectedSantri,
        ]);
    }

    /**
     * Menyimpan data akademik baru ke database.
     */
    public function store(Request $request)
    {
        // PERBAIKAN: Menambahkan 'nilai' dan kolom lain ke validasi
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'kitab' => 'required|string|max:255',
            'bab' => 'required|string|max:255',
            'halaman' => 'nullable|string|max:255',
            'baris' => 'nullable|string|max:255',
            'nilai' => 'nullable|integer|min:0|max:100',
            'catatan' => 'nullable|string',
            'status' => 'required|string|in:Belum Selesai,Ikhtibar,Tamat',
        ]);

        Akademik::create($request->all());

        // Alihkan kembali ke halaman detail santri yang bersangkutan
        return redirect()->route('santris.show', $request->santri_id)
                         ->with('success', 'Data akademik berhasil ditambahkan!');
    }
    
    /**
     * Menampilkan formulir untuk mengedit data akademik.
     */
    public function edit(Akademik $akademik)
    {
        $santris = Santri::select('id', 'nama_santri')->orderBy('nama_santri')->get();
        
        // Memuat relasi santri agar namanya bisa ditampilkan
        $akademik->load('santri');

        return inertia('Akademik/Edit', [
            'akademik' => $akademik,
            'santris' => $santris
        ]);
    }

    /**
     * Memperbarui data akademik yang sudah ada.
     */
    public function update(Request $request, Akademik $akademik)
    {
        // PERBAIKAN: Menambahkan 'nilai' dan kolom lain ke validasi
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'kitab' => 'required|string|max:255',
            'bab' => 'required|string|max:255',
            'halaman' => 'nullable|string|max:255',
            'baris' => 'nullable|string|max:255',
            'nilai' => 'nullable|integer|min:0|max:100',
            'catatan' => 'nullable|string',
            'status' => 'required|string|in:Belum Selesai,Ikhtibar,Tamat',
        ]);

        $akademik->update($request->all());

        return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil diupdate.');
    }

    /**
     * Menghapus data akademik.
     */
    public function destroy(Akademik $akademik)
    {
        $akademik->delete();
        return redirect()->route('akademik.index')->with('success', 'Pencapaian berhasil dihapus.');
    }
}
