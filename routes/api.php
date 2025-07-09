<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AkademikController;
use App\Http\Controllers\HafalanController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SantriController;

// Route yang dapat diakses publik (tanpa login)
Route::get('/akademiks/{santri_id}', [AkademikController::class, 'getBySantri']);
Route::get('/hafalans/{santriId}', [HafalanController::class, 'getBySantriId'])->name('hafalans.getBySantriId');
Route::get('/check-nis/{nis}', [SantriController::class, 'checkNis']);

// Route yang memerlukan otentikasi (login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // ✅ Pastikan route ini ada di dalam grup middleware
    Route::get('/attendance/students', [AttendanceController::class, 'getStudentsByGroup'])
         ->name('api.attendance.getStudents');
});