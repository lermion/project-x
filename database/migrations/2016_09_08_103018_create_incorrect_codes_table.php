<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIncorrectCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incorrect_codes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('ip',12);
            $table->integer('col_error');
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
        Schema::table('incorrect_codes', function (Blueprint $table) {
            //
        });
    }
}
