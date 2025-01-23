<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AbsensiController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\AchievementController;
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
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// CRUD Users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users/store', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/update/{user}', [UserController::class, 'update'])->name('users.update');
});

// Absensi
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/absensi', [AbsensiController::class, 'index'])->name('absensi');
});

// CRUD Santri
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/santri', [SantriController::class, 'index'])->name('santri');
    Route::get('/santris/create', [SantriController::class, 'create'])->name('santris.create');
    Route::post('/santris/store', [SantriController::class, 'store'])->name('santris.store');
    Route::get('/santris', [SantriController::class, 'index'])->name('santris.index');
    Route::get('/santris/create', [SantriController::class, 'create'])->name('santris.create');
    Route::post('/santris', [SantriController::class, 'store'])->name('santris.store');
    Route::get('/santris/{santri}', [SantriController::class, 'show'])->name('santris.show');
    
    Route::get('/santri/{id}', [SantriController::class, 'show']);
 // Route untuk mengambil data pencapaian santri berdasarkan santri_id
    Route::get('/api/achievements/{santri_id}', [AchievementController::class, 'getAchievements'])->name('achievements.get');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/achievements', [AchievementController::class, 'index'])->name('achievements.index');
    Route::get('/achievements/create', [AchievementController::class, 'create'])->name('achievements.create');
    Route::post('/achievements', [AchievementController::class, 'store'])->name('achievements.store');
    Route::get('/achievements/edit/{achievement}', [AchievementController::class, 'edit'])->name('achievements.edit');
    Route::patch('/achievements/update/{achievement}', [AchievementController::class, 'update'])->name('achievements.update');
    Route::delete('/achievements/{id}', [AchievementController::class, 'destroy'])->name('achievements.destroy');

Route::get('/achievements/{santriId}', [AchievementController::class, 'index']);
});


// Profil Pengguna
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Otentikasi Laravel
require __DIR__ . '/auth.php';
