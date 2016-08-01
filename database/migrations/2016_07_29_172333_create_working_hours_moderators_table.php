<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateWorkingHoursModeratorsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('working_hours_moderators', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('weekday');
            $table->time('from_time');
            $table->time('to_time');
            $table->integer('moderator_id')->unsigned();
            $table->foreign('moderator_id')->references('id')->on('moderators')->onDelete('cascade');
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
        Schema::drop('working_hours_moderators');
    }
}
