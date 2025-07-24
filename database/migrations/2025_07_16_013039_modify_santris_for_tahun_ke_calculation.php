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
        Schema::table('santris', function (Blueprint $table) {
            // 1. Tambahkan kolom 'tahun_ke' untuk menyimpan hasil perhitungan tahun santri.
            // Ditempatkan setelah kolom 'status_santri' untuk kerapian.
            $table->integer('tahun_ke')->nullable()->after('status_santri');

            // 2. Hapus kolom 'kelas_id' yang sudah tidak digunakan.
            // Pertama, kita hapus foreign key constraint-nya.
            // Nama constraint defaultnya adalah 'santris_kelas_id_foreign'.
            // Menggunakan dropForeign(['kelas_id']) lebih aman jika nama constraint berbeda.
            $table->dropForeign(['kelas_id']);
            // Kedua, kita hapus kolomnya.
            $table->dropColumn('kelas_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            // Logika untuk mengembalikan perubahan jika migrasi di-rollback.
            // 1. Hapus kolom 'tahun_ke'.
            $table->dropColumn('tahun_ke');

            // 2. Tambahkan kembali kolom 'kelas_id' dengan constraint-nya.
            $table->foreignId('kelas_id')->nullable()->after('status_santri')->constrained('kelas')->onDelete('set null');
        });
    }
};
