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
}