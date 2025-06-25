<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportCard extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function santri()
    {
        return $this->belongsTo(Santri::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function attendance()
    {
        return $this->hasOne(ReportCardAttendance::class);
    }

    public function academicScores()
    {
        return $this->hasMany(Akademik::class);
    }

    public function hafalanScores()
    {
        return $this->hasMany(Hafalan::class);
    }
}