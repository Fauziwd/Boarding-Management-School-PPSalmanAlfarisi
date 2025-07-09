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
    public function index()
    {
        $usrohs = Usroh::with(['murobbi.user', 'academicYear'])
            ->withCount('santris')
            ->latest()
            ->paginate(10);
            
        return Inertia::render('Usroh/Index', [
            'usrohs' => $usrohs,
        ]);
    }

    public function create()
    {
        return Inertia::render('Usroh/Create', [
            'murobbis' => Teacher::whereJsonContains('roles', 'Murobbi')->with('user')->get(),
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

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

    public function show(Usroh $usroh)
    {
        $usroh->load(['murobbi.user', 'academicYear', 'santris.kelas']);

        $availableSantris = Santri::whereDoesntHave('usrohs', function ($query) use ($usroh) {
            $query->where('academic_year_id', $usroh->academic_year_id);
        })->get();

        return Inertia::render('Usroh/Show', [
            'usroh' => $usroh,
            'availableSantris' => $availableSantris,
        ]);
    }

    public function edit(Usroh $usroh)
    {
        return Inertia::render('Usroh/Edit', [
            'usroh' => $usroh,
            'murobbis' => Teacher::whereJsonContains('roles', 'Murobbi')->with('user')->get(),
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

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

    public function destroy(Usroh $usroh)
    {
        $usroh->santris()->detach();
        $usroh->delete();
        
        return redirect()->route('usrohs.index')->with('success', 'Kelompok Usroh berhasil dihapus.');
    }

    public function addSantri(Request $request, Usroh $usroh)
    {
        $request->validate([
            'santri_id' => ['required', 'integer', Rule::exists('santris', 'id')],
        ]);

        $usroh->santris()->attach($request->santri_id);

        return redirect()->route('usrohs.show', $usroh)->with('success', 'Santri berhasil ditambahkan ke kelompok.');
    }

    public function removeSantri(Request $request, Usroh $usroh)
    {
        $request->validate([
            'santri_id' => ['required', 'integer', Rule::exists('santris', 'id')],
        ]);

        $usroh->santris()->detach($request->santri_id);
        
        return redirect()->route('usrohs.show', $usroh)->with('success', 'Santri berhasil dikeluarkan dari kelompok.');
    }
}