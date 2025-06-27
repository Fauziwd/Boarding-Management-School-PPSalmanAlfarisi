<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        return Inertia::render('Kelas/Index', [
            'kelas' => Kelas::withCount('santris')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas',
        ]);

        Kelas::create($validated);

        return to_route('kelas.index')->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function update(Request $request, Kelas $kela)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255|unique:kelas,nama_kelas,' . $kela->id,
        ]);

        $kela->update($validated);

        return to_route('kelas.index')->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy(Kelas $kela)
    {
        if ($kela->santris()->exists() || $kela->reportCards()->exists()) {
             return to_route('kelas.index')->with('error', 'Kelas tidak dapat dihapus karena memiliki santri atau rapor terkait.');
        }
        
        $kela->delete();

        return to_route('kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }
}