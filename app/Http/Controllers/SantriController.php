<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;
use App\Models\Achievement;

class SantriController extends Controller
{
    // Menampilkan daftar santri
    public function index()
    {
        $santris = Santri::paginate(5); // Pastikan tabel 'santris' memiliki data
    
        return Inertia::render('Santri/Index', [
            'santris' => $santris,
        ]);
    }   
    
    public function show(Santri $santri)
    {
        return Inertia::render('Santri/Show', [
            'santri' => $santri, // pastikan data santri dikirim
        ]);
    }
    

    // Form untuk menambahkan santri
    public function create()
    {
        return Inertia::render('Santri/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nis' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'tahun_lulus' => 'required|string|max:255',
            'tempat_lahir' => 'required|string|max:255',
            'tanggal_lahir' => 'required|date',
            'anak_ke' => 'required|integer',
            'status_yatim_piatu' => 'required|string|max:255',
            'nama_bapak' => 'required|string|max:255',
            'pekerjaan_bapak' => 'required|string|max:255',
            'no_telpon_bapak' => 'required|string|max:255',
            'nama_ibu' => 'required|string|max:255',
            'pekerjaan_ibu' => 'required|string|max:255',
            'no_telpon_ibu' => 'required|string|max:255',
            'alamat' => 'required|string|max:255',
            'kelurahan' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'kabupaten_kota' => 'required|string|max:255',
            'provinsi' => 'required|string|max:255',
            'kode_pos' => 'required|string|max:255',
        ]);

        Santri::create($request->all());
        return redirect()->route('santri');
    }


}