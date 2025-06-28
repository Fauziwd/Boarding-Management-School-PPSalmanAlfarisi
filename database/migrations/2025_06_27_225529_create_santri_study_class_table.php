<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('santri_study_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('santri_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('santri_study_class');
    }
};