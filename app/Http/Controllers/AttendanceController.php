<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;
use App\Models\Attendance;
use App\Models\StudyClass;
use App\Models\Halaqoh;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', now()->format('Y-m-d'));

        $santris = Santri::with(['halaqohs', 'studyClasses'])
            ->where('status_santri', 'Aktif')
            ->get();

        $attendances = Attendance::where('attendance_date', $date)
            ->get()
            ->keyBy(fn($item) => $item->santri_id . '-' . $item->teacher_id);

        // Inisialisasi statistik
        $stats = [
            'Hadir' => 0,
            'Sakit' => 0,
            'Izin' => 0,
            'Alpa' => 0,
            'Belum Absen' => 0,
            'Tanpa Kelompok' => 0,
        ];
        $santriTanpaKelompok = 0;

        $attendanceData = $santris->map(function ($santri) use ($attendances, &$stats, &$santriTanpaKelompok) {
            $halaqoh = $santri->halaqohs->first();
            $studyClass = $santri->studyClasses->first();

            $hasHalaqoh = (bool)$halaqoh;
            $hasStudyClass = (bool)$studyClass;

            $halaqohAttendanceStatus = 'Belum Absen';
            if ($hasHalaqoh) {
                $halaqohAttendance = $attendances->get($santri->id . '-' . $halaqoh?->teacher_id);
                if ($halaqohAttendance) {
                    $halaqohAttendanceStatus = $halaqohAttendance->status;
                    $stats[$halaqohAttendanceStatus]++;
                } else {
                    $stats['Belum Absen']++;
                }
            }
            
            $studyClassAttendanceStatus = 'Belum Absen';
            if ($hasStudyClass) {
                $studyClassAttendance = $attendances->get($santri->id . '-' . $studyClass?->teacher_id);
                if ($studyClassAttendance) {
                    $studyClassAttendanceStatus = $studyClassAttendance->status;
                    // Hindari penghitungan ganda jika statusnya sama dengan halaqoh
                    if (!$hasHalaqoh || $halaqohAttendanceStatus !== $studyClassAttendanceStatus) {
                         if(isset($stats[$studyClassAttendanceStatus])) {
                            $stats[$studyClassAttendanceStatus]++;
                         }
                    }
                } else {
                    $stats['Belum Absen']++;
                }
            }

            if (!$hasHalaqoh && !$hasStudyClass) {
                $santriTanpaKelompok++;
            }

            return [
                'id' => $santri->id,
                'name' => $santri->nama_santri,
                'halaqoh_attendance' => $hasHalaqoh ? $halaqohAttendanceStatus : 'Tidak Ada Halaqoh',
                'study_class_attendance' => $hasStudyClass ? $studyClassAttendanceStatus : 'Tidak Ada Kelas',
                'has_halaqoh' => $hasHalaqoh,
                'has_study_class' => $hasStudyClass,
            ];
        });

        $stats['Tanpa Kelompok'] = $santriTanpaKelompok;

        return Inertia::render('Absensi/Index', [
            'attendanceData' => $attendanceData,
            'filterDate' => $date,
            'stats' => $stats, // Kirim statistik yang sudah dihitung
        ]);
    }

    // ... metode lainnya (create, store, updateByAdmin, dll) tidak perlu diubah ...
    public function create()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            $halaqohs = Halaqoh::with('teacher.user')->get();
            $studyClasses = StudyClass::with('teacher.user')->get();
        } elseif ($user->role === 'teacher' && $user->teacher) {
            $teacher_id = $user->teacher->id;
            $halaqohs = Halaqoh::where('teacher_id', $teacher_id)->with('teacher.user')->get();
            $studyClasses = StudyClass::where('teacher_id', $teacher_id)->with('teacher.user')->get();
        } else {
            return redirect()->route('dashboard')->with('error', 'Anda tidak memiliki akses ke halaman ini.');
        }

        $halaqohs = $halaqohs->filter(fn($h) => $h->teacher && $h->teacher->user);
        $studyClasses = $studyClasses->filter(fn($sc) => $sc->teacher && $sc->teacher->user);

        return Inertia::render('Absensi/Create', [
            'halaqohs' => $halaqohs->values(),
            'studyClasses' => $studyClasses->values(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'attendance_date' => 'required|date',
            'group_type' => 'required|in:halaqoh,study_class',
            'group_id' => 'required|integer',
            'attendances' => 'required|array',
            'attendances.*.santri_id' => 'required|integer|exists:santris,id',
            'attendances.*.status' => 'required|in:Hadir,Sakit,Izin,Alpa',
            'attendances.*.notes' => 'nullable|string',
        ]);

        $group = ($request->group_type === 'halaqoh')
            ? Halaqoh::findOrFail($request->group_id)
            : StudyClass::findOrFail($request->group_id);

        if (Auth::user()->role === 'teacher' && $group->teacher_id !== Auth::user()->teacher->id) {
            throw ValidationException::withMessages(['group_id' => 'Anda tidak berhak menginput absensi kelompok ini.']);
        }
        
        DB::transaction(function () use ($request, $group) {
            if (Auth::user()->role === 'teacher') {
                $requestedSantriIds = collect($request->attendances)->pluck('santri_id');
                $existing = Attendance::where('attendance_date', $request->attendance_date)
                    ->where('teacher_id', $group->teacher_id)
                    ->whereIn('santri_id', $requestedSantriIds)
                    ->exists();

                if ($existing) {
                    throw ValidationException::withMessages(['group_id' => 'Absensi untuk beberapa santri di kelompok ini sudah diinput hari ini. Hanya admin yang bisa mengubahnya.']);
                }
            }

            foreach ($request->attendances as $att) {
                Attendance::updateOrInsert(
                    [
                        'santri_id' => $att['santri_id'],
                        'attendance_date' => $request->attendance_date,
                        'teacher_id' => $group->teacher_id,
                    ],
                    [
                        'status' => $att['status'],
                        'notes' => $att['notes'] ?? null,
                    ]
                );
            }
        });

        return redirect()->route('absensi.index')->with('success', 'Absensi berhasil disimpan.');
    }

    public function updateByAdmin(Request $request)
    {
        $request->validate([
            'santri_id' => 'required|integer|exists:santris,id',
            'date' => 'required|date',
            'type' => 'required|in:halaqoh,study_class',
            'status' => 'required|in:Hadir,Sakit,Izin,Alpa,Belum Absen',
        ]);

        $santri = Santri::with(['halaqohs', 'studyClasses'])->findOrFail($request->santri_id);

        $group = ($request->type == 'halaqoh') ? $santri->halaqohs->first() : $santri->studyClasses->first();

        if (!$group || !$group->teacher_id) {
            return back()->with('error', 'Santri tidak terdaftar di grup tersebut atau grup tidak memiliki guru.');
        }
        
        $teacher_id = $group->teacher_id;

        if ($request->status == 'Belum Absen') {
            Attendance::where('santri_id', $request->santri_id)
                ->where('attendance_date', $request->date)
                ->where('teacher_id', $teacher_id)
                ->delete();
        } else {
            Attendance::updateOrInsert(
                [
                    'santri_id' => $request->santri_id,
                    'attendance_date' => $request->date,
                    'teacher_id' => $teacher_id,
                ],
                [ 'status' => $request->status ]
            );
        }

        return back()->with('success', 'Absensi berhasil diperbarui.');
    }

    public function getStudentsForAttendance(Request $request)
    {
        $request->validate([
            'group_type' => 'required|in:halaqoh,study_class',
            'group_id' => 'required|integer',
            'date' => 'required|date'
        ]);
    
        $groupModel = $request->group_type === 'halaqoh' ? Halaqoh::class : StudyClass::class;
        $group = $groupModel::with(['santris', 'teacher.user'])->findOrFail($request->group_id);
    
        $existingAttendances = Attendance::where('attendance_date', $request->date)
            ->where('teacher_id', $group->teacher_id)
            ->whereIn('santri_id', $group->santris->pluck('id'))
            ->get()
            ->keyBy('santri_id');
    
        $students = $group->santris->map(function ($santri) use ($existingAttendances, $group) {
            $attendance = $existingAttendances->get($santri->id);
            
            return [
                'id' => $santri->id,
                'name' => $santri->nama_santri,
                'existing_attendance' => $attendance ? [
                    'status' => $attendance->status,
                    'teacher_name' => $group->teacher->user->name ?? 'N/A'
                ] : null
            ];
        });
    
        return response()->json(['students' => $students]);
    }
}
