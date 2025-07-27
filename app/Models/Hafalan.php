<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hafalan extends Model
{
    use HasFactory;

   protected $fillable = [
        'santri_id',
        'juz',
        'halaman', // Baru
        'baris',   // Baru
        'nilai',   // Baru
        'month',
        'report_card_id',
    ];


    // Relasi ke santri sudah ada, pastikan benar
 public function santri()
    {
        return $this->belongsTo(Santri::class);
    }

    // app/Models/Hafalan.php
public function teacher()
{
    return $this->belongsTo(Teacher::class);
}

// Tambahkan relasi ini
public function reportCard()
{
    return $this->belongsTo(ReportCard::class);
}
}
