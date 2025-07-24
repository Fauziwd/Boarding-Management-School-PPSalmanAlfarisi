<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AcademicYear;

class Santri extends Model
{
    use HasFactory;

    /**
     * Menggunakan guarded untuk mengizinkan mass assignment pada semua kolom kecuali id.
     * Ini lebih praktis daripada mendaftarkan setiap kolom di $fillable.
     */
    protected $guarded = ['id'];

    /**
     * Relasi ke model User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke model Kelas (jika ada).
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class); // Pastikan model Kelas ada
    }

    /**
     * Relasi ke model Akademik.
     */
    public function akademiks()
    {
        return $this->hasMany(Akademik::class);
    }
    
    public function hafalans()
    {
        return $this->hasMany(Hafalan::class);
    }
    
    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
    
     public function usrohs()
    {
        // 'santri_usroh' adalah nama tabel pivot yang menghubungkan santri dan usroh.
        return $this->belongsToMany(Usroh::class, 'santri_usroh');
    }

    // Relasi-relasi lain yang sudah ada...
   
    /**
     * Relasi many-to-many ke Halaqoh.
     */
    public function halaqohs()
    {
        // 'halaqoh_santri' adalah nama tabel pivot Anda
        return $this->belongsToMany(Halaqoh::class, 'halaqoh_santri');
    }

    /**
     * Relasi many-to-many ke StudyClass (Kelas Belajar).
     */
    public function studyClasses()
    {
        // 'santri_study_class' adalah nama tabel pivot Anda
        return $this->belongsToMany(StudyClass::class, 'santri_study_class');
    }
     public function getTahunKeAttribute()
    {
        // Ambil tahun ajaran Hijriyah yang sedang aktif
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear || !preg_match('/^(\d{4})/', $this->nis, $matches)) {
            return null; // Jika tidak ada tahun aktif atau format NIS salah
        }

        $tahunMasuk = (int) $matches[1];
        $tahunSekarang = (int) preg_replace('/\/.*$/', '', $activeYear->year);

        // Hitung tahun ke-
        $tahunKe = ($tahunSekarang - $tahunMasuk) + 1;
        
        return $tahunKe > 6 ? 'Lulus' : $tahunKe;
    }
}