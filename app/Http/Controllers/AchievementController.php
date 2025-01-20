<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Santri; // Pastikan penggunaan nama kelas ini benar
use Illuminate\Http\Request;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = Achievement::with('santri')->paginate(5); // Menggunakan paginate untuk membatasi jumlah data yang ditampilkan per halaman

        return Inertia::render('Achievement/Index', [
            'achievements' => $achievements
        ]);
    }

    public function create(Request $request)
    {
        $santriId = $request->query('santri_id');
        $santri = null;
        $santris = [];

        if ($santriId) {
            $santri = Santri::findOrFail($santriId);
        } else {
            $santris = Santri::all();
        }

        return Inertia::render('Achievement/Create', [
            'santri' => $santri,
            'santris' => $santris,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date', // Validasi untuk field date
        ]);

        Achievement::create($request->all());

        return redirect()->route('achievements.index')
            ->with('success', 'Pencapaian berhasil ditambahkan.');
    }

    public function edit(Achievement $achievement)
    {
        $santris = Santri::all();

        return Inertia::render('Achievement/Edit', [
            'achievement' => $achievement,
            'santris' => $santris,
        ]);
    }

    public function update(Request $request, Achievement $achievement)
    {
        \Log::info('Update Achievement Request:', $request->all());
    
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'title' => 'required|string|max:255',
            'type' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|date',
        ]);
    
        $achievement->update($request->all());
    
        return redirect()->route('achievements.index')
            ->with('success', 'Pencapaian berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);
        $achievement->delete();
    
        return response()->json(['success' => true, 'message' => 'Pencapaian berhasil dihapus.']);
    }
}