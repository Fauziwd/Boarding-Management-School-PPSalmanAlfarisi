<?php

namespace App\Http\Controllers;

use App\Models\ReportCard;
use App\Models\AcademicYear;
use App\Models\Santri;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardController extends Controller
{
    /**
     * Menampilkan daftar rapor yang sudah digenerate.
     */
    public function index()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        $reportCards = ReportCard::with(['santri', 'academicYear', 'kelas'])
            ->latest()
            ->paginate(10);
            
        return Inertia::render('ReportCard/Index', [
            'reportCards' => $reportCards,
            'activeYear' => $activeYear,
        ]);
    }

    /**
     * Fungsi untuk membuat "kerangka" rapor untuk semua santri di semester aktif.
     */
    public function generate()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear) {
            return redirect()->back()->with('error', 'Tidak ada tahun ajaran yang aktif untuk generate rapor.');
        }

// AMBIL SANTRI YANG SUDAH PUNYA KELAS SAJA
        $students = Santri::whereNotNull('kelas_id')->get();
        if($students->isEmpty()){
            return redirect()->back()->with('error', 'Tidak ada santri yang memiliki kelas untuk dibuatkan rapor.');
        }

      $generatedCount = 0;
        $skippedCount = 0;
        foreach ($students as $student) {
            // Cek apakah rapor sudah ada, jika belum, buat baru
            $report = ReportCard::firstOrCreate(
                [
                    'santri_id' => $student->id,
                    'academic_year_id' => $activeYear->id,
                ],
                [
                    // GUNAKAN KELAS_ID DARI DATA SANTRI, BUKAN HARDCODE
                    'kelas_id' => $student->kelas_id, 
                ]
            );

            if($report->wasRecentlyCreated) {
                $generatedCount++;
            } else {
                $skippedCount++;
            }
        }

         $message = "$generatedCount rapor baru berhasil digenerate.";
        if ($skippedCount > 0) {
            $message .= " $skippedCount rapor sudah ada dan dilewati.";
        }
        
        return redirect()->route('report-cards.index')->with('success', "$generatedCount rapor baru berhasil digenerate.");
    }

    /**
     * Menampilkan detail satu rapor.
     */
    public function show(ReportCard $reportCard)
    {
        $reportCard->load(
            'santri', 
            'academicYear', 
            'kelas', 
            'attendance',
            'academicScores', 
            'hafalanScores'
        );

        return Inertia::render('ReportCard/Show', [
            'reportCard' => $reportCard,
        ]);
    }

    /**
     * Mengunduh rapor sebagai PDF.
     */
    public function downloadPdf(ReportCard $reportCard)
    {
        $reportCard->load('santri', 'academicYear', 'kelas', 'attendance', 'academicScores', 'hafalanScores');

        // Pastikan Anda memiliki view 'pdf.report-card' di resources/views/
        $pdf = Pdf::loadView('pdf.report-card', compact('reportCard')); 
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('Rapor - ' . $reportCard->santri->nama_santri . '.pdf');
    }
}