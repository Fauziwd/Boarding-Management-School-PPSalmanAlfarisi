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
        Schema::create('santris', function (Blueprint $table) {
           $table->bigIncrements('id');
            $table->string('nama_santri');
            $table->string('nis')->unique()->nullable();
            $table->string('nisn')->unique()->nullable();
            $table->string('jenis_kelamin');
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('agama');
            $table->text('alamat');
            $table->string('status_sosial');
            $table->string('nama_ayah')->nullable();
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('no_hp_ayah')->nullable();
            $table->string('no_hp_ibu')->nullable();
            $table->string('wali_santri')->nullable();
            $table->string('pekerjaan_wali')->nullable();
            $table->string('no_hp_wali')->nullable();
           $table->string('foto')->nullable(); // Pastikan ini benar
    $table->timestamps(); // Kolom created_at dan updated_at dibuat di sini
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('santris');
    }
};