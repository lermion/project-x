<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateComplaintPublicationsTsble extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('complaint_publications', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('publication_id')->unsigned();
            $table->foreign('publication_id')->references('id')->on('publications')->onDelete('cascade');
            $table->integer('complaint_category_id')->unsigned();
            $table->foreign('complaint_category_id')->references('id')->on('complaint_categories')->onDelete('cascade');
            $table->integer('user_which_id')->unsigned();
            $table->foreign('user_which_id')->references('id')->on('users')->onDelete('cascade');
            $table->integer('user_to_id')->unsigned();
            $table->foreign('user_to_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::drop('complaint_publications');
    }
}
