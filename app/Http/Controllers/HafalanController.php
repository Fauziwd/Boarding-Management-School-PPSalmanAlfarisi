<?php

namespace App\Http\Controllers;

use App\Models\Hafalan;
use App\Models\Santri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HafalanController extends Controller
{
    public function index(Request $request)
    {
        $hafalans = Hafalan::with('santri')->paginate(5);
        $currentMonth = date('Y-m');
        $juzCount = Hafalan::select('juz', \DB::raw('count(*) as total'))
            ->where('month', 'like', $currentMonth . '%')
            ->groupBy('juz')
            ->orderBy('total', 'desc')
            ->get();

        $topJuz = $juzCount->first();

        return Inertia::render('Hafalan/Index', [
            'hafalans' => $hafalans,
            'juzCount' => $juzCount,
            'topJuz' => $topJuz,
        ]);
    }

    public function getBySantriId($santriId)
    {
        // Ambil semua data hafalan berdasarkan santri_id
        $hafalans = Hafalan::where('santri_id', $santriId)->get();

        return response()->json($hafalans);
    }

    public function create()
    {
        $santris = Santri::all();
        return Inertia::render('Hafalan/Create', ['santris' => $santris]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'juz' => 'required|integer',
            'month' => 'required|date_format:Y-m',
        ]);

        Hafalan::create($request->all());
        return redirect()->route('hafalan.index')->with('success', 'Hafalan berhasil ditambahkan.');
    }

    public function edit(Hafalan $hafalan)
    {
        $santris = Santri::all();
        return Inertia::render('Hafalan/Edit', ['hafalan' => $hafalan, 'santris' => $santris]);
    }

    public function update(Request $request, Hafalan $hafalan)
    {
        $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'juz' => 'required|integer',
            'month' => 'required|date_format:Y-m',
        ]);
    
        $hafalan->update($request->all());
        return redirect()->route('hafalan.index')->with('success', 'Hafalan berhasil diperbarui.');
    }

    public function destroy(Hafalan $hafalan)
    {
        $hafalan->delete();
        return redirect()->route('hafalan.index')->with('success', 'Hafalan berhasil dihapus.');
    }

    public function monthlySummary(Request $request)
    {
        $month = $request->input('month');

        $summary = Hafalan::where('month', 'like', $month . '%')
            ->get()
            ->groupBy('juz')
            ->map(function ($group) {
                return $group->map(function ($hafalan) {
                    return [
                        'nama' => $hafalan->santri->nama,
                        'created_at' => $hafalan->created_at->format('Y-m-d H:i:s'),
                    ];
                });
            });

        return response()->json($summary);
    }
}