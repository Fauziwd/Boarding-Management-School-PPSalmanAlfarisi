<?php

namespace App\Http\Controllers;

use App\Models\Santri;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // PERBAIKAN: Menambahkan DB Facade
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SantriController extends Controller
{
    public function index(Request $request)
    {
        $query = Santri::with('kelas');

        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nama_santri', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhereHas('kelas', function ($subQuery) use ($search) {
                      $subQuery->where('nama_kelas', 'like', "%{$search}%");
                  });
            });
        }

        $query->orderBy('nama_santri', 'asc');
        $perPage = $request->input('perPage', 10);
        $santris = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Santri/Index', [
            'santris' => $santris,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    public function show(Santri $santri)
    {
        $santri->load('kelas');
        $santri->foto_url = $santri->foto ? Storage::url($santri->foto) : null;
        return Inertia::render('Santri/Show', ['santri' => $santri]);
    }

    public function create()
    {
        // Tidak perlu mengirim data kelas ke form create
        return Inertia::render('Santri/Create');
    }

    public function store(Request $request)
    {
        // Validasi lengkap untuk data santri baru
        $validatedData = $request->validate([
            'nis' => 'required|string|max:20|unique:santris,nis',
            'nisn' => 'nullable|string|max:20|unique:santris,nisn',
            'nama_santri' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'kelas_id' => 'nullable|exists:kelas,id',
            'agama' => 'required|string',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|in:Ya,Tidak',
            'nama_bapak' => 'nullable|string|max:255',
            'pekerjaan_bapak' => 'nullable|string|max:255',
            'no_telpon_bapak' => 'nullable|string|max:20',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'no_telpon_ibu' => 'nullable|string|max:20',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:10',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $validatedData['foto'] = $request->file('foto')->store('fotos', 'public');
        }

        Santri::create($validatedData);
        return redirect()->route('santris.index')->with('success', 'Santri berhasil ditambahkan.');
    }

    public function edit(Santri $santri)
    {
        $santri->foto_url = $santri->foto ? Storage::url($santri->foto) : null;
        return Inertia::render('Santri/Edit', [
            'santri' => $santri,
            // Untuk form edit, kita tetap butuh daftar kelas
            'kelas' => Kelas::orderBy('nama_kelas')->get(),
        ]);
    }

    public function update(Request $request, Santri $santri)
    {
        // PERBAIKAN: Melengkapi semua aturan validasi untuk update
        $validatedData = $request->validate([
            'nis' => ['required', 'string', 'max:20', Rule::unique('santris')->ignore($santri->id)],
            'nisn' => ['nullable', 'string', 'max:20', Rule::unique('santris')->ignore($santri->id)],
            'nama_santri' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'kelas_id' => 'nullable|exists:kelas,id',
            'agama' => 'required|string',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|in:Ya,Tidak',
            'nama_bapak' => 'nullable|string|max:255',
            'pekerjaan_bapak' => 'nullable|string|max:255',
            'no_telpon_bapak' => 'nullable|string|max:20',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'no_telpon_ibu' => 'nullable|string|max:20',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:10',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        if ($request->hasFile('foto')) {
            if ($santri->foto) {
                Storage::disk('public')->delete($santri->foto);
            }
            $validatedData['foto'] = $request->file('foto')->store('fotos', 'public');
        }

        $santri->update($validatedData);
        return redirect()->route('santris.index')->with('success', 'Data santri berhasil diperbarui.');
    }

    public function destroy(Santri $santri)
    {
        if ($santri->foto) {
            Storage::disk('public')->delete($santri->foto);
        }
        $santri->delete();
        return redirect()->route('santris.index')->with('success', 'Data santri berhasil dihapus.');
    }

    /**
     * Method untuk mengecek ketersediaan NIS via API.
     */
    public function checkNis($nis)
    {
        // PERBAIKAN: Menggunakan perbandingan yang akurat dengan menghapus format titik.
        // Query ini membandingkan NIS dari input (tanpa format) dengan
        // data NIS di database yang juga dihilangkan formatnya.
        $exists = Santri::where(DB::raw("REPLACE(nis, '.', '')"), $nis)->exists();

        return response()->json(['exists' => $exists]);
    }

    /**
     * Method untuk mengecek ketersediaan NISN via API.
     */
    public function checkNisn($nisn)
    {
        // Pengecekan NISN sudah benar karena formatnya hanya angka.
        $exists = Santri::where('nisn', $nisn)->exists();
        return response()->json(['exists' => $exists]);
    }
}
