<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Santri extends Model
{
    use HasFactory;

    // Hubungkan model dengan tabel 'santris'
    protected $table = 'santris';

    protected $fillable = [
        'nis', 'nama', 'tahun_lulus', 'tempat_lahir', 'tanggal_lahir', 'anak_ke', 
        'status_yatim_piatu', 'nama_bapak', 'pekerjaan_bapak', 'no_telpon_bapak', 
        'nama_ibu', 'pekerjaan_ibu', 'no_telpon_ibu', 'alamat', 'kelurahan', 
        'kecamatan', 'kabupaten_kota', 'provinsi', 'kode_pos', 'foto'
    ];

    public function akademiks()
    {
        return $this->hasMany(Akademik::class, 'santri_id');
    }
}