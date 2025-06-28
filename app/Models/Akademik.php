<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Akademik extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     */
    protected $fillable = [
        'santri_id',
        'report_card_id',
        'kitab',
        'bab',
        'halaman',      // Baru
        'baris',        // Baru
        'nilai',        // Baru
        'catatan',      // Baru
        'status',       // Baru
    ];

    /**
     * Relasi ke Santri.
     */
    public function santri()
    {
        return $this->belongsTo(Santri::class);
    }
}
