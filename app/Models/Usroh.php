<?php

// app/Models/Usroh.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usroh extends Model {
    use HasFactory;
    protected $fillable = ['name', 'murobbi_id', 'academic_year_id'];

    public function murobbi() {
        return $this->belongsTo(Teacher::class, 'murobbi_id');
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class);
    }

    public function santris() {
        return $this->belongsToMany(Santri::class, 'santri_usroh');
    }
}