<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Santri extends Model
{
    use HasFactory;

    /**
     * Semua kolom dapat mass-assignment kecuali 'id'.
     */
    protected $guarded = ['id'];

    /**
     * Cast tanggal lahir jadi instance Carbon (otomatis).
     */
    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    /**
     * ==========================
     *      ELOQUENT RELATIONS
     * ==========================
     */

    /**
     * Relasi ke User (jika ada foreign key user_id).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Kelas.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Relasi ke Akademik (riwayat akademik santri).
     */
    public function akademiks()
    {
        return $this->hasMany(Akademik::class);
    }

    /**
     * Relasi ke Hafalan.
     */
    public function hafalans()
    {
        return $this->hasMany(Hafalan::class);
    }

    /**
     * Relasi ke Achievement (prestasi santri).
     */
     public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class, 'santri_id');
    }

    /**
     * Relasi ke Attendance (absensi santri).
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Relasi many-to-many ke Usroh.
     */
    public function usrohs()
    {
        // 'santri_usroh' adalah pivot table
        return $this->belongsToMany(Usroh::class, 'santri_usroh');
    }

    /**
     * Relasi many-to-many ke Halaqoh.
     */
    public function halaqohs()
    {
        // 'halaqoh_santri' adalah pivot table
        return $this->belongsToMany(Halaqoh::class, 'halaqoh_santri');
    }

    /**
     * Relasi many-to-many ke StudyClass.
     */
    public function studyClasses()
    {
        // 'santri_study_class' adalah pivot table
        return $this->belongsToMany(StudyClass::class, 'santri_study_class');
    }

    /**
     * ==========================
     *        ACCESSORS
     * ==========================
     */

    /**
     * Mengambil tahun ke-berapa santri belajar (berdasarkan NIS dan tahun ajaran aktif).
     * @return int|string|null
     */
    public function getTahunKeAttribute()
    {
        $activeYear = AcademicYear::where('is_active', true)->first();
        if (!$activeYear || !preg_match('/^(\d{4})/', $this->nis, $matches)) {
            return null; // Tidak ada tahun aktif atau format NIS tidak sesuai
        }

        $tahunMasuk = (int) $matches[1];
        $tahunSekarang = (int) preg_replace('/\/.*$/', '', $activeYear->year);

        $tahunKe = ($tahunSekarang - $tahunMasuk) + 1;
        return $tahunKe > 6 ? 'Lulus' : $tahunKe;
    }

    /**
     * ==========================
     *         MUTATORS
     * ==========================
     */

    /**
     * Set nama santri dengan kapitalisasi otomatis (opsional).
     */
    public function setNamaSantriAttribute($value)
    {
        $this->attributes['nama_santri'] = ucwords(strtolower($value));
    }

    /**
     * ==========================
     *      CUSTOM METHODS
     * ==========================
     */

    /**
     * Contoh method custom, misal ambil alamat lengkap.
     */
    public function getAlamatLengkapAttribute()
    {
        return "{$this->alamat}, {$this->kelurahan}, {$this->kecamatan}, {$this->kabupaten}, {$this->provinsi}, {$this->kode_pos}";
    }

}