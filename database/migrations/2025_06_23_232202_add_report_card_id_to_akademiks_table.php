<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('akademiks', function (Blueprint $table) {
            $table->unsignedBigInteger('report_card_id')->nullable()->after('santri_id');
            $table->foreign('report_card_id')->references('id')->on('report_cards')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('akademiks', function (Blueprint $table) {
            $table->dropForeign(['report_card_id']);
            $table->dropColumn('report_card_id');
        });
    }
};