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
            // Cek dulu sebelum menambahkan kolom
            if (!Schema::hasColumn('santris', 'agama')) {
                $table->string('agama')->after('jenis_kelamin')->default('Islam');
            }
            if (!Schema::hasColumn('santris', 'anak_ke')) {
                $table->integer('anak_ke')->after('agama')->nullable();
            }
            if (!Schema::hasColumn('santris', 'status_yatim_piatu')) {
                $table->string('status_yatim_piatu')->after('anak_ke')->nullable();
            }

            // Cek dulu sebelum mengganti nama kolom
            if (Schema::hasColumn('santris', 'nama_bapak')) {
                $table->renameColumn('nama_bapak', 'nama_ayah');
            }
            if (Schema::hasColumn('santris', 'pekerjaan_bapak')) {
                $table->renameColumn('pekerjaan_bapak', 'pekerjaan_ayah');
            }
            if (Schema::hasColumn('santris', 'no_telpon_bapak')) {
                $table->renameColumn('no_telpon_bapak', 'no_telpon_ayah');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('santris', function (Blueprint $table) {
            // Cek kolom yang ada sebelum menghapus atau mengubah kembali
            if (Schema::hasColumn('santris', 'agama')) {
                $table->dropColumn('agama');
            }
            if (Schema::hasColumn('santris', 'anak_ke')) {
                $table->dropColumn('anak_ke');
            }
            if (Schema::hasColumn('santris', 'status_yatim_piatu')) {
                $table->dropColumn('status_yatim_piatu');
            }

            if (Schema::hasColumn('santris', 'nama_ayah')) {
                $table->renameColumn('nama_ayah', 'nama_bapak');
            }
            if (Schema::hasColumn('santris', 'pekerjaan_ayah')) {
                $table->renameColumn('pekerjaan_ayah', 'pekerjaan_bapak');
            }
            if (Schema::hasColumn('santris', 'no_telpon_ayah')) {
                $table->renameColumn('no_telpon_ayah', 'no_telpon_bapak');
            }
        });
    }
};