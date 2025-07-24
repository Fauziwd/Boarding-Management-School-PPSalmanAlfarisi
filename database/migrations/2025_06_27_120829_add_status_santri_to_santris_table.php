<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            // Ubah enum menjadi 'Aktif', 'Lulus', dan 'Keluar'
            $table->enum('status_santri', ['Aktif', 'Lulus', 'Keluar'])
                  ->default('Aktif')
                  ->after('foto');
        });
    }

    public function down(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            $table->dropColumn('status_santri');
        });
    }
};