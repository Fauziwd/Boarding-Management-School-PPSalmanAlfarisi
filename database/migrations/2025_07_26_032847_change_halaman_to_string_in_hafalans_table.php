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
            Schema::table('hafalans', function (Blueprint $table) {
                // Mengubah tipe kolom 'halaman' menjadi STRING
                $table->string('halaman')->change();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::table('hafalans', function (Blueprint $table) {
                // Mengembalikan tipe kolom jika migrasi di-rollback
                $table->integer('halaman')->change();
            });
        }
    };
    