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
        Schema::table('study_classes', function (Blueprint $table) {
            // Menambahkan kolom foreign key 'kelas_id' setelah kolom 'id'
            // Ini akan menghubungkan setiap pelajaran kitab dengan kelas tertentu.
            $table->foreignId('kelas_id')->nullable()->after('id')->constrained('kelas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('study_classes', function (Blueprint $table) {
            // Hapus foreign key constraint sebelum menghapus kolom
            $table->dropForeign(['kelas_id']);
            $table->dropColumn('kelas_id');
        });
    }
};
