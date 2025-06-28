<?php

namespace App\Http\Controllers;

use App\Models\Usroh;
use App\Models\Teacher;
use App\Models\Santri;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UsrohController extends Controller
{
    /**
     * Menampilkan daftar semua kelompok usroh.
     */
    public function index()
    {
        $usrohs = Usroh::with(['murobbi.user', 'academicYear'])
            ->withCount('santris') // Menghitung jumlah santri di setiap usroh
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Usroh/Index', [
            'usrohs' => $usrohs,
        ]);
    }

    /**
     * Menampilkan form untuk membuat usroh baru.
     */
    public function create()
    {
        return Inertia::render('Usroh/Create', [
            // Kirim daftar guru yang merupakan Murobbi
            'murobbis' => Teacher::where('teacher_type', 'Murobbi')->with('user')->get(),
            // Kirim daftar tahun ajaran yang aktif
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

    /**
     * Menyimpan usroh baru ke database.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'murobbi_id' => ['nullable', 'integer', Rule::exists('teachers', 'id')],
            'academic_year_id' => ['required', 'integer', Rule::exists('academic_years', 'id')],
        ]);

        Usroh::create($request->all());

        return redirect()->route('usrohs.index')->with('success', 'Kelompok Usroh berhasil dibuat.');
    }

    /**
     * Menampilkan detail sebuah usroh, termasuk daftar anggotanya.
     * Ini adalah halaman utama untuk manajemen anggota.
     */
    public function show(Usroh $usroh)
    {
        // Load relasi yang diperlukan untuk ditampilkan
        $usroh->load(['murobbi.user', 'academicYear', 'santris.kelas']);

        // Ambil daftar santri yang BELUM punya usroh di tahun ajaran ini,
        // untuk ditampilkan di dropdown "Tambah Anggota".
        $availableSantris = Santri::whereDoesntHave('usrohs', function ($query) use ($usroh) {
            $query->where('academic_year_id', $usroh->academic_year_id);
        })->get();

        return Inertia::render('Usroh/Show', [
            'usroh' => $usroh,
            'availableSantris' => $availableSantris,
        ]);
    }

    /**
     * Menampilkan form untuk mengedit usroh.
     */
    public function edit(Usroh $usroh)
    {
        return Inertia::render('Usroh/Edit', [
            'usroh' => $usroh,
            'murobbis' => Teacher::where('teacher_type', 'Murobbi')->with('user')->get(),
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

    /**
     * Mengupdate data usroh di database.
     */
    public function update(Request $request, Usroh $usroh)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'murobbi_id' => ['nullable', 'integer', Rule::exists('teachers', 'id')],
            'academic_year_id' => ['required', 'integer', Rule::exists('academic_years', 'id')],
        ]);

        $usroh->update($request->all());

        return redirect()->route('usrohs.index')->with('success', 'Data Usroh berhasil diperbarui.');
    }

    /**
     * Menghapus usroh dari database.
     */
    public function destroy(Usroh $usroh)
    {
        // detach semua santri sebelum menghapus usroh
        $usroh->santris()->detach();
        $usroh->delete();
        
        return redirect()->route('usrohs.index')->with('success', 'Kelompok Usroh berhasil dihapus.');
    }

    /**
     * Menambahkan santri ke dalam kelompok usroh.
     */
    public function addSantri(Request $request, Usroh $usroh)
    {
        $request->validate([
            'santri_id' => ['required', 'integer', Rule::exists('santris', 'id')],
        ]);

        // 'attach' digunakan untuk menambahkan relasi many-to-many
        $usroh->santris()->attach($request->santri_id);

        return redirect()->route('usrohs.show', $usroh)->with('success', 'Santri berhasil ditambahkan ke kelompok.');
    }

    /**
     * Mengeluarkan santri dari kelompok usroh.
     */
    public function removeSantri(Request $request, Usroh $usroh)
    {
        $request->validate([
            'santri_id' => ['required', 'integer', Rule::exists('santris', 'id')],
        ]);

        // 'detach' digunakan untuk menghapus relasi many-to-many
        $usroh->santris()->detach($request->santri_id);
        
        return redirect()->route('usrohs.show', $usroh)->with('success', 'Santri berhasil dikeluarkan dari kelompok.');
    }
}
