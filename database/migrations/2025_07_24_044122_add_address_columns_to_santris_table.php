<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Pastikan nama class ini sesuai dengan yang diharapkan dari nama file
class AddAddressColumnsToSantrisTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            // Tambahkan kolom-kolom ini setelah kolom 'alamat'
            $table->string('provinsi')->after('alamat')->nullable();
            $table->string('kabupaten')->after('provinsi')->nullable();
            $table->string('kecamatan')->after('kabupaten')->nullable();
            $table->string('desa')->after('kecamatan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            // Kode untuk membatalkan (jika perlu)
            $table->dropColumn(['provinsi', 'kabupaten', 'kecamatan', 'desa']);
        });
    }
};