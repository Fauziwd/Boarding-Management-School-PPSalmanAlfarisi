<?php

namespace App\Http\Controllers;

use App\Models\StudyClass;
use App\Models\Teacher;
use App\Models\Santri;
use App\Models\Akademik;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudyClassController extends Controller
{
    public function index()
    {
        $studyClasses = StudyClass::with(['teacher.user', 'academicYear'])->withCount('santris')->latest()->paginate(10);
        return Inertia::render('StudyClass/Index', [
            'studyClasses' => $studyClasses
        ]);
    }

    public function create()
    {
        $jsonPath = resource_path('js/data/dataKitabDurus.json');
        $kitabData = json_decode(file_get_contents($jsonPath), true);
        $kitabNames = collect($kitabData)->pluck('kitab')->unique()->values();

        return Inertia::render('StudyClass/Create', [
            'mudarrises' => Teacher::whereJsonContains('roles', 'Mudaris')->with('user')->get(),
            'academicYears' => AcademicYear::where('is_active', true)->get(),
            'kitabNames' => $kitabNames,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'teacher_id' => ['required', 'integer', Rule::exists('teachers', 'id')],
            'academic_year_id' => ['required', 'integer', Rule::exists('academic_years', 'id')],
        ]);
        StudyClass::create($request->all());
        return redirect()->route('study-classes.index')->with('success', 'Kelas berhasil dibuat.');
    }

    public function show(StudyClass $study_class)
    {
        $study_class->load(['teacher.user', 'academicYear', 'santris.kelas']);
        
        $kitabName = str_replace('Kelas ', '', $study_class->name);

        $tamatSantriIds = Akademik::where('kitab', $kitabName)
            ->where('status', 'Tamat')
            ->pluck('santri_id')
            ->unique();

        $enrolledSantriIds = DB::table('santri_study_class')
            ->join('study_classes', 'santri_study_class.study_class_id', '=', 'study_classes.id')
            ->where('study_classes.name', $study_class->name)
            ->where('study_classes.academic_year_id', $study_class->academic_year_id)
            ->pluck('santri_study_class.santri_id');

        $availableSantris = Santri::whereNotIn('id', $tamatSantriIds)
            ->whereNotIn('id', $enrolledSantriIds)
            ->with(['akademiks' => function ($query) use ($kitabName) {
                $query->where('kitab', $kitabName)->where('status', '!=', 'Tamat');
            }])
            ->orderBy('nama_santri')
            ->get(['id', 'nama_santri', 'nis']);
            
        return Inertia::render('StudyClass/Show', [
            'studyClass' => $study_class, 
            'availableSantris' => $availableSantris
        ]);
    }

    public function addSantri(Request $request, StudyClass $study_class)
    {
        $request->validate(['santri_id' => 'required|exists:santris,id']);
        
        DB::transaction(function () use ($request, $study_class) {
            $study_class->santris()->attach($request->santri_id);
            
            $kitabName = str_replace('Kelas ', '', $study_class->name);

            // Cek apakah santri sudah punya entri akademik untuk kitab ini
            $existingAkademik = Akademik::where('santri_id', $request->santri_id)
                                        ->where('kitab', $kitabName)
                                        ->exists();

            // Jika belum ada, buat entri baru
            if (!$existingAkademik) {
                Akademik::create([
                    'santri_id' => $request->santri_id,
                    'kitab' => $kitabName,
                    'bab' => 'Muqaddimah', // Atau bab default lainnya
                    'status' => 'Belum Selesai',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Santri berhasil ditambahkan.');
    }

    public function removeSantri(Request $request, StudyClass $study_class)
    {
        $request->validate(['santri_id' => 'required|exists:santris,id']);
        $study_class->santris()->detach($request->santri_id);
        return redirect()->back()->with('success', 'Santri berhasil dikeluarkan.');
    }
    
    public function destroy(StudyClass $study_class)
    {
        $study_class->santris()->detach();
        $study_class->delete();
        return redirect()->route('study-classes.index')->with('success', 'Kelas berhasil dihapus.');
    }
}