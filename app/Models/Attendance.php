<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasUuids;
    use HasFactory;
    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'address',
        'status',
        'description',
    ];

    public function newUniqueId()
    {
        return (string) Uuid::uuid4();
    }

}
