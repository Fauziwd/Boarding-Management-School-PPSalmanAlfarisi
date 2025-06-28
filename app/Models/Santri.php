<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Santri extends Model
{
    use HasFactory;

    // Pastikan semua kolom yang bisa diisi sudah terdaftar di sini
    protected $fillable = [
        'nis',
        'nisn',
        'nama_santri',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'agama',
        'kelas_id', // Tambahkan kelas_id
        'anak_ke',
        'status_yatim_piatu',
        'nama_bapak',
        'pekerjaan_bapak',
        'no_telpon_bapak',
        'nama_ibu',
        'pekerjaan_ibu',
        'no_telpon_ibu',
        'alamat',
        'kelurahan',
        'kecamatan',
        'kabupaten_kota',
        'provinsi',
        'kode_pos',
        'foto',
    ];

    /**
     * Relasi ke model Kelas.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    // Relasi lainnya yang sudah ada...
    public function akademiks()
    {
        return $this->hasMany(Akademik::class);
    }

    public function hafalans()
    {
        return $this->hasMany(Hafalan::class);
    }
    /**
     * Relasi many-to-many ke Usroh.
     * Seorang santri bisa menjadi anggota dari banyak usroh.
     */
    public function usrohs()
    {
        return $this->belongsToMany(Usroh::class, 'santri_usroh');
    }

    /**
     * Relasi many-to-many ke Halaqoh.
     * Seorang santri bisa menjadi anggota dari banyak halaqoh.
     */
    public function halaqohs()
    {
        return $this->belongsToMany(Halaqoh::class, 'halaqoh_santri');
    }

    /**
     * Relasi many-to-many ke StudyClass (Kelas Belajar).
     * Seorang santri bisa menjadi anggota dari banyak kelas belajar.
     */
    public function studyClasses()
    {
        return $this->belongsToMany(StudyClass::class, 'santri_study_class');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}