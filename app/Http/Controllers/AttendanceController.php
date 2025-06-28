<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Santri;
use App\Models\Teacher;
use App\Models\Halaqoh;
use App\Models\StudyClass;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{
    /**
     * Menampilkan halaman statistik absensi.
     */
    public function index()
    {
        // Menentukan rentang waktu (misalnya, 30 hari terakhir)
        $endDate = Carbon::today();
        $startDate = $endDate->copy()->subDays(29);

        // 1. Data untuk Grafik Total Absensi
        $attendanceSummary = Attendance::whereBetween('attendance_date', [$startDate, $endDate])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        // 2. Data untuk Top 3 Santri (Sakit, Izin, Alpa)
        $topSakit = $this->getTopAbsentees('Sakit', $startDate, $endDate);
        $topIzin = $this->getTopAbsentees('Izin', $startDate, $endDate);
        $topAlpa = $this->getTopAbsentees('Alpa', $startDate, $endDate);

        return Inertia::render('Absensi/Index', [
            'stats' => [
                'summary' => [
                    'hadir' => $attendanceSummary->get('Hadir', 0),
                    'sakit' => $attendanceSummary->get('Sakit', 0),
                    'izin' => $attendanceSummary->get('Izin', 0),
                    'alpa' => $attendanceSummary->get('Alpa', 0),
                ],
                'topSakit' => $topSakit,
                'topIzin' => $topIzin,
                'topAlpa' => $topAlpa,
            ]
        ]);
    }

    /**
     * Helper function untuk mengambil top absensi.
     */
    private function getTopAbsentees($status, $startDate, $endDate)
    {
        return Attendance::with('santri:id,nama_santri,foto')
            ->where('status', $status)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->select('santri_id', DB::raw('count(*) as total'))
            ->groupBy('santri_id')
            ->orderBy('total', 'desc')
            ->limit(3)
            ->get();
    }

    /**
     * Menampilkan halaman untuk menginput absensi.
     */
    public function create()
    {
        // Mengambil daftar grup yang bisa diabsen
        $halaqohs = Halaqoh::with('teacher.user')->get(['id', 'name', 'teacher_id']);
        $studyClasses = StudyClass::with('teacher.user')->get(['id', 'name', 'teacher_id']);

        return Inertia::render('Absensi/Create', [
            'halaqohs' => $halaqohs,
            'studyClasses' => $studyClasses,
        ]);
    }

    /**
     * Menyimpan data absensi dari form.
     */
    public function store(Request $request)
    {
        $request->validate([
            'attendance_date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.santri_id' => 'required|exists:santris,id',
            'attendances.*.status' => 'required|in:Hadir,Sakit,Izin,Alpa',
            'attendances.*.notes' => 'nullable|string',
        ]);

        $user = Auth::user();
        $teacher = Teacher::where('user_id', $user->id)->firstOrFail();

        foreach ($request->attendances as $attData) {
            Attendance::updateOrCreate(
                [
                    'santri_id' => $attData['santri_id'],
                    'attendance_date' => $request->attendance_date,
                ],
                [
                    'status' => $attData['status'],
                    'notes' => $attData['notes'],
                    'teacher_id' => $teacher->id,
                ]
            );
        }

        return redirect()->route('absensi.index')->with('success', 'Absensi berhasil disimpan!');
    }

    /**
     * API untuk mengambil daftar santri dan status absensi mereka.
     */
    public function getStudentsByGroup(Request $request)
    {
        $request->validate([
            'group_type' => 'required|in:halaqoh,study_class',
            'group_id' => 'required|integer',
            'date' => 'required|date'
        ]);

        $groupType = $request->group_type;
        $groupId = $request->group_id;
        $date = $request->date;

        $group = ($groupType === 'halaqoh') 
            ? Halaqoh::with('santris:id,nama_santri,nis')->find($groupId) 
            : StudyClass::with('santris:id,nama_santri,nis')->find($groupId);

        if (!$group) {
            return response()->json(['students' => []]);
        }
        
        $studentIds = $group->santris->pluck('id');

        $existingAttendances = Attendance::whereIn('santri_id', $studentIds)
            ->where('attendance_date', $date)
            ->pluck('status', 'santri_id');
        
        $students = $group->santris->map(function ($santri) use ($existingAttendances) {
            $santri->attendance_status = $existingAttendances->get($santri->id, null); // null jika belum diabsen
            return $santri;
        });

        return response()->json(['students' => $students]);
    }
}
