<?php

namespace App\Http\Controllers;

use App\Models\ReportCard;
use App\Models\AcademicYear;
use App\Models\Santri;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardController extends Controller
{
    // Halaman untuk Admin me-manage dan generate rapor
    public function management()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        return Inertia::render('ReportCard/Management', [
            'activeYear' => $activeYear
        ]);
    }

    // Fungsi untuk membuat "kerangka" rapor untuk semua santri di semester aktif
    public function generate()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            return redirect()->back()->with('error', 'Tidak ada tahun ajaran yang aktif.');
        }

        $students = Santri::whereNotNull('kelas_id')->get(); // Ambil santri yang punya kelas

        foreach ($students as $student) {
            // Cek apakah rapor sudah ada, jika belum, buat baru
            ReportCard::firstOrCreate(
                [
                    'santri_id' => $student->id,
                    'academic_year_id' => $activeYear->id,
                ],
                [
                    'kelas_id' => $student->kelas_id,
                ]
            );
        }

        return redirect()->route('report-cards.index')->with('success', 'Rapor untuk semester aktif berhasil digenerate.');
    }

    // Menampilkan daftar rapor (bisa untuk admin atau wali)
    public function index()
    {
        return Inertia::render('ReportCard/Index', [
            'reportCards' => ReportCard::with('santri', 'academicYear', 'kelas')->latest()->paginate(10),
        ]);
    }

    // Menampilkan detail satu rapor
    public function show(ReportCard $reportCard)
    {
        $reportCard->load(
            'santri.kelas', 
            'academicYear', 
            'kelas', 
            'attendance',
            'academicScores.mapel', 
            'hafalanScores'
        );

        return Inertia::render('ReportCard/Show', [
            'reportCard' => $reportCard,
        ]);
    }

    // Mengunduh rapor sebagai PDF
    public function downloadPdf(ReportCard $reportCard)
    {
        $reportCard->load('santri.kelas', 'academicYear', 'kelas', 'attendance', 'academicScores.mapel', 'hafalanScores');

        // Anda perlu membuat file view Blade ini
        $pdf = Pdf::loadView('pdf.report-card', compact('reportCard')); 
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('Rapor - ' . $reportCard->santri->nama_santri . '.pdf');
    }
}