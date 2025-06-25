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
        Schema::create('hafalans', function (Blueprint $table) {
            $table->id();

            // Relasi ke santris (ini sudah benar karena santris dibuat lebih dulu)
            $table->unsignedBigInteger('santri_id');
            $table->foreign('santri_id')->references('id')->on('santris')->onDelete('cascade');

            // HAPUS SEMUA YANG BERHUBUNGAN DENGAN report_card_id DARI SINI

            $table->string('juz');
            $table->integer('halaman');
            $table->integer('baris');
            $table->string('bulan');
            $table->year('tahun');
            $table->integer('nilai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hafalans');
    }
};