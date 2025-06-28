<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_usrohs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('usrohs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('murobbi_id')->nullable()->constrained('teachers')->onDelete('set null');
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('usrohs');
    }
};