<?php

namespace App\Http\Controllers;

use App\Models\Akademik;
use App\Models\Santri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AkademikController extends Controller
{
    public function index()
    {
        $akademiks = Akademik::with('santri')->paginate(10);

        return Inertia::render('Akademik/Index', [
            'akademiks' => $akademiks
        ]);
    }

    public function getBySantriId($santriId)
{
    // Ambil semua data akademik berdasarkan santri_id
    $akademiks = Akademik::where('santri_id', $santriId)->get();

    return response()->json($akademiks);
}


    public function show($id)
    {
        $akademik = Akademik::with('santri')->findOrFail($id);

        return Inertia::render('Akademik/Show', [
            'akademik' => $akademik
        ]);
    }

    public function destroy($id)
    {
        $akademik = Akademik::findOrFail($id);
        $akademik->delete();

        return redirect()->route('akademik.index')->with('success', 'Pencapaian berhasil dihapus.');
    }  


    public function create()
    {
        $santris = Santri::all();
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
        ]);

          // Simpan data ke tabel akademiks
        Akademik::create($request->all());

          // Redirect ke halaman sebelumnya dengan pesan sukses
          return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil ditambahkan!');
      }
  
 

    public function edit(Akademik $akademik)
    {
        $santris = Santri::all();
        return inertia('Akademik/Edit', ['akademik' => $akademik, 'santris' => $santris]);
    }

    public function update(Request $request, Akademik $akademik)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'kitab' => 'required|string|max:255',
            'bab' => 'required|string',
        ]);

        $akademik->update($request->all());

        return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil diupdate.');
    }


}
