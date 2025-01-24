<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;

class AttendanceController extends Controller
{
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

        // return response()->json($attendance, 201);
    }
}
