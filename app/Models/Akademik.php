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
    

    // Relasi ke tabel santris
    public function santri()
    {
        return $this->belongsTo(Santri::class);
    }
}
