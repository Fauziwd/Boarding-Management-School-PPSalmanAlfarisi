<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;
use Illuminate\Support\Facades\Storage;

class SantriController extends Controller
{
    // Menampilkan daftar santri
    public function index(Request $request)
    {
        $query = Santri::query();

        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('tempat_lahir', 'like', "%{$search}%")
                  ->orWhere('tanggal_lahir', 'like', "%{$search}%")
                  ->orWhere('tahun_lulus', 'like', "%{$search}%");
        }

        $query->orderBy('nis', 'asc'); // Urutkan berdasarkan NIS

        $perPage = $request->input('perPage', 5);
        $santris = $query->paginate($perPage);

        return Inertia::render('Santri/Index', [
            'santris' => $santris,
            'filters' => $request->only(['search', 'page', 'perPage']),
        ]);
    }   
    
    // Menampilkan detail santri
    public function show(Santri $santri)
    {
        return Inertia::render('Santri/Show', [
            'santri' => $santri, // pastikan data santri dikirim
        ]);
    }

    // Form untuk menambahkan santri
    public function create()
    {
        return Inertia::render('Santri/Create');
    }

    // Menyimpan data santri baru
    public function store(Request $request)
    {
        $request->validate([
            'nis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'tahun_lulus' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|max:255',
            'nama_bapak' => 'required|string|max:255',
            'pekerjaan_bapak' => 'required|string|max:255',
            'no_telpon_bapak' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ibu' => 'required|string|max:255',
            'no_telpon_ibu' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Buat objek santri baru
        $santri = new Santri($request->all());

        // Cek apakah ada file foto yang di-upload
        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $path = $file->store('fotos', 'public');
            $santri->foto = $path;
        }

        // Simpan data santri
        $santri->save();

        // Redirect ke halaman index dengan pesan sukses
        return redirect()->route('santris.index')->with('success', 'Santri berhasil ditambahkan');
    }

    // Form untuk mengedit data santri
    public function edit(Santri $santri)
    {
        return Inertia::render('Santri/Edit', [
            'santri' => $santri,
        ]);
    }

    // Mengupdate data santri
    public function update(Request $request, Santri $santri)
    {
        $request->validate([
            'nis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'tahun_lulus' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|max:255',
            'nama_bapak' => 'required|string|max:255',
            'pekerjaan_bapak' => 'required|string|max:255',
            'no_telpon_bapak' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ibu' => 'required|string|max:255',
            'no_telpon_ibu' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Update data santri
        $santri->update($request->all());

        // Cek apakah ada file foto yang di-upload
        if ($request->hasFile('foto')) {
            // Hapus foto lama
            if ($santri->foto) {
                Storage::disk('public')->delete($santri->foto);
            }

            $file = $request->file('foto');
            $path = $file->store('fotos', 'public');
            $santri->foto = $path;
        }

        // Simpan data santri
        $santri->save();

        // Redirect ke halaman index dengan pesan sukses
        return redirect()->route('santris.index')->with('success', 'Santri berhasil diupdate');
    }

    // Menghapus data santri
    public function destroy(Santri $santri)
    {
        // Hapus foto jika ada
        if ($santri->foto) {
            Storage::disk('public')->delete($santri->foto);
        }

        // Hapus data santri
        $santri->delete();

        // Redirect ke halaman index dengan pesan sukses
        return redirect()->route('santris.index')->with('success', 'Santri berhasil dihapus');
    }
}