<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\StudyClass;
use App\Models\Halaqoh;
use Illuminate\Support\Carbon;

class AttendanceController extends Controller
{
    /**
     * Menampilkan halaman laporan absensi dengan filter.
     */
    public function index(Request $request)
    {
        $request->validate([
            'group_type' => 'nullable|in:study_class,halaqoh',
            'group_id' => 'nullable|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $query = Attendance::with('santri:id,nama_santri,nis', 'teacher:id,nama_pengajar')
                    ->latest('attendance_date');

        // Filter berdasarkan kelompok (Kelas atau Halaqoh)
        if ($request->filled('group_id') && $request->filled('group_type')) {
            $groupId = $request->group_id;
            if ($request->group_type === 'study_class') {
                $santriIds = StudyClass::findOrFail($groupId)->santris()->pluck('santris.id');
            } else {
                $santriIds = Halaqoh::findOrFail($groupId)->santris()->pluck('santris.id');
            }
            $query->whereIn('santri_id', $santriIds);
        }

        // Filter berdasarkan rentang tanggal
        $startDate = $request->filled('start_date') ? Carbon::parse($request->start_date) : now()->startOfMonth();
        $endDate = $request->filled('end_date') ? Carbon::parse($request->end_date) : now()->endOfDay();
        
        $query->whereBetween('attendance_date', [$startDate, $endDate]);

        $attendances = $query->paginate(20)->withQueryString();

        return Inertia::render('Absensi/Index', [
            'attendances' => $attendances,
            'studyClasses' => StudyClass::orderBy('name')->get(['id', 'name']),
            'halaqohs' => Halaqoh::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['group_type', 'group_id', 'start_date', 'end_date']),
        ]);
    }
}