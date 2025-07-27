<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AkademikController;
use App\Http\Controllers\HafalanController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SantriController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/akademiks/history/{santri}', [AkademikController::class, 'getStudyClassesForSantri'])->name('akademik.history');
Route::get('/check-nis/{nis}', [SantriController::class, 'checkNis']);

// Route yang memerlukan otentikasi (login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route untuk riwayat hafalan
    Route::get('/hafalans/history/{santri}', [HafalanController::class, 'getHafalanHistory'])->name('hafalans.history');

    Route::get('/attendance/students', [AttendanceController::class, 'getStudentsByGroup'])
         ->name('api.attendance.getStudents');
});
