<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlacesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('places', function (Blueprint $table) {
            $table->increments('id');
            $table->string('avatar');
            $table->string('cover');
            $table->text('description');
            $table->string('name')->unique();
            $table->string('url_name')->unique();
            $table->string('address');
            $table->string('coordinates_x');
            $table->string('coordinates_y');
            $table->boolean('dynamic');
            $table->date('expired_date');
            $table->integer('city_id')->unsigned();
            $table->foreign('city_id')->references('id')->on('cities')->onDelete('cascade');
            $table->integer('type_place_id')->unsigned();
            $table->foreign('type_place_id')->references('id')->on('type_places')->onDelete('cascade');
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
        Schema::drop('places');
    }
}
