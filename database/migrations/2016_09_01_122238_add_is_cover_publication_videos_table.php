<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsCoverPublicationVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('publication_videos', function (Blueprint $table) {
            $table->boolean('is_cover')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('publication_videos', function (Blueprint $table) {
            $table->dropColumn('is_cover');
        });
    }
}
