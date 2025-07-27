<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    /**
     * Atribut yang dapat diisi secara massal.
     */
    protected $fillable = [
        'user_id',
        'roles',
        'phone_number',
        'address'
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'roles' => 'array',
    ];

    /**
     * Relasi ke data User.
     */
   public function user()
{
    return $this->belongsTo(User::class);
}

    /**
     * Relasi ke Usroh yang diampu (sebagai Murobbi).
     */
    public function usrohs()
    {
        // PERBAIKAN: Secara eksplisit menyebutkan nama foreign key yang benar.
        return $this->hasMany(Usroh::class, 'murobbi_id');
    }

    /**
     * Relasi ke Halaqoh yang diampu (sebagai Muhafidz).
     */
    public function halaqohs()
    {
        return $this->hasMany(Halaqoh::class, 'teacher_id');
    }

    /**
     * Relasi ke Kelas yang diampu (sebagai Mudaris).
     */
    public function studyClasses()
    {
        return $this->hasMany(StudyClass::class, 'teacher_id');
    }
    
}
