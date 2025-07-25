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
        Schema::create('akademiks', function (Blueprint $table) {
            $table->id();

            // Hanya relasi ke santris
            $table->unsignedBigInteger('santri_id');
            $table->foreign('santri_id')->references('id')->on('santris')->onDelete('cascade');
            
            $table->string('kitab');
            $table->integer('bab');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('akademiks');
    }
};