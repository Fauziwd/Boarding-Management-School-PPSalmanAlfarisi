<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        // Retrieve all attendances with their associated users
        $attendances = Attendance::with('user')->latest()->paginate(5);

        // Retrieve today's attendances with their associated users
        $todayAttendances = Attendance::with('user')->whereDate('created_at', Carbon::today())->get();

        // Aggregate status data for chart
        $statusData = $todayAttendances->groupBy('status')->map(function($attendances, $status) {
            return [
                'status' => $status,
                'count' => $attendances->count(),
            ];
        })->values();

        return Inertia::render('Absensi/Index', [
            'attendances' => $attendances,
            'todayAttendances' => $todayAttendances,
            'statusData' => $statusData,
        ]);
    }
    
    public function submit(Request $request)
    {
        $request->validate([
            'status' => 'required',
            'description' => 'required_if:status,sick,leave,permit,business_trip,remote|max:500',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);

        Attendance::create([
            'user_id' => auth()->id(),
            'status' => $request->status,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return back()->with('success', 'Absensi berhasil disubmit');
    }

    public function checkTodayAttendance(Request $request)
    {
        $user = $request->user();
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('created_at', Carbon::today())
            ->exists();

        return response()->json(['attended' => $todayAttendance]);
    }
}