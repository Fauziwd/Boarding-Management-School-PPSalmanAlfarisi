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
        Schema::table('akademiks', function (Blueprint $table) {
            // Menambahkan kolom-kolom baru setelah kolom 'bab'
            $table->string('halaman')->nullable()->after('bab');
            $table->string('baris')->nullable()->after('halaman');
            $table->integer('nilai')->nullable()->after('baris');
            $table->text('catatan')->nullable()->after('nilai');
            $table->string('status')->default('Belum Selesai')->after('catatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('akademiks', function (Blueprint $table) {
            // Menghapus kolom jika migrasi di-rollback
            $table->dropColumn(['halaman', 'baris', 'nilai', 'catatan', 'status']);
        });
    }
};
