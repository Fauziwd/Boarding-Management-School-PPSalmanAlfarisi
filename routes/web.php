<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AkademikController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\HafalanController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportCardController;
use App\Http\Controllers\KelasController; 
use App\Http\Controllers\SantriController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman Publik
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| Rute yang Membutuhkan Otentikasi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    // Dashboard Utama
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');

    // Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rute Absensi
    Route::post('/attendances/submit', [AttendanceController::class, 'submit'])->name('attendances.submit');
    Route::get('/attendances/check-today', [AttendanceController::class, 'checkTodayAttendance'])->name('attendances.checkToday');
    
    // Rapor (akses umum untuk yang terotentikasi)
    Route::get('/report-cards', [ReportCardController::class, 'index'])->name('report-cards.index');
    Route::get('/report-cards/{reportCard}', [ReportCardController::class, 'show'])->name('report-cards.show');
    Route::get('/report-cards/{reportCard}/download', [ReportCardController::class, 'downloadPdf'])->name('report-cards.download');
});

/*
|--------------------------------------------------------------------------
| Rute Khusus Admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->group(function () {
    // Manajemen Pengguna
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::resource('kelas', KelasController::class)->except(['show']); 

    // Manajemen Santri
    Route::resource('santris', SantriController::class)->except(['destroy']);
    Route::delete('/santris/{santri}', [SantriController::class, 'destroy'])->name('santris.destroy');

    // Manajemen Akademik
    Route::resource('akademik', AkademikController::class);

    // Manajemen Hafalan
    Route::resource('hafalan', HafalanController::class)->except(['show']);
    Route::get('/hafalans/monthly-summary', [HafalanController::class, 'monthlySummary'])->name('hafalan.monthlySummary');

    // Manajemen Absensi (Melihat rekap)
    Route::get('/absensi', [AttendanceController::class, 'index'])->name('absensi.index');

    // Manajemen Tahun Ajaran & Rapor
    Route::resource('academic-years', AcademicYearController::class)->except(['show']);
    Route::post('academic-years/{academicYear}/set-active', [AcademicYearController::class, 'setActive'])->name('academic-years.set-active');
    Route::post('report-cards/generate', [ReportCardController::class, 'generate'])->name('report-cards.generate');
});

/*
|--------------------------------------------------------------------------
| Rute API
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('api')->group(function () {
    Route::get('/akademiks/{santriId}', [AkademikController::class, 'getBySantriId']);
    Route::get('/hafalans/{santriId}', [HafalanController::class, 'getBySantriId']);
    Route::get('/check-nis/{nis}', [SantriController::class, 'checkNis']);
    Route::get('/check-nisn/{nisn}', [SantriController::class, 'checkNisn']);
});

// File rute otentikasi default dari Laravel Breeze
require __DIR__ . '/auth.php';