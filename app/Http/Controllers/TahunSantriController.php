<?php

namespace App\Http\Controllers;

use App\Models\Kelas; // Kita tetap menggunakan model Kelas
use Illuminate\Http\Request;
use Inertia\Inertia;

class TahunSantriController extends Controller
{
    public function index()
    {
        return Inertia::render('TahunSantri/Index', [
            'kelasList' => Kelas::latest()->paginate(10)
        ]);
    }

    public function create()
    {
        return Inertia::render('TahunSantri/Create');
    }

    public function store(Request $request)
    {
        $request->validate(['nama_kelas' => 'required|string|max:255|unique:kelas']);
        Kelas::create($request->all());
        return redirect()->route('tahun-santri.index')->with('success', 'Tahun Santri berhasil ditambahkan.');
    }

    public function edit(Kelas $tahun_santri)
    {
        return Inertia::render('TahunSantri/Edit', [
            'kelas' => $tahun_santri
        ]);
    }

    public function update(Request $request, Kelas $tahun_santri)
    {
        $request->validate(['nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas,' . $tahun_santri->id]);
        $tahun_santri->update($request->all());
        return redirect()->route('tahun-santri.index')->with('success', 'Tahun Santri berhasil diperbarui.');
    }

    public function destroy(Kelas $tahun_santri)
    {
        $tahun_santri->delete();
        return redirect()->route('tahun-santri.index')->with('success', 'Tahun Santri berhasil dihapus.');
    }
}
