<?php

// app/Models/Achievement.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'santri_id', 'type', 'title', 'description', 'date',
    ];

    public function santri()
    {
        return $this->belongsTo(Santri::class);
    }
}
