<?php

// database/migrations/xxxx_xx_xx_xxxxxx_create_teachers_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('teacher_type', ['Murobbi', 'Muhafidz', 'Mudaris']);
            $table->string('phone_number')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('teachers');
    }
};
