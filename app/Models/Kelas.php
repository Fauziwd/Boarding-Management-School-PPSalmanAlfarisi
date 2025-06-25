<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Satu kelas bisa memiliki banyak santri, atau banyak rapor
    public function santris()
    {
        return $this->hasMany(Santri::class);
    }
    
    public function reportCards()
    {
        return $this->hasMany(ReportCard::class);
    }
}