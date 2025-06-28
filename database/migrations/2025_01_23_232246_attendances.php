<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void {
    Schema::create('attendances', function (Blueprint $table) {
        $table->id(); // Ganti ke id auto-increment biasa
        $table->foreignId('santri_id')->constrained('santris')->onDelete('cascade');
        $table->foreignId('teacher_id')->constrained('teachers')->onDelete('cascade'); // Siapa yg mengabsen
        $table->date('attendance_date');
        $table->enum('status', ['Hadir', 'Sakit', 'Izin', 'Alpa']);
        $table->text('notes')->nullable();
        $table->timestamps();

        $table->unique(['santri_id', 'attendance_date']); // Pastikan satu santri hanya punya satu absen per hari
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
