<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hafalan extends Model
{
    use HasFactory;

    protected $fillable = ['santri_id', 'juz', 'month'];


    // Relasi ke santri sudah ada, pastikan benar
public function santri()
{
    return $this->belongsTo(Santri::class);
}

// Tambahkan relasi ini
public function reportCard()
{
    return $this->belongsTo(ReportCard::class);
}
}
