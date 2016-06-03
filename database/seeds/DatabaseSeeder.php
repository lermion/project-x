<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Country;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         $this->call(CountryTableSeeder::class);
    }
}

class CountryTableSeeder extends Seeder {

    public function run()
    {
        DB::table('countries')->delete();

        Country::create(array('id'=>1, 'name' => 'Азербайджан'));
        Country::create(array('id'=>2,'name' => 'Армения'));
        Country::create(array('id'=>3,'name' => 'Белоруссия'));
        Country::create(array('id'=>4,'name' => 'Грузия'));
        Country::create(array('id'=>5,'name' => 'Казахстан'));
        Country::create(array('id'=>6,'name' => 'Киргизия'));
        Country::create(array('id'=>7,'name' => 'Молдавия'));
        Country::create(array('id'=>8,'name' => 'Россия'));
        Country::create(array('id'=>9,'name' => 'Таджикистан'));
        Country::create(array('id'=>10,'name' => 'Туркмения'));
        Country::create(array('id'=>11,'name' => 'Узбекистан'));
        Country::create(array('id'=>12,'name' => 'Украина'));
    }
}
