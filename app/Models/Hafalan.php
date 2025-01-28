<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hafalan extends Model
{
    use HasFactory;

    protected $fillable = ['santri_id', 'juz', 'month'];

    // Relasi ke tabel santris
    public function santri()
    {
        return $this->belongsTo(Santri::class);
    }
}
