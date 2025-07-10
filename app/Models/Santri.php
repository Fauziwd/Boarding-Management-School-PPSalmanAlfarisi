<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    /**
     * Relasi ke model Hafalan.
     */
    public function hafalans()
    {
        return $this->hasMany(Hafalan::class);
    }

    /**
     * Relasi many-to-many ke Usroh.
     */
    public function usrohs()
    {
        return $this->belongsToMany(Usroh::class, 'santri_usroh');
    }

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
}