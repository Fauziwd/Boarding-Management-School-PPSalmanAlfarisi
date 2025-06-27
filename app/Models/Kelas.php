<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;

    protected $fillable = ['nama_kelas'];

    /**
     * Relasi ke model Santri.
     */
    public function santris()
    {
        return $this->hasMany(Santri::class);
    }

    /**
     * Relasi ke model ReportCard.
     */
    public function reportCards()
    {
        return $this->hasMany(ReportCard::class);
    }
}