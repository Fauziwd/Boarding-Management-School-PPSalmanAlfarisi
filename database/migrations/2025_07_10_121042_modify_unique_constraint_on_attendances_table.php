<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // 1. Hapus foreign key yang bergantung pada index lama.
            //    Nama default foreign key adalah nama_tabel_nama_kolom_foreign.
            $table->dropForeign(['santri_id']);

            // 2. Hapus unique key yang lama.
            $table->dropUnique('attendances_santri_id_attendance_date_unique');

            // 3. Tambahkan unique key baru yang lebih spesifik.
            $table->unique(['santri_id', 'attendance_date', 'teacher_id']);

            // 4. Tambahkan kembali foreign key yang tadi dihapus.
            $table->foreign('santri_id')
                  ->references('id')
                  ->on('santris')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Lakukan kebalikannya dengan urutan yang benar
            $table->dropForeign(['santri_id']);
            $table->dropUnique(['santri_id', 'attendance_date', 'teacher_id']);
            
            $table->unique(['santri_id', 'attendance_date']);
            
            $table->foreign('santri_id')
                  ->references('id')
                  ->on('santris')
                  ->onDelete('cascade');
        });
    }
};
