<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Tambahkan 'koperasi' ke dalam daftar ENUM yang sudah ada
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'Murobbi', 'Muhafidz', 'Mudaris', 'koperasi') NOT NULL");
    }

    public function down(): void
    {
        // Kembali ke state sebelumnya jika di-rollback
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'Murobbi', 'Muhafidz', 'Mudaris') NOT NULL");
    }
};