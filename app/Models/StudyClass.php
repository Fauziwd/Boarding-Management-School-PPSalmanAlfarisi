<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudyClass extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'teacher_id', 'academic_year_id'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function santris()
    {
        return $this->belongsToMany(Santri::class, 'santri_study_class');
    }
}
