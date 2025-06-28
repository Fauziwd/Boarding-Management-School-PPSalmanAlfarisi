<?php
use App\Http\Controllers\AkademikController;
use App\Http\Controllers\HafalanController;
use App\Http\Controllers\AttendanceController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SantriController; 

Route::get('/akademiks/{santri_id}', [AkademikController::class, 'getBySantri']);
Route::get('/hafalans/{santriId}', [HafalanController::class, 'getBySantriId'])->name('hafalans.getBySantriId');
Route::get('/get-students-for-attendance', [App\Http\Controllers\AttendanceController::class, 'getStudentsByGroup'])->name('attendance.getStudents');
Route::get('/check-nis/{nis}', [SantriController::class, 'checkNis']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

