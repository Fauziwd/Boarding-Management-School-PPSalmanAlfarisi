<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\AttendanceController;
// use App\Http\Controllers\AchievementController;
use App\Http\Controllers\AkademikController;
use App\Http\Controllers\HafalanController;
use Inertia\Inertia;

// Halaman Welcome
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Halaman Dashboard
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth'])->name('dashboard');
Route::get('/dashboard', [AttendanceController::class, 'dashboard'])->middleware(['auth'])->name('dashboard');

// CRUD Users
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/update/{user}', [UserController::class, 'update'])->name('users.update');
});

// Absensi
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/absensi', [AttendanceController::class, 'index'])->name('absensi');
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendances/submit', [AttendanceController::class, 'submit'])->name('attendances.submit');
});
Route::get('/attendances/check-today', [AttendanceController::class, 'checkTodayAttendance'])->name('attendances.checkToday');


// CRUD Santri
Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/santri', [SantriController::class, 'index'])->name('santri');
        Route::get('/santris/create', [SantriController::class, 'create'])->name('santris.create');
        Route::post('/santris/store', [SantriController::class, 'store'])->name('santris.store');
        Route::get('/santris', [SantriController::class, 'index'])->name('santris.index');
        Route::get('/santris/{santri}/edit', [SantriController::class, 'edit'])->name('santris.edit');
        Route::patch('/santris/{santri}', [SantriController::class, 'update'])->name('santris.update');
        Route::get('/santris/{santri}', [SantriController::class, 'show'])->name('santris.show');
        Route::delete('/santris/{santri}', [SantriController::class, 'destroy'])->name('santris.destroy');
        Route::get('/santri/{id}', [SantriController::class, 'show']);
        Route::get('/api/akademiks/{santriId}', [AkademikController::class, 'getBySantriId']);
        Route::get('/api/hafalans/{santriId}', [HafalanController::class, 'getBySantriId']);
    });

// CRUD Akademik
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/akademik', [AkademikController::class, 'index'])->name('akademik.index');
    Route::get('/akademik/create', [AkademikController::class, 'create'])->name('akademik.create');
    Route::post('/akademik/store', [AkademikController::class, 'store'])->name('akademik.store');
    Route::get('/akademik/{akademik}', [AkademikController::class, 'show'])->name('akademik.show');
    Route::get('/akademik/{akademik}/edit', [AkademikController::class, 'edit'])->name('akademik.edit');
    Route::patch('/akademik/{akademik}', [AkademikController::class, 'update'])->name('akademik.update');
    Route::delete('/akademik/{akademik}', [AkademikController::class, 'destroy'])->name('akademik.destroy');
});

// CRUD Hafalan
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/hafalan', [HafalanController::class, 'index'])->name('hafalan.index');
    Route::get('/hafalan/create', [HafalanController::class, 'create'])->name('hafalan.create');
    Route::post('/hafalan', [HafalanController::class, 'store'])->name('hafalan.store');
    Route::get('/hafalan/{hafalan}/edit', [HafalanController::class, 'edit'])->name('hafalan.edit');
    Route::patch('/hafalan/{hafalan}', [HafalanController::class, 'update'])->name('hafalan.update');
    Route::delete('/hafalan/{hafalan}', [HafalanController::class, 'destroy'])->name('hafalan.destroy');
    
    Route::get('/hafalans/monthly-summary', [HafalanController::class, 'monthlySummary'])->name('hafalan.monthlySummary');
});

// Profil Pengguna
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

Route::post('/attendances/submit', [AttendanceController::class, 'submit'])->name('attendances.submit');
});

// Otentikasi Laravel
require __DIR__ . '/auth.php';


// CRUD Achievements
// Route::middleware(['auth'])->group(function () {
//     Route::get('/achievements', [AchievementController::class, 'index'])->name('achievements.index');
//     Route::get('/achievements/create', [AchievementController::class, 'create'])->name('achievements.create');
//     Route::post('/achievements', [AchievementController::class, 'store'])->name('achievements.store');
//     Route::get('/achievements/edit/{achievement}', [AchievementController::class, 'edit'])->name('achievements.edit');
//     Route::patch('/achievements/update/{achievement}', [AchievementController::class, 'update'])->name('achievements.update');
//     Route::delete('/achievements/{id}', [AchievementController::class, 'destroy'])->name('achievements.destroy');

// Route::get('/achievements/{santriId}', [AchievementController::class, 'index']);
// });