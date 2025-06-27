<?php

namespace App\Http\Controllers;

use App\Models\Santri;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SantriController extends Controller
{
    /**
     * Menampilkan daftar santri dengan fitur pencarian dan paginasi.
     */
    public function index(Request $request)
    {
        $query = Santri::query();

        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nama_santri', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('tempat_lahir', 'like', "%{$search}%");
            });
        }

        $query->orderBy('nis', 'asc');

        $perPage = $request->input('perPage', 10);
        $santris = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Santri/Index', [
            'santris' => $santris,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    /**
     * Menampilkan detail santri.
     */
    public function show(Santri $santri)
    {
        $santri->foto = $santri->foto_santri ? Storage::url($santri->foto_santri) : null;

        return Inertia::render('Santri/Show', [
            'santri' => $santri,
        ]);
    }

    /**
     * Menampilkan form untuk menambahkan santri baru.
     */
   public function create()
    {
        return Inertia::render('Santri/Create', [
            'kelas' => Kelas::orderBy('nama_kelas')->get(), // Kirim data kelas
        ]);
    }

    /**
     * Menyimpan data santri baru ke database.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nis' => 'required|string|max:20|unique:santris,nis',
            'nisn' => 'nullable|string|max:20|unique:santris,nisn',
            'nama_santri' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'kelas_id' => 'required|exists:kelas,id', // Tambahkan validasi kelas_id
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
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('foto')) {
            $validatedData['foto_santri'] = $request->file('foto')->store('fotos', 'public');
        }

        Santri::create($validatedData);

        return redirect()->route('santris.index')->with('success', 'Santri berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit data santri.
     */
    public function edit(Santri $santri)
    {
        // Menyertakan URL lengkap untuk foto agar bisa ditampilkan di frontend
        $santri->foto_url = $santri->foto_santri ? Storage::url($santri->foto_santri) : null;

        return Inertia::render('Santri/Edit', [
            'santri' => $santri,
            'kelas' => Kelas::orderBy('nama_kelas')->get(), // Mengirim daftar kelas ke view
        ]);
    }

    /**
     * Mengupdate data santri yang sudah ada.
     */
    public function update(Request $request, Santri $santri)
    {
        $validatedData = $request->validate([
            'nis' => ['required', 'string', 'max:20', Rule::unique('santris')->ignore($santri->id)],
            'nisn' => ['nullable', 'string', 'max:20', Rule::unique('santris')->ignore($santri->id)],
            'nama_santri' => 'required|string|max:255',
            'kelas_id' => 'required|exists:kelas,id',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
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
        
        // Handle file update
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($santri->foto_santri) {
                Storage::disk('public')->delete($santri->foto_santri);
            }
            // Simpan foto baru dan update path di data validasi
            $validatedData['foto_santri'] = $request->file('foto')->store('fotos', 'public');
        }

        $santri->update($validatedData);

        return redirect()->route('santris.index')->with('success', 'Data santri berhasil diperbarui.');
    }

    /**
     * Menghapus data santri.
     */
    public function destroy(Santri $santri)
    {
        if ($santri->foto_santri) {
            Storage::disk('public')->delete($santri->foto_santri);
        }

        $santri->delete();

        return redirect()->route('santris.index')->with('success', 'Data santri berhasil dihapus.');
    }

    /**
     * Method untuk mengecek ketersediaan NIS via API.
     */
    public function checkNis($nis)
    {
        $exists = Santri::where('nis', $nis)->exists();
        return response()->json(['exists' => $exists]);
    }

    /**
     * Method untuk mengecek ketersediaan NISN via API.
     */
    public function checkNisn($nisn)
    {
        $exists = Santri::where('nisn', $nisn)->exists();
        return response()->json(['exists' => $exists]);
    }
}