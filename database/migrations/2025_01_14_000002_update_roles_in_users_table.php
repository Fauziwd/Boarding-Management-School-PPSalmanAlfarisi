<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        // Mengubah kolom enum untuk menambahkan role baru
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user', 'Murobbi', 'Muhafidz', 'Mudaris') NOT NULL DEFAULT 'user'");
    }

    public function down(): void {
        // Kembali ke state sebelumnya jika diperlukan
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user'");
    }
};
