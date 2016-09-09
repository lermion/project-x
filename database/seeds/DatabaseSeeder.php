<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Country;
use App\City;
use App\StaticPage;
use App\ComplaintCategory;
use App\TypePlace;
use App\Scope;
use App\Option;



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
         $this->call(CityTableSeeder::class);
         $this->call(StaticPageTableSeeder::class);
         $this->call(ComplaintCategoryTableSeeder::class);
         $this->call(TypePlaceTableSeeder::class);
         $this->call(ScopeTableSeeder::class);
         $this->call(OptionTableSeeder::class);
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

class CityTableSeeder extends Seeder {

    public function run()
    {
        DB::table('cities')->delete();
        //Украина
        City::create(array('country_id'=>12, 'name' => 'Винница'));
        City::create(array('country_id'=>12, 'name' => 'Днепропетровск'));
        City::create(array('country_id'=>12, 'name' => 'Донецк'));
        City::create(array('country_id'=>12, 'name' => 'Житомир'));
        City::create(array('country_id'=>12, 'name' => 'Запорожье'));
        City::create(array('country_id'=>12, 'name' => 'Ивано-Франковск'));
        City::create(array('country_id'=>12, 'name' => 'Кировоград'));
        City::create(array('country_id'=>12, 'name' => 'Киев'));
        City::create(array('country_id'=>12, 'name' => 'Луганск'));
        City::create(array('country_id'=>12, 'name' => 'Луцк'));
        City::create(array('country_id'=>12, 'name' => 'Львов'));
        City::create(array('country_id'=>12, 'name' => 'Николаев'));
        City::create(array('country_id'=>12, 'name' => 'Одесса'));
        City::create(array('country_id'=>12, 'name' => 'Полтава'));
        City::create(array('country_id'=>12, 'name' => 'Ровно'));
        City::create(array('country_id'=>12, 'name' => 'Сумы'));
        City::create(array('country_id'=>12, 'name' => 'Тернополь'));
        City::create(array('country_id'=>12, 'name' => 'Ужгород'));
        City::create(array('country_id'=>12, 'name' => 'Харьков'));
        City::create(array('country_id'=>12, 'name' => 'Херсон'));
        City::create(array('country_id'=>12, 'name' => 'Хмельницкий'));
        City::create(array('country_id'=>12, 'name' => 'Черкассы'));
        City::create(array('country_id'=>12, 'name' => 'Чернигов'));
        City::create(array('country_id'=>12, 'name' => 'Черновцы'));
        //Россия
        City::create(array('country_id'=>8, 'name' => 'Майкоп'));
        City::create(array('country_id'=>8, 'name' => 'Горно-Алтайск'));
        City::create(array('country_id'=>8, 'name' => 'Уфа'));
        City::create(array('country_id'=>8, 'name' => 'Улан-Удэ'));
        City::create(array('country_id'=>8, 'name' => 'Махачкала'));
        City::create(array('country_id'=>8, 'name' => 'Магас'));
        City::create(array('country_id'=>8, 'name' => 'Нальчик'));
        City::create(array('country_id'=>8, 'name' => 'Элиста'));
        City::create(array('country_id'=>8, 'name' => 'Черкесск'));
        City::create(array('country_id'=>8, 'name' => 'Петрозаводск'));
        City::create(array('country_id'=>8, 'name' => 'Сыктывкар'));
        City::create(array('country_id'=>8, 'name' => 'Симферополь'));
        City::create(array('country_id'=>8, 'name' => 'Йошкар-Ола'));
        City::create(array('country_id'=>8, 'name' => 'Саранск'));
        City::create(array('country_id'=>8, 'name' => 'Якутск'));
        City::create(array('country_id'=>8, 'name' => 'Владикавказ'));
        City::create(array('country_id'=>8, 'name' => 'Казань'));
        City::create(array('country_id'=>8, 'name' => 'Кызыл'));
        City::create(array('country_id'=>8, 'name' => 'Ижевск'));
        City::create(array('country_id'=>8, 'name' => 'Абакан'));
        City::create(array('country_id'=>8, 'name' => 'Грозный'));
        City::create(array('country_id'=>8, 'name' => 'Чебоксары'));
        City::create(array('country_id'=>8, 'name' => 'Барнаул'));
        City::create(array('country_id'=>8, 'name' => 'Чита'));
        City::create(array('country_id'=>8, 'name' => 'Петропавловск-Камчатский'));
        City::create(array('country_id'=>8, 'name' => 'Краснодар'));
        City::create(array('country_id'=>8, 'name' => 'Красноярск'));
        City::create(array('country_id'=>8, 'name' => 'Пермь'));
        City::create(array('country_id'=>8, 'name' => 'Владивосток'));
        City::create(array('country_id'=>8, 'name' => 'Ставрополь'));
        City::create(array('country_id'=>8, 'name' => 'Хабаровск'));
        City::create(array('country_id'=>8, 'name' => 'Благовещенск'));
        City::create(array('country_id'=>8, 'name' => 'Архангельск'));
        City::create(array('country_id'=>8, 'name' => 'Астрахань'));
        City::create(array('country_id'=>8, 'name' => 'Белгород'));
        City::create(array('country_id'=>8, 'name' => 'Брянск'));
        City::create(array('country_id'=>8, 'name' => 'Владимир'));
        City::create(array('country_id'=>8, 'name' => 'Волгоград'));
        City::create(array('country_id'=>8, 'name' => 'Вологда'));
        City::create(array('country_id'=>8, 'name' => 'Воронеж'));
        City::create(array('country_id'=>8, 'name' => 'Иваново'));
        City::create(array('country_id'=>8, 'name' => 'Иркутск'));
        City::create(array('country_id'=>8, 'name' => 'Калининград'));
        City::create(array('country_id'=>8, 'name' => 'Калуга'));
        City::create(array('country_id'=>8, 'name' => 'Кемерово'));
        City::create(array('country_id'=>8, 'name' => 'Киров'));
        City::create(array('country_id'=>8, 'name' => 'Кострома'));
        City::create(array('country_id'=>8, 'name' => 'Курган'));
        City::create(array('country_id'=>8, 'name' => 'Курск'));
        City::create(array('country_id'=>8, 'name' => 'Санкт-Петербург'));
        City::create(array('country_id'=>8, 'name' => 'Липецк'));
        City::create(array('country_id'=>8, 'name' => 'Магадан'));
        City::create(array('country_id'=>8, 'name' => 'Москва'));
        City::create(array('country_id'=>8, 'name' => 'Красногорск'));
        City::create(array('country_id'=>8, 'name' => 'Мурманск'));
        City::create(array('country_id'=>8, 'name' => 'Нижний Новгород'));
        City::create(array('country_id'=>8, 'name' => 'Великий Новгород'));
        City::create(array('country_id'=>8, 'name' => 'Новосибирск'));
        City::create(array('country_id'=>8, 'name' => 'Омск'));
        City::create(array('country_id'=>8, 'name' => 'Оренбург'));
        City::create(array('country_id'=>8, 'name' => 'Орёл'));
        City::create(array('country_id'=>8, 'name' => 'Пенза'));
        City::create(array('country_id'=>8, 'name' => 'Псков'));
        City::create(array('country_id'=>8, 'name' => 'Ростов-на-Дону'));
        City::create(array('country_id'=>8, 'name' => 'Рязань'));
        City::create(array('country_id'=>8, 'name' => 'Самара'));
        City::create(array('country_id'=>8, 'name' => 'Саратов'));
        City::create(array('country_id'=>8, 'name' => 'Южно-Сахалинск'));
        City::create(array('country_id'=>8, 'name' => 'Екатеринбург'));
        City::create(array('country_id'=>8, 'name' => 'Смоленск'));
        City::create(array('country_id'=>8, 'name' => 'Тамбов'));
        City::create(array('country_id'=>8, 'name' => 'Тверь'));
        City::create(array('country_id'=>8, 'name' => 'Томск'));
        City::create(array('country_id'=>8, 'name' => 'Тула'));
        City::create(array('country_id'=>8, 'name' => 'Тюмень'));
        City::create(array('country_id'=>8, 'name' => 'Ульяновск'));
        City::create(array('country_id'=>8, 'name' => 'Челябинск'));
        City::create(array('country_id'=>8, 'name' => 'Ярославль'));
        City::create(array('country_id'=>8, 'name' => 'Санкт-Петербург'));
        City::create(array('country_id'=>8, 'name' => 'Севастополь'));
        City::create(array('country_id'=>8, 'name' => 'Биробиджан'));
        City::create(array('country_id'=>8, 'name' => 'Нарьян-Мар'));
        City::create(array('country_id'=>8, 'name' => 'Ханты-Мансийск'));
        City::create(array('country_id'=>8, 'name' => 'Анадырь'));
        City::create(array('country_id'=>8, 'name' => 'Салехард'));
        //Белоруссия
        City::create(array('country_id'=>3, 'name' => 'Минск'));
        City::create(array('country_id'=>3, 'name' => 'Брест'));
        City::create(array('country_id'=>3, 'name' => 'Витебск'));
        City::create(array('country_id'=>3, 'name' => 'Гомель'));
        City::create(array('country_id'=>3, 'name' => 'Гродно'));
        City::create(array('country_id'=>3, 'name' => 'Минск'));
        City::create(array('country_id'=>3, 'name' => 'Могилёв'));
        //Азербайджан
        City::create(array('country_id'=>1, 'name' => 'Хырдалан'));
        City::create(array('country_id'=>1, 'name' => 'Агдам'));
        City::create(array('country_id'=>1, 'name' => 'Агдаш'));
        City::create(array('country_id'=>1, 'name' => 'Агджабеди'));
        City::create(array('country_id'=>1, 'name' => 'Аджигабул'));
        City::create(array('country_id'=>1, 'name' => 'Акстафа'));
        City::create(array('country_id'=>1, 'name' => 'Астара'));
        City::create(array('country_id'=>1, 'name' => 'Ахсу'));
        City::create(array('country_id'=>1, 'name' => 'Барда'));
        City::create(array('country_id'=>1, 'name' => 'Бейлаган'));
        City::create(array('country_id'=>1, 'name' => 'Белоканы'));
        City::create(array('country_id'=>1, 'name' => 'Билясувар'));
        City::create(array('country_id'=>1, 'name' => 'Габала'));
        City::create(array('country_id'=>1, 'name' => 'Геокчай'));
        City::create(array('country_id'=>1, 'name' => 'Геранбой'));
        City::create(array('country_id'=>1, 'name' => 'Гёйгёль'));
        City::create(array('country_id'=>1, 'name' => 'Мараза'));
        City::create(array('country_id'=>1, 'name' => 'Дашкесан'));
        City::create(array('country_id'=>1, 'name' => 'Джалилабад'));
        City::create(array('country_id'=>1, 'name' => 'Джебраил'));
        City::create(array('country_id'=>1, 'name' => 'Евлах'));
        City::create(array('country_id'=>1, 'name' => 'Закаталы'));
        City::create(array('country_id'=>1, 'name' => 'Зангелан'));
        City::create(array('country_id'=>1, 'name' => 'Зердаб'));
        City::create(array('country_id'=>1, 'name' => 'Имишли'));
        City::create(array('country_id'=>1, 'name' => 'Исмаиллы'));
        City::create(array('country_id'=>1, 'name' => 'Казах'));
        City::create(array('country_id'=>1, 'name' => 'Кахи'));
        City::create(array('country_id'=>1, 'name' => 'Кедабек'));
        City::create(array('country_id'=>1, 'name' => 'Кельбаджар'));
        City::create(array('country_id'=>1, 'name' => 'Кубатлы'));
        City::create(array('country_id'=>1, 'name' => 'Куба'));
        City::create(array('country_id'=>1, 'name' => 'Кусары'));
        City::create(array('country_id'=>1, 'name' => 'Кюрдамир'));
        City::create(array('country_id'=>1, 'name' => 'Лачин'));
        City::create(array('country_id'=>1, 'name' => 'Ленкорань'));
        City::create(array('country_id'=>1, 'name' => 'Лерик'));
        City::create(array('country_id'=>1, 'name' => 'Масаллы'));
        City::create(array('country_id'=>1, 'name' => 'Нефтечала'));
        City::create(array('country_id'=>1, 'name' => 'Огуз'));
        City::create(array('country_id'=>1, 'name' => 'Саатлы'));
        City::create(array('country_id'=>1, 'name' => 'Сабирабад'));
        City::create(array('country_id'=>1, 'name' => 'Сальяны'));
        City::create(array('country_id'=>1, 'name' => 'Самух'));
        City::create(array('country_id'=>1, 'name' => 'Сиазань'));
        City::create(array('country_id'=>1, 'name' => 'Товуз'));
        City::create(array('country_id'=>1, 'name' => 'Тертер'));
        City::create(array('country_id'=>1, 'name' => 'Уджары'));
        City::create(array('country_id'=>1, 'name' => 'Физули'));
        City::create(array('country_id'=>1, 'name' => 'Хачмас'));
        City::create(array('country_id'=>1, 'name' => 'Ходжавенд'));
        City::create(array('country_id'=>1, 'name' => 'Ходжалы'));
        City::create(array('country_id'=>1, 'name' => 'Хызы'));
        City::create(array('country_id'=>1, 'name' => 'Шабран'));
        City::create(array('country_id'=>1, 'name' => 'Шамкир'));
        City::create(array('country_id'=>1, 'name' => 'Шеки'));
        City::create(array('country_id'=>1, 'name' => 'Шемаха'));
        City::create(array('country_id'=>1, 'name' => 'Шуша'));
        City::create(array('country_id'=>1, 'name' => 'Ярдымлы'));
        //Армения
        City::create(array('country_id'=>2, 'name' => 'Аштарак'));
        City::create(array('country_id'=>2, 'name' => 'Арташат'));
        City::create(array('country_id'=>2, 'name' => 'Армавир'));
        City::create(array('country_id'=>2, 'name' => 'Ехегнадзор'));
        City::create(array('country_id'=>2, 'name' => 'Гавар'));
        City::create(array('country_id'=>2, 'name' => 'Раздан'));
        City::create(array('country_id'=>2, 'name' => 'Ванадзор'));
        City::create(array('country_id'=>2, 'name' => 'Капан'));
        City::create(array('country_id'=>2, 'name' => 'Иджеван'));
        City::create(array('country_id'=>2, 'name' => 'Гюмри'));
        //Грузия
        City::create(array('country_id'=>4, 'name' => 'Сухуми'));
        City::create(array('country_id'=>4, 'name' => 'Зугдиди'));
        City::create(array('country_id'=>4, 'name' => 'Озургети'));
        City::create(array('country_id'=>4, 'name' => 'Батуми'));
        City::create(array('country_id'=>4, 'name' => 'Амбролаури'));
        City::create(array('country_id'=>4, 'name' => 'Кутаиси'));
        City::create(array('country_id'=>4, 'name' => 'Ахалцихе'));
        City::create(array('country_id'=>4, 'name' => 'Гори'));
        City::create(array('country_id'=>4, 'name' => 'Мцхета'));
        City::create(array('country_id'=>4, 'name' => 'Рустави'));
        City::create(array('country_id'=>4, 'name' => 'Телави'));
        City::create(array('country_id'=>4, 'name' => 'Тбилиси'));
        //Казахстан
        City::create(array('country_id'=>5, 'name' => 'Актау'));
        City::create(array('country_id'=>5, 'name' => 'Актобе'));
        City::create(array('country_id'=>5, 'name' => 'Атырау'));
        City::create(array('country_id'=>5, 'name' => 'Караганда'));
        City::create(array('country_id'=>5, 'name' => 'Кокшетау'));
        City::create(array('country_id'=>5, 'name' => 'Костанай'));
        City::create(array('country_id'=>5, 'name' => 'Кызылорда'));
        City::create(array('country_id'=>5, 'name' => 'Павлодар'));
        City::create(array('country_id'=>5, 'name' => 'Петропавловск'));
        City::create(array('country_id'=>5, 'name' => 'Талдыкорган'));
        City::create(array('country_id'=>5, 'name' => 'Тараз'));
        City::create(array('country_id'=>5, 'name' => 'Уральск'));
        City::create(array('country_id'=>5, 'name' => 'Усть-Каменогорск'));
        City::create(array('country_id'=>5, 'name' => 'Шымкент'));
        //Киргизия
        City::create(array('country_id'=>6, 'name' => 'Бишкек'));
        City::create(array('country_id'=>6, 'name' => 'Ош'));
        City::create(array('country_id'=>6, 'name' => 'Баткен'));
        City::create(array('country_id'=>6, 'name' => 'Джалал-Абад'));
        City::create(array('country_id'=>6, 'name' => 'Каракол'));
        City::create(array('country_id'=>6, 'name' => 'Нарын'));
        City::create(array('country_id'=>6, 'name' => 'Талас'));
        City::create(array('country_id'=>6, 'name' => 'Токмак'));
        //Молдавия
        City::create(array('country_id'=>7, 'name' => 'Кишинев'));
        City::create(array('country_id'=>7, 'name' => 'Тирасполь'));
        City::create(array('country_id'=>7, 'name' => 'Бессарабка'));
        City::create(array('country_id'=>7, 'name' => 'Бричаны'));
        City::create(array('country_id'=>7, 'name' => 'Глодяны'));
        City::create(array('country_id'=>7, 'name' => 'Дондюшаны'));
        City::create(array('country_id'=>7, 'name' => 'Дрокия'));
        City::create(array('country_id'=>7, 'name' => 'Кочиеры'));
        City::create(array('country_id'=>7, 'name' => 'Единцы'));
        City::create(array('country_id'=>7, 'name' => 'Кагул'));
        City::create(array('country_id'=>7, 'name' => 'Калараш'));
        City::create(array('country_id'=>7, 'name' => 'Кантемир'));
        City::create(array('country_id'=>7, 'name' => 'Каушаны'));
        City::create(array('country_id'=>7, 'name' => 'Криуляны'));
        City::create(array('country_id'=>7, 'name' => 'Леова'));
        City::create(array('country_id'=>7, 'name' => 'Ниспорены'));
        City::create(array('country_id'=>7, 'name' => 'Новые Анены'));
        City::create(array('country_id'=>7, 'name' => 'Окница'));
        City::create(array('country_id'=>7, 'name' => 'Оргеев'));
        City::create(array('country_id'=>7, 'name' => 'Резина'));
        City::create(array('country_id'=>7, 'name' => 'Рышканы'));
        City::create(array('country_id'=>7, 'name' => 'Сороки'));
        City::create(array('country_id'=>7, 'name' => 'Страшены'));
        City::create(array('country_id'=>7, 'name' => 'Сынжерея'));
        City::create(array('country_id'=>7, 'name' => 'Тараклия'));
        City::create(array('country_id'=>7, 'name' => 'Теленешты'));
        City::create(array('country_id'=>7, 'name' => 'Унгены'));
        City::create(array('country_id'=>7, 'name' => 'Фалешты'));
        City::create(array('country_id'=>7, 'name' => 'Флорешты'));
        City::create(array('country_id'=>7, 'name' => 'Хынчешты'));
        City::create(array('country_id'=>7, 'name' => 'Чимишлия'));
        City::create(array('country_id'=>7, 'name' => 'Шолданешты'));
        City::create(array('country_id'=>7, 'name' => 'Штефан-Водэ'));
        City::create(array('country_id'=>7, 'name' => 'Яловены'));
        City::create(array('country_id'=>7, 'name' => 'Комрат'));
        City::create(array('country_id'=>7, 'name' => 'Тирасполь'));
        //Таджикистан
        City::create(array('country_id'=>9, 'name' => 'Хорог'));
        City::create(array('country_id'=>9, 'name' => 'Худжанд'));
        City::create(array('country_id'=>9, 'name' => 'Курган-Тюбе'));
        City::create(array('country_id'=>9, 'name' => 'Душанбе'));
        //Туркмения
        City::create(array('country_id'=>10, 'name' => 'Аннау'));
        City::create(array('country_id'=>10, 'name' => 'Балканабат'));
        City::create(array('country_id'=>10, 'name' => 'Дашогуз'));
        City::create(array('country_id'=>10, 'name' => 'Туркменабат'));
        City::create(array('country_id'=>10, 'name' => 'Мары'));
        //Узбекистан
        City::create(array('country_id'=>11, 'name' => 'Ташкент'));
        City::create(array('country_id'=>11, 'name' => 'Нукус'));
        City::create(array('country_id'=>11, 'name' => 'Андижан'));
        City::create(array('country_id'=>11, 'name' => 'Бухара'));
        City::create(array('country_id'=>11, 'name' => 'Джизак'));
        City::create(array('country_id'=>11, 'name' => 'Карши'));
        City::create(array('country_id'=>11, 'name' => 'Навои'));
        City::create(array('country_id'=>11, 'name' => 'Наманган'));
        City::create(array('country_id'=>11, 'name' => 'Самарканд'));
        City::create(array('country_id'=>11, 'name' => 'Термез'));
        City::create(array('country_id'=>11, 'name' => 'Гулистан'));
        City::create(array('country_id'=>11, 'name' => 'Фергана'));
        City::create(array('country_id'=>11, 'name' => 'Ургенч'));
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

class ComplaintCategoryTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('complaint_categories')->delete();

        ComplaintCategory::create(array('id' => 1, 'name' => 'Спам'));
        ComplaintCategory::create(array('id' => 2, 'name' => 'Оскорбление'));
        ComplaintCategory::create(array('id' => 3, 'name' => 'Материал для взрослых'));
        ComplaintCategory::create(array('id' => 4, 'name' => 'Пропаганда наркотиков'));
        ComplaintCategory::create(array('id' => 5, 'name' => 'Детская порнография'));
        ComplaintCategory::create(array('id' => 6, 'name' => 'Экстремизм'));
        ComplaintCategory::create(array('id' => 7, 'name' => 'Насилие'));
    }
}

class TypePlaceTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('type_places')->delete();

        TypePlace::create(array('id' => 1, 'name' => 'Магазин', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто'));
        TypePlace::create(array('id' => 2, 'name' => 'Кафе/Ресторан', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто'));
        TypePlace::create(array('id' => 3, 'name' => 'Развлечение', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто'));
        TypePlace::create(array('id' => 4, 'name' => 'Организация', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто'));
        TypePlace::create(array('id' => 5, 'name' => 'Университет', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто'));
        TypePlace::create(array('id' => 6, 'name' => 'Школа', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто'));
        TypePlace::create(array('id' => 7, 'name' => 'Ярмарка', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто', 'is_dynamic' => true));
        TypePlace::create(array('id' => 8, 'name' => 'Самолет', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто', 'is_dynamic' => true));
        TypePlace::create(array('id' => 9, 'name' => 'Пароход', 'description' => 'Здесь должно быть описание места', 'avatar'=>'пусто', 'is_dynamic' => true));
    }
}

class OptionTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('options')->delete();
        Option::create(array('contacts'=>'Контакты', 'terms_of_use'=>'Соглашение пользователя', 'privacy_policy' => 'Политика конфиденциальности', 'copyright' => 'Авторские права', 'copyright_link' => 'Авторские права (ссылка)', 'mail' => 'mail@mail.ru', 'time_chat_message' => 30, 'users_chat_message' => 60, 'user_foto_bloc' => false, 'moderate_publication' => false, 'closed_registration' => false ));
    }
}

class ScopeTableSeeder extends Seeder
{

    public function run()
    {
        DB::table('scopes')->delete();
        Scope::create(array('id' => 1, 'name'=>'Все', 'img'=>'пусто', 'order' => 1, 'is_protected' => true ));
        Scope::create(array('id' => 2, 'name'=>'Другое', 'img'=>'пусто', 'order' => 2, 'is_protected' => true ));
        Scope::create(array('id' => 3, 'name'=>'Москва', 'img'=>'пусто', 'order' => 3, 'is_protected' => false ));
        Scope::create(array('id' => 4, 'name'=>'Санкт-Петербург', 'img'=>'пусто', 'order' => 4, 'is_protected' => false ));
        Scope::create(array('id' => 5, 'name'=>'Днепр', 'img'=>'пусто', 'order' => 5, 'is_protected' => false ));
    }
}
