<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;
use App\Models\AcademicYear; // Import model AcademicYear
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // --- PERBAIKAN 1: LOGIKA PEMBARUAN STATUS LULUS OTOMATIS ---
        // Logika ini akan berjalan setiap kali halaman dashboard dimuat.
        $activeAcademicYear = AcademicYear::where('is_active', true)->first();
        if ($activeAcademicYear) {
            $tahunAktif = (int) substr($activeAcademicYear->year, 0, 4);
            
            // Ambil semua santri yang masih 'Aktif' untuk diperiksa
            $santrisToCheck = Santri::where('status_santri', 'Aktif')->get();

            foreach ($santrisToCheck as $santri) {
                if (!empty($santri->nis)) {
                    $tahunMasuk = (int) substr($santri->nis, 0, 4);
                    if ($tahunMasuk > 0 && $tahunAktif > 0) {
                        $tahunKe = ($tahunAktif - $tahunMasuk) + 1;
                        if ($tahunKe > 6) {
                            // Jika sudah lebih dari 6 tahun, update statusnya menjadi Lulus
                            $santri->status_santri = 'Lulus';
                            $santri->saveQuietly(); // Menyimpan tanpa memicu observer lagi
                        }
                    }
                }
            }
        }
        // --- AKHIR PERBAIKAN 1 ---

        // Hitung statistik SETELAH status diperbarui
        $totalSantri = Santri::count();
        $santriAktif = Santri::where('status_santri', 'Aktif')->count();
        $santriLulus = Santri::where('status_santri', 'Lulus')->count();
        $santriKeluar = Santri::where('status_santri', 'Keluar')->count();

        $query = Santri::query();

        // Terapkan filter status
        $statusFilter = $request->input('status', 'Aktif');
        if ($statusFilter && in_array($statusFilter, ['Aktif', 'Lulus', 'Keluar'])) {
            $query->where('status_santri', $statusFilter);
        }

        // Terapkan filter pencarian
        if ($request->has('search') && $request->input('search') != '') {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_santri', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%")
                  ->orWhere('tempat_lahir', 'like', "%{$search}%");
            });
        }

        $perPage = $request->input('perPage', 10);
        $santris = $query->latest()->paginate($perPage)->withQueryString();

        $santris->getCollection()->transform(function ($santri) {
            $santri->foto_url = $santri->foto ? Storage::url($santri->foto) : null;
            return $santri;
        });

        return Inertia::render('Dashboard', [
            'santris' => $santris,
            'filters' => $request->only(['search', 'perPage', 'status']),
            'stats' => [
                'total' => $totalSantri,
                'aktif' => $santriAktif,
                'lulus' => $santriLulus,
                'keluar' => $santriKeluar,
            ]
        ]);
    }
}
