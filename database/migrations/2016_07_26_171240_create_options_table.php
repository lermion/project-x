<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOptionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('options', function (Blueprint $table) {
            $table->increments('id');
            $table->text('contacts');
            $table->longText('terms_of_use');
            $table->longText('privacy_policy');
            $table->text('copyright');
            $table->text('copyright_link');
            $table->text('mail');
            $table->integer('time_chat_message');
            $table->integer('users_chat_message');
            $table->boolean('user_foto_bloc')->default(false);
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
        Schema::drop('options');
    }
}
