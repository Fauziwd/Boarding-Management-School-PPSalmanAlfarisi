<?php

namespace App\Http\Controllers;

use App\Models\Santri;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SantriController extends Controller
{
    /**
     * Menampilkan daftar santri dengan filter dan paginasi.
     */
    public function index(Request $request)
    {
        $query = Santri::query();

        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('nama_santri', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }
        
        $query->orderBy('nama_santri', 'asc');
        $perPage = $request->input('perPage', 10);
        $santris = $query->paginate($perPage)->withQueryString();

        $santris->getCollection()->transform(function ($santri) {
            $santri->foto_url = $santri->foto ? Storage::url($santri->foto) : null;
            return $santri;
        });

        return Inertia::render('Santri/Index', [
            'santris' => $santris,
            'filters' => $request->only(['search', 'perPage']),
        ]);
    }

    /**
     * Menampilkan detail data santri.
     */
    public function show(Santri $santri)
    {
        $santri->foto_url = $santri->foto ? Storage::url($santri->foto) : null;
        return Inertia::render('Santri/Show', ['santri' => $santri]);
    }

    /**
     * Menampilkan form untuk membuat santri baru dengan NIS otomatis.
     */
    public function create()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $nextNis = '';

        if ($activeYear) {
            $tahunHijriyah = preg_replace('/\/.*$/', '', $activeYear->year);
            $lastSantri = Santri::where('nis', 'like', $tahunHijriyah . '%')->orderBy('nis', 'desc')->first();
            $nextId = $lastSantri ? (int)substr($lastSantri->nis, -3) + 1 : 1;
            $nextNis = $tahunHijriyah . '.01.' . str_pad($nextId, 3, '0', STR_PAD_LEFT);
        }

        return Inertia::render('Santri/Create', [
            'generatedNis' => $nextNis,
        ]);
    }

    /**
     * Menyimpan data santri baru ke dalam database.
     */
    public function store(Request $request)
    {
        // PERBAIKAN: Validasi untuk 'status_santri' dihapus dari sini.
        $validatedData = $request->validate([
            'nis' => 'required|string|max:20|unique:santris,nis',
            'nisn' => 'nullable|string|max:20|unique:santris,nisn',
            'nama_santri' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'agama' => 'required|string',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|in:Ya,Tidak',
            'nama_bapak' => 'nullable|string|max:255',
            'pekerjaan_bapak' => 'nullable|string|max:255',
            'no_hp_bapak' => 'nullable|string|max:20',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'no_hp_ibu' => 'nullable|string|max:20',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:10',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // PERBAIKAN: Menetapkan status santri baru secara otomatis menjadi 'Aktif'.
        $validatedData['status_santri'] = 'Aktif';

        if ($request->hasFile('foto')) {
            $validatedData['foto'] = $request->file('foto')->store('fotos', 'public');
        }

        Santri::create($validatedData);
        return redirect()->route('santris.index')->with('success', 'Santri berhasil ditambahkan.');
    }

    /**
     * Menampilkan form untuk mengedit data santri.
     */
    public function edit(Santri $santri)
    {
        $santri->foto_url = $santri->foto ? Storage::url($santri->foto) : null;
        return Inertia::render('Santri/Edit', [
            'santri' => $santri,
        ]);
    }

    /**
     * Memperbarui data santri di dalam database.
     */
    public function update(Request $request, Santri $santri)
    {
        // Validasi di sini tetap memerlukan 'status_santri' karena ini adalah tempat untuk mengubahnya.
        $validatedData = $request->validate([
            'nis' => ['required', 'string', 'max:20', Rule::unique('santris')->ignore($santri->id)],
            'nisn' => ['nullable', 'string', 'max:20', Rule::unique('santris')->ignore($santri->id)],
            'nama_santri' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|string|in:Laki-laki,Perempuan',
            'agama' => 'required|string',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|in:Ya,Tidak',
            'nama_bapak' => 'nullable|string|max:255',
            'pekerjaan_bapak' => 'nullable|string|max:255',
            'no_hp_bapak' => 'nullable|string|max:20',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'no_hp_ibu' => 'nullable|string|max:20',
            'alamat' => 'required|string',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:10',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status_santri' => 'required|string|in:Aktif,Lulus,Keluar',
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

    /**
     * Menghapus data santri dari database.
     */
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
        // Pengecekan dilakukan dengan menghapus format titik dari input dan database
        $exists = Santri::where(DB::raw("REPLACE(nis, '.', '')"), $nis)->exists();
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
