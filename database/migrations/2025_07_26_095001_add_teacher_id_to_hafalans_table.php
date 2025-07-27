<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('hafalans', function (Blueprint $table) {
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('set null')->after('nilai');
        });
    }
    public function down(): void {
        Schema::table('hafalans', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropColumn('teacher_id');
        });
    }
};