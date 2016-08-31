<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCheckingModerator extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('create_checking_moderators', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('moderator_id')->unsigned();
            $table->foreign('moderator_id')->references('id')->on('moderators')->onDelete('cascade');
            $table->dateTime('work_date');
            $table->integer('hours_worked');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('create_checking_moderators', function (Blueprint $table) {
            //
        });
    }
}
