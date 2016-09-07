<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateReceivedMessagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('received_messages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('chat_rooms_id')->unsigned();
            $table->foreign('chat_rooms_id')->references('id')->on('chat_rooms')->onDelete('cascade');
            $table->integer('last_message_id')->unsigned();
            $table->foreign('last_message_id')->references('id')->on('messages')->onDelete('cascade');
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
        Schema::table('received_messages', function (Blueprint $table) {
            //
        });
    }
}
