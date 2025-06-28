<?php

namespace App\Http\Controllers;

use App\Models\ReportCard;
use App\Models\AcademicYear;
use App\Models\Santri;
use Inertia\Inertia;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\ReportCardAttendance;
use Illuminate\Support\Facades\DB;

class ReportCardController extends Controller
{
    /**
     * Menampilkan daftar rapor yang sudah digenerate.
     */
    public function index()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        // PERBAIKAN: Memuat relasi 'santri' dan 'kelas' secara langsung dari ReportCard.
        // Ini lebih handal daripada memuat 'santri.kelas' yang bersarang.
        $reportCards = ReportCard::with(['santri', 'kelas', 'academicYear']) 
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
    public function generate(Request $request)
    {
        $request->validate(['academic_year_id' => 'required|exists:academic_years,id']);
        $activeYear = AcademicYear::find($request->academic_year_id);
        
        if (!$activeYear) {
            return redirect()->back()->with('error', 'Tidak ada tahun ajaran yang aktif untuk generate rapor.');
        }

        $students = Santri::whereNotNull('kelas_id')->get();
        if ($students->isEmpty()){
            return redirect()->back()->with('error', 'Tidak ada santri yang memiliki kelas untuk dibuatkan rapor.');
        }

        $generatedCount = 0;
        $skippedCount = 0;
        foreach ($students as $student) {
            $report = ReportCard::firstOrCreate(
                [
                    'santri_id' => $student->id,
                    'academic_year_id' => $activeYear->id,
                ],
                [
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
        
        return redirect()->route('report-cards.index')->with('success', $message);
    }

    /**
     * Menampilkan detail satu rapor.
     */
    public function show(ReportCard $reportCard)
    {
        $this->calculateAndStoreAttendance($reportCard);

        // PERBAIKAN: Menggunakan relasi 'kelas' langsung dari ReportCard
        $reportCard->load([
            'santri.user', 
            'kelas', // Lebih handal
            'academicYear', 
            'akademikDetails.course', 
            'hafalanDetails', 
            'attendanceSummary',
            'murobbi.user'
        ]);
        
        $reportCard->akademik_details = $reportCard->akademikDetails;
        $reportCard->hafalan_details = $reportCard->hafalanDetails;
        $reportCard->attendance_summary = $reportCard->attendanceSummary;

        return Inertia::render('ReportCard/Show', [
            'reportCard' => $reportCard
        ]);
    }

    /**
     * Fungsi private untuk menghitung dan menyimpan rekap absensi.
     */
    private function calculateAndStoreAttendance(ReportCard $reportCard)
    {
        $academicYear = $reportCard->academicYear;
        if (!$academicYear || !$academicYear->start_date || !$academicYear->end_date) {
            return;
        }

        $startDate = $academicYear->start_date;
        $endDate = $academicYear->end_date;
        $santriId = $reportCard->santri_id;

        $attendanceCounts = Attendance::query()
            ->where('santri_id', $santriId)
            ->whereBetween('attendance_date', [$startDate, $endDate])
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $summary = [
            'present'    => $attendanceCounts->get('Hadir', 0),
            'sick'       => $attendanceCounts->get('Sakit', 0),
            'permission' => $attendanceCounts->get('Izin', 0),
            'absent'     => $attendanceCounts->get('Alpa', 0),
        ];

        ReportCardAttendance::updateOrCreate(
            ['report_card_id' => $reportCard->id],
            $summary
        );
    }

    /**
     * Mengunduh rapor sebagai PDF.
     */
    public function downloadPdf(ReportCard $reportCard)
    {
        $reportCard->load([
            'santri.kelas', 
            'academicYear', 
            'akademikDetails.course', 
            'hafalanDetails', 
            'attendanceSummary'
        ]);

        $pdf = Pdf::loadView('pdf.report_card', ['reportCard' => $reportCard]); 
        
        return $pdf->download('Rapor - ' . $reportCard->santri->nama_santri . '.pdf');
    }
}
