<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFotoToSantrisTable extends Migration
{
    public function up()
    {
        Schema::table('santris', function (Blueprint $table) {
            $table->string('foto')->nullable()->after('kode_pos');
        });
    }

    public function down()
    {
        Schema::table('santris', function (Blueprint $table) {
            $table->dropColumn('foto');
        });
    }
}