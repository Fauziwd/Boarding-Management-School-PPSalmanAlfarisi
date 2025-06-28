<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Tambahkan role 'guru' ke tabel users
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'Murobbi', 'Muhafidz', 'Mudaris', 'koperasi', 'guru') NOT NULL");

        // 2. Ubah tabel teachers untuk mendukung multi-peran
        Schema::table('teachers', function (Blueprint $table) {
            // Hapus kolom teacher_type yang lama
            if (Schema::hasColumn('teachers', 'teacher_type')) {
                $table->dropColumn('teacher_type');
            }
            // Tambahkan kolom 'roles' dengan tipe JSON setelah user_id
            if (!Schema::hasColumn('teachers', 'roles')) {
                $table->json('roles')->after('user_id')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            if (Schema::hasColumn('teachers', 'roles')) {
                $table->dropColumn('roles');
            }
            if (!Schema::hasColumn('teachers', 'teacher_type')) {
                $table->enum('teacher_type', ['Murobbi', 'Muhafidz', 'Mudaris'])->after('user_id');
            }
        });

        // Mengembalikan ENUM di tabel users ke state sebelumnya
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'Murobbi', 'Muhafidz', 'Mudaris', 'koperasi') NOT NULL");
    }
};
