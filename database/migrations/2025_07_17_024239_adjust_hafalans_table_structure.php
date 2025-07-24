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
        Schema::table('hafalans', function (Blueprint $table) {
            // Hapus kolom-kolom yang tidak lagi digunakan.
            if (Schema::hasColumn('hafalans', 'report_card_id')) {
                // PERBAIKAN: Hapus foreign key constraint DULU sebelum menghapus kolom.
                // Laravel akan mencoba menebak nama constraint dari nama kolom.
                $table->dropForeign(['report_card_id']);
                $table->dropColumn('report_card_id');
            }
            if (Schema::hasColumn('hafalans', 'baris')) {
                $table->dropColumn('baris');
            }
            if (Schema::hasColumn('hafalans', 'tahun')) {
                $table->dropColumn('tahun');
            }
            if (Schema::hasColumn('hafalans', 'month')) {
                $table->dropColumn('month');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hafalans', function (Blueprint $table) {
            // Logika untuk mengembalikan perubahan jika migrasi di-rollback.
            // PERBAIKAN: Menambahkan constraint ke tabel 'report_cards' dengan benar.
            $table->foreignId('report_card_id')->nullable()->after('santri_id')->constrained('report_cards')->onDelete('set null');
            $table->string('baris')->nullable()->after('halaman');
            $table->string('tahun', 4)->nullable()->after('nilai');
            $table->string('month', 7)->nullable()->after('tahun');
        });
    }
};
