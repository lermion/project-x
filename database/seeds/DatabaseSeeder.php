<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Country;
use App\StaticPage;

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
         $this->call(StaticPageTableSeeder::class);
    }
}

class CountryTableSeeder extends Seeder {

    public function run()
    {
        DB::table('countries')->delete();

        Country::create(array('id'=>1, 'code' => '994','name' => 'Азербайджан'));
        Country::create(array('id'=>2, 'code' => '374','name' => 'Армения'));
        Country::create(array('id'=>3, 'code' => '375','name' => 'Белоруссия'));
        Country::create(array('id'=>4, 'code' => '995','name' => 'Грузия'));
        Country::create(array('id'=>5, 'code' => '7','name' => 'Казахстан'));
        Country::create(array('id'=>6, 'code' => '996','name' => 'Киргизия'));
        Country::create(array('id'=>7, 'code' => '37','name' => 'Молдавия'));
        Country::create(array('id'=>8, 'code' => '7','name' => 'Россия'));
        Country::create(array('id'=>9, 'code' => '992','name' => 'Таджикистан'));
        Country::create(array('id'=>10, 'code' => '993','name' => 'Туркмения'));
        Country::create(array('id'=>11, 'code' => '998','name' => 'Узбекистан'));
        Country::create(array('id'=>12, 'code' => '380','name' => 'Украина'));
    }
}

class StaticPageTableSeeder extends Seeder {

    public function run()
    {
        DB::table('static_pages')->delete();

        StaticPage::create(array('description'=> 'О сервисе', 'name' => 'about_service','text'=>'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));
        StaticPage::create(array('description'=> 'Помощь','name' => 'help','text'=>'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));
        StaticPage::create(array('description'=> 'Правила','name' => 'rules','text'=>'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));
        StaticPage::create(array('description'=> 'Реклама','name' => 'advertising','text'=>'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));
        StaticPage::create(array('description'=> 'Разработчикам','name' => 'developers','text'=>'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'));

    }
}
