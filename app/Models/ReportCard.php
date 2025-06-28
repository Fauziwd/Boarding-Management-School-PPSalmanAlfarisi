<?php

 namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class ReportCard extends Model
    {
        use HasFactory;

        protected $fillable = [
            'santri_id',
            'academic_year_id',
            'kelas_id',
            'murobbi_id', // Pastikan kolom ini ada di migrasi Anda
            'murobbi_note',
        ];

        /**
         * Relasi ke Santri.
         */
        public function santri()
        {
            return $this->belongsTo(Santri::class);
        }

        /**
         * Relasi ke Tahun Ajaran.
         */
        public function academicYear()
        {
            return $this->belongsTo(AcademicYear::class);
        }

        /**
         * Relasi ke Kelas.
         */
        public function kelas()
        {
            return $this->belongsTo(Kelas::class);
        }

        /**
         * Relasi ke Murobbi (Guru).
         */
        public function murobbi()
        {
            return $this->belongsTo(Teacher::class, 'murobbi_id');
        }

        /**
         * Relasi ke detail nilai akademik.
         * Satu rapor punya banyak nilai akademik.
         */
        public function akademikDetails()
        {
            return $this->hasMany(Akademik::class);
        }

        /**
         * Relasi ke detail nilai hafalan.
         * Satu rapor punya banyak nilai hafalan.
         */
        public function hafalanDetails()
        {
            return $this->hasMany(Hafalan::class);
        }

        /**
         * Relasi ke rekap absensi.
         * Satu rapor punya satu rekap absensi.
         */
        public function attendanceSummary()
        {
            return $this->hasOne(ReportCardAttendance::class);
        }
    }
    