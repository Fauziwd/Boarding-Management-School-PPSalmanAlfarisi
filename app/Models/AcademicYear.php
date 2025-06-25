<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function reportCards()
    {
        return $this->hasMany(ReportCard::class);
    }
}