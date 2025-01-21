<?php

namespace App\Http\Controllers;

use App\Models\Achievement;
use App\Models\Santri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AchievementController extends Controller
{
    public function index()
    {
        $achievements = Achievement::with('santri')->paginate(5);

        return Inertia::render('Achievement/Index', [
            'achievements' => $achievements,
        ]);
    }

    public function create(Request $request)
    {
        $santriId = $request->query('santri_id');
        $santri = $santriId ? Santri::findOrFail($santriId) : null;
        $santris = Santri::all();

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
            'date' => 'required|date',
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

    public function getAchievements($santri_id)
    {
        // Mengambil data pencapaian berdasarkan santri_id
        $achievements = Achievement::where('santri_id', $santri_id)->get();
        return response()->json($achievements);
    }
}
