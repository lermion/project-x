<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class AddBaseVk extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared(File::get(database_path() . '/countries.sql'));
        DB::unprepared(File::get(database_path() . '/regions.sql'));
        DB::unprepared(File::get(database_path() . '/areas.sql'));
        //DB::unprepared(File::get(database_path() . '/cities.sql'));

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('countries')->truncate();
        DB::table('regions')->truncate();
        DB::table('areas')->truncate();
        //DB::table('cities')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
