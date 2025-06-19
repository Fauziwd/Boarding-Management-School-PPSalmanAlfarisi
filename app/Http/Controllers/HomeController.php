<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $query = Santri::query();

        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('tempat_lahir', 'like', "%{$search}%")
                  ->orWhere('tanggal_lahir', 'like', "%{$search}%")
                  ->orWhere('tahun_lulus', 'like', "%{$search}%");
        }

        $query->orderBy('nis', 'asc');

        $perPage = $request->input('perPage', 5);
        $santris = $query->paginate($perPage)->withQueryString();

        $authData = Auth::check() ? [
            'user' => [
                'name' => Auth::user()->name,
                'role' => Auth::user()->role ?? 'Tidak Diketahui',
                'email' => Auth::user()->email,
            ]
        ] : null;

        return Inertia::render('Dashboard', [
            'auth' => $authData,
            'attendanceStats' => [],
            'totalAttendances' => 0,
            'santris' => $santris,
            'filters' => $request->only(['search', 'page', 'perPage']),
        ]);
    }
}