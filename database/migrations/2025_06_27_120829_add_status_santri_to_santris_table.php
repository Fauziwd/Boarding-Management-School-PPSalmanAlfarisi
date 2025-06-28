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
            // Menambahkan kolom ENUM untuk status santri setelah kolom foto
            // dengan nilai default 'Aktif'.
            $table->enum('status_santri', ['Aktif', 'Lulus', 'Pindah', 'Berhenti'])
                  ->default('Aktif')
                  ->after('foto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            $table->dropColumn('status_santri');
        });
    }
};
