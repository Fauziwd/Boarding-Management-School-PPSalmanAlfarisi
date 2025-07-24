<?php

namespace App\Http\Controllers;

use App\Models\Akademik;
use App\Models\Santri;
use App\Models\AcademicYear;
use App\Models\StudyClass; // PERBAIKAN: Import yang hilang ditambahkan
use App\Models\Teacher;    // PERBAIKAN: Import yang hilang ditambahkan
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AkademikController extends Controller
{
    /**
     * Menampilkan ringkasan pencapaian akademik per santri.
     */
   public function index(Request $request)
    {
        $query = Akademik::with('santri:id,nama_santri,nis,foto')
            ->select(
                'santri_id',
                // PERBAIKAN: Menggunakan 'nama_kitab' sesuai dengan struktur tabel baru.
                DB::raw('COUNT(DISTINCT nama_kitab) as jumlah_kitab'),
                DB::raw('COUNT(id) as total_pencapaian'),
                DB::raw('MAX(created_at) as terakhir_update')
            )
            ->groupBy('santri_id');
            
        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->whereHas('santri', function($q) use ($search) {
                $q->where('nama_santri', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }
        
        $akademiks = $query->orderBy('terakhir_update', 'desc')
                           ->paginate(10)
                           ->withQueryString();
        
        $akademiks->getCollection()->transform(function ($item) {
            if ($item->santri) {
                $item->santri->foto_url = $item->santri->foto ? Storage::url($item->santri->foto) : null;
            }
            return $item;
        });

        return Inertia::render('Akademik/Index', [
            'akademiks' => $akademiks,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Menampilkan formulir untuk menambah data akademik.
     */
   public function create()
    {
        // PERBAIKAN: Menghapus 'kelas_id' dari query karena sudah tidak ada.
        $santris = Santri::orderBy('nama_santri')
                         ->where('status_santri', 'Aktif')
                         ->get(['id', 'nama_santri', 'nis']);

        $academicYears = AcademicYear::where('is_active', true)->get();

        return Inertia::render('Akademik/Create', [
            'santris' => $santris,
            'academicYears' => $academicYears,
        ]);
    }


    /**
     * Menyimpan data akademik baru ke database.
     */
     public function store(Request $request)
    {
        // PERBAIKAN: Validasi disesuaikan dengan form frontend dinamis yang benar.
        $validatedData = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'nama_kitab' => 'required|string|max:255',
            'teacher_id' => 'required|exists:teachers,id',
            'jilid' => 'nullable|string|max:50',
            'halaman' => 'required|string|max:255', // 'halaman' dari frontend akan jadi 'keterangan'
            'nilai' => 'required|numeric|min:0|max:100',
        ]);

        // Membuat data baru di tabel akademiks
        Akademik::create([
            'santri_id' => $validatedData['santri_id'],
            'academic_year_id' => $validatedData['academic_year_id'],
            'nama_kitab' => $validatedData['nama_kitab'],
            'teacher_id' => $validatedData['teacher_id'],
            'jilid' => $validatedData['jilid'],
            'keterangan' => $validatedData['halaman'],
            'nilai' => $validatedData['nilai'],
        ]);

        return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil ditambahkan.');
    }

    

    /**
     * Menampilkan formulir untuk mengedit data akademik.
     */
    public function edit(Akademik $akademik)
    {
        // Memuat relasi agar data santri, ustadz, dan tahun ajaran tersedia
        $akademik->load(['santri', 'teacher', 'academicYear']);

        return inertia('Akademik/Edit', [
            'akademik' => $akademik,
            'academicYears' => AcademicYear::where('is_active', true)->get(),
        ]);
    }

    /**
     * Memperbarui data akademik yang sudah ada.
     */
    public function update(Request $request, Akademik $akademik)
    {
        // PERBAIKAN: Validasi disamakan dengan method store untuk konsistensi
        $validatedData = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'kitab' => 'required|string|max:255',
            'teacher_id' => 'required|exists:teachers,id',
            'jilid' => 'nullable|string|max:50',
            'keterangan' => 'required|string|max:255',
            'nilai' => 'numeric|min:0|max:100',
        ]);

        $akademik->update($validatedData);

        return redirect()->route('akademik.index')->with('success', 'Data akademik berhasil diupdate.');
    }

    /**
     * Menghapus data akademik.
     */
    public function destroy(Akademik $akademik)
    {
        $akademik->delete();
        return redirect()->route('akademik.index')->with('success', 'Pencapaian berhasil dihapus.');
    }

    /**
     * API internal untuk mengambil daftar StudyClass (kitab dan ustadz)
     * berdasarkan kelas dari santri yang dipilih.
     * PERBAIKAN: Method ini dipindahkan ke dalam kelas.
     */
   public function getStudyClassesForSantri(Santri $santri)
    {
        // PERBAIKAN: Menggunakan relasi many-to-many 'studyClasses' yang ada di model Santri,
        // bukan 'kelas_id' yang sudah dihapus.
        $studyClasses = $santri->studyClasses()->with('teacher:id,nama_guru')->get();

        $formattedData = $studyClasses->map(function ($studyClass) {
            if ($studyClass->teacher) {
                return [
                    'id' => $studyClass->id,
                    'nama_kitab' => $studyClass->nama_kitab,
                    'teacher_id' => $studyClass->teacher->id,
                    'teacher_name' => $studyClass->teacher->nama_guru,
                ];
            }
            return null;
        })->filter()->values();

        return response()->json($formattedData);
    }

}
