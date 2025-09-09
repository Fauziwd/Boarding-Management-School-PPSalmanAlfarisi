<?php

namespace App\Http\Controllers;

use App\Models\Halaqoh;
use App\Models\Teacher;
use App\Models\Santri;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HalaqohController extends Controller
{
    public function index()
    {
        $halaqohs = Halaqoh::with(['teacher.user', 'academicYear'])->withCount('santris')->latest()->paginate(10);
        return Inertia::render('Halaqoh/Index', ['halaqohs' => $halaqohs]);
    }

    public function create()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();

        $muhafidzRoleTeachers = Teacher::whereJsonContains('roles', 'Muhafidz')->pluck('id');
        $assignedTeacherIds = Halaqoh::where('academic_year_id', $activeYear ? $activeYear->id : null)->pluck('teacher_id');

        $availableTeachers = Teacher::with('user')
            ->whereIn('id', $muhafidzRoleTeachers)
            ->whereNotIn('id', $assignedTeacherIds)
            ->get();

        return Inertia::render('Halaqoh/Create', [
            'muhafidzs' => $availableTeachers,
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => ['required', 'integer', Rule::exists('teachers', 'id')],
            'academic_year_id' => ['required', 'integer', Rule::exists('academic_years', 'id')],
        ]);
        Halaqoh::create($request->all());
        return redirect()->route('halaqohs.index')->with('success', 'Kelompok Halaqoh berhasil dibuat.');
    }

    public function show(Halaqoh $halaqoh)
    {
        $halaqoh->load(['teacher.user', 'academicYear', 'santris.kelas']);

        // --- PERUBAHAN DI SINI ---
        // Memastikan hanya santri berstatus 'Aktif' yang belum punya halaqoh di tahun ajaran ini yang diambil
        $availableSantris = Santri::where('status_santri', 'Aktif')
            ->whereDoesntHave('halaqohs', function ($query) use ($halaqoh) {
                $query->where('academic_year_id', $halaqoh->academic_year_id);
            })
            ->orderBy('nama_santri', 'asc')
            ->get(['id', 'nama_santri', 'nis']);
            
        return Inertia::render('Halaqoh/Show', [
            'halaqoh' => $halaqoh, 
            'availableSantris' => $availableSantris
        ]);
    }

    public function addSantri(Request $request, Halaqoh $halaqoh)
    {
        $request->validate(['santri_id' => 'required|exists:santris,id']);
        $halaqoh->santris()->attach($request->santri_id);
        return redirect()->back()->with('success', 'Santri berhasil ditambahkan.');
    }

    public function removeSantri(Request $request, Halaqoh $halaqoh)
    {
        $request->validate(['santri_id' => 'required|exists:santris,id']);
        $halaqoh->santris()->detach($request->santri_id);
        return redirect()->back()->with('success', 'Santri berhasil dikeluarkan.');
    }

    public function destroy(Halaqoh $halaqoh)
    {
        $halaqoh->santris()->detach();
        $halaqoh->delete();
        return redirect()->route('halaqohs.index')->with('success', 'Kelompok Halaqoh berhasil dihapus.');
    }
}