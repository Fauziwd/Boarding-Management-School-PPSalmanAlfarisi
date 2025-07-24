<?php

namespace App\Observers;

use App\Models\Santri;
use App\Models\AcademicYear;

class SantriObserver
{
    /**
     * Handle the Santri "saving" event.
     * This event is triggered every time a santri is created or updated.
     *
     * @param  \App\Models\Santri  $santri
     * @return void
     */
    public function saving(Santri $santri): void
    {
        $activeAcademicYear = AcademicYear::where('is_active', true)->first();

        if ($activeAcademicYear && !empty($santri->nis)) {
            $tahunMasuk = (int) substr($santri->nis, 0, 4);
            $tahunAktif = (int) substr($activeAcademicYear->year, 0, 4);

            if ($tahunMasuk > 0 && $tahunAktif > 0) {
                // Hitung tahun ke- santri
                $tahunKe = ($tahunAktif - $tahunMasuk) + 1;
                $santri->tahun_ke = $tahunKe;

                // --- LOGIKA BARU UNTUK STATUS OTOMATIS ---
                // Jika status santri saat ini BUKAN 'Keluar' (status manual),
                // maka kita bisa mengatur statusnya secara otomatis.
                if ($santri->status_santri !== 'Keluar') {
                    if ($tahunKe > 6) {
                        // Jika sudah lebih dari 6 tahun, otomatis Lulus.
                        $santri->status_santri = 'Lulus';
                    } else {
                        // Jika karena suatu hal (misal, edit NIS) tahunnya kembali normal,
                        // dan statusnya sebelumnya 'Lulus', kembalikan ke 'Aktif'.
                        if ($santri->status_santri === 'Lulus') {
                            $santri->status_santri = 'Aktif';
                        }
                    }
                }
            }
        }
    }
}
