<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportCardAttendance extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function reportCard()
    {
        return $this->belongsTo(ReportCard::class);
    }
}