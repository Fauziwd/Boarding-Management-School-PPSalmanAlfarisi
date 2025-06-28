<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;

class HomeController extends Controller
{
    /**
     * Menampilkan data di dashboard dengan filter status dan pencarian.
     */
    public function index(Request $request)
    {
        $query = Santri::query()->with('kelas'); // Eager load relasi kelas

        // Filter berdasarkan status santri. Defaultnya adalah 'Aktif'.
        $statusFilter = $request->input('status', 'Aktif');
        if ($statusFilter && $statusFilter !== 'Semua') {
            $query->where('status_santri', $statusFilter);
        }

        // Filter berdasarkan kata kunci pencarian
        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            
            // Query pencarian yang sudah diperbaiki
            $query->where(function ($q) use ($search) {
                $q->where('nama_santri', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('tempat_lahir', 'like', "%{$search}%")
                    // Menambahkan pencarian berdasarkan nama kelas
                    ->orWhereHas('kelas', function ($subQuery) use ($search) {
                        $subQuery->where('nama_kelas', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = $request->input('perPage', 10);
        $santris = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Dashboard', [
            'santris' => $santris,
            // Mengirim kembali filter yang sedang aktif ke frontend
            'filters' => $request->only(['search', 'perPage', 'status']),
        ]);
    }
}
