<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AkademikController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\HafalanController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportCardController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UsrohController;
use App\Http\Controllers\HalaqohController;
use App\Http\Controllers\StudyClassController;
use App\Http\Controllers\TahunSantriController;
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
    ]);
});

/*
|--------------------------------------------------------------------------
| Rute yang Membutuhkan Login (Semua Role)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Rute Manajemen Absensi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('absensi')->name('absensi.')->group(function () {
    Route::get('/', [AttendanceController::class, 'index'])->name('index');
    Route::get('/create', [AttendanceController::class, 'create'])->name('create');
    Route::post('/', [AttendanceController::class, 'store'])->name('store');
    
    // PERBAIKAN: Menggunakan middleware 'admin' yang akan kita daftarkan
    Route::patch('/update-by-admin', [AttendanceController::class, 'updateByAdmin'])
        ->name('updateByAdmin')
        ->middleware('admin'); 
});


/*
|--------------------------------------------------------------------------
| Rute Khusus untuk Peran 'admin'
|--------------------------------------------------------------------------
*/
// PERBAIKAN: Menggunakan middleware 'admin' yang akan kita daftarkan
Route::middleware(['auth', 'admin'])->group(function () {
    // MANAJEMEN INTI
    Route::resource('users', UserController::class);
    Route::resource('teachers', TeacherController::class);
    Route::resource('santris', SantriController::class);

    // MANAJEMEN TAHUN, USROH, HALAQOH & KELAS
    Route::resource('tahun-santri', TahunSantriController::class)->except(['show']);
    
    Route::resource('usrohs', UsrohController::class);
    Route::post('/usrohs/{usroh}/add-santri', [UsrohController::class, 'addSantri'])->name('usrohs.addSantri');
    Route::post('/usrohs/{usroh}/remove-santri', [UsrohController::class, 'removeSantri'])->name('usrohs.removeSantri');
    
    Route::resource('halaqohs', HalaqohController::class);
    Route::post('/halaqohs/{halaqoh}/add-santri', [HalaqohController::class, 'addSantri'])->name('halaqohs.addSantri');
    Route::post('/halaqohs/{halaqoh}/remove-santri', [HalaqohController::class, 'removeSantri'])->name('halaqohs.removeSantri');
    
    Route::resource('study-classes', StudyClassController::class);
    Route::post('/study-classes/{study_class}/add-santri', [StudyClassController::class, 'addSantri'])->name('study-classes.addSantri');
    Route::post('/study-classes/{study_class}/remove-santri', [StudyClassController::class, 'removeSantri'])->name('study-classes.removeSantri');

    // MANAJEMEN AKADEMIK & HAFALAN
    Route::resource('akademik', AkademikController::class);
    Route::resource('hafalan', HafalanController::class);
    
    // MANAJEMEN Tahun & RAPOR
    Route::resource('academic-years', AcademicYearController::class)->except(['show']);
    Route::post('academic-years/{academicYear}/set-active', [AcademicYearController::class, 'setActive'])->name('academic-years.set-active');
    Route::resource('report-cards', ReportCardController::class)->only(['index', 'show']);
    Route::post('report-cards/generate', [ReportCardController::class, 'generate'])->name('report-cards.generate');
    Route::get('/report-cards/{reportCard}/download', [ReportCardController::class, 'downloadPdf'])->name('report-cards.download');
});

/*
|--------------------------------------------------------------------------
| Rute Khusus untuk Peran Guru (Murobbi, Muhafidz, Mudaris)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'teacher'])->group(function () {
    // Rute untuk menampilkan kelompok yang diampu guru
    Route::get('/my-halaqoh', [HalaqohController::class, 'myHalaqoh'])->name('halaqohs.my');
    Route::get('/my-study-class', [StudyClassController::class, 'myClass'])->name('study-classes.my');

    // Rute untuk absensi kelompok guru
    Route::get('/my-attendance', [AttendanceController::class, 'create'])->name('absensi.my');

    // Rute untuk melihat dan menilai rapor santri di kelompoknya
    Route::get('/my-report-cards', [ReportCardController::class, 'myReportCards'])->name('report-cards.my');
    Route::post('/report-cards/{reportCard}/add-note', [ReportCardController::class, 'addNote'])->name('report-cards.add-note');
});

/*
|--------------------------------------------------------------------------
| Rute API (Membutuhkan Login)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->prefix('api')->name('api.')->group(function () {
    Route::get('/attendances/students', [AttendanceController::class, 'getStudentsForAttendance'])->name('attendance.getStudents');
    Route::get('/akademiks/{santriId}', [AkademikController::class, 'getBySantriId'])->name('akademiks.getBySantriId');
    Route::get('/hafalans/{santriId}', [HafalanController::class, 'getBySantriId'])->name('hafalans.getBySantriId');
    Route::get('/check-nis/{nis}', [SantriController::class, 'checkNis'])->name('santri.checkNis');
    Route::get('/check-nisn/{nisn}', [SantriController::class, 'checkNisn'])->name('santri.checkNisn');
});

// File rute otentikasi default
require __DIR__ . '/auth.php';
