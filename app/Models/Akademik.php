<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Akademik extends Model
{
    use HasFactory;

    protected $fillable = ['santri_id', 'kitab', 'bab'];
    protected $casts = [
        'bab' => 'array', // Jika Anda menggunakan JSON
    ];
    

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
