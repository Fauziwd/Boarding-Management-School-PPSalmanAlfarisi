<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    /**
     * Menampilkan halaman daftar tahun ajaran.
     */
    public function index()
    {
        return Inertia::render('AcademicYear/Index', [
            'academicYears' => AcademicYear::latest()->get(),
        ]);
    }

    /**
     * Menyimpan tahun ajaran baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:10|unique:academic_years,year,NULL,id,semester,' . $request->semester,
            'semester' => 'required|string|max:20',
        ], [
            'year.unique' => 'Kombinasi Tahun Ajaran dan Semester sudah ada.'
        ]);

        AcademicYear::create($validated);

        return to_route('academic-years.index')->with('success', 'Tahun Ajaran berhasil ditambahkan.');
    }

    /**
     * Mengupdate data tahun ajaran di database.
     */
    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'year' => 'required|string|max:10|unique:academic_years,year,' . $academicYear->id . ',id,semester,' . $request->semester,
            'semester' => 'required|string|max:20',
        ], [
            'year.unique' => 'Kombinasi Tahun Ajaran dan Semester sudah ada.'
        ]);

        $academicYear->update($validated);

        return to_route('academic-years.index')->with('success', 'Tahun Ajaran berhasil diperbarui.');
    }

    /**
     * Menghapus tahun ajaran dari database.
     */
    public function destroy(AcademicYear $academicYear)
    {
        if ($academicYear->reportCards()->exists()) {
            return to_route('academic-years.index')->with('error', 'Tahun Ajaran tidak dapat dihapus karena sudah memiliki data rapor terkait.');
        }

        $academicYear->delete();

        return to_route('academic-years.index')->with('success', 'Tahun Ajaran berhasil dihapus.');
    }

    /**
     * Mengatur sebuah tahun ajaran menjadi aktif.
     */
    public function setActive(AcademicYear $academicYear)
    {
        // 1. Nonaktifkan semua tahun ajaran lain
        AcademicYear::where('is_active', true)->update(['is_active' => false]);

        // 2. Aktifkan tahun ajaran yang dipilih
        $academicYear->update(['is_active' => true]);

        return to_route('academic-years.index')->with('success', $academicYear->year . ' - ' . $academicYear->semester . ' berhasil diaktifkan.');
    }
}