<?php

namespace App\Console\Commands;

use App\Area;
use App\City;
use App\Region;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ParserVk extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parser';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Parser VK cities';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        set_time_limit(0);
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {


        $countries = [
//            ['ourId' => 8, 'vkId' => 1], // Россия
            ['ourId' => 12, 'vkId' => 2], // Украина
//            ['ourId' => 3, 'vkId' => 3], // Белоруссия
//            ['ourId' => 5, 'vkId' => 4], // Казахстан
//            ['ourId' => 1, 'vkId' => 5], // Азербайджан
//            ['ourId' => 4, 'vkId' => 7], // Грузия
//            ['ourId' => 11, 'vkId' => 18], // Узбекистан
//            ['ourId' => 7, 'vkId' => 15], // Молдавия
//            ['ourId' => 6, 'vkId' => 11], // Киргизия
//            ['ourId' => 2, 'vkId' => 6], //Армения
//            ['ourId' => 9, 'vkId' => 16], //Таджикистан
//            ['ourId' => 10, 'vkId' => 17] //Туркмения
        ];
        foreach ($countries as $cId) {
            $countryId = $cId['vkId'];
            $offset = 0;
            do {
                $result = file_get_contents('http://api.vk.com/method/database.getCities?v=5.6&country_id='.$countryId.'&region_id=0&offset='.$offset.'&need_all=1&count=1000&lang=0');
                $cities = json_decode($result);
                foreach ($cities->response->items as $cInfo) {
                    if (isset($cInfo->region)) {
                        $region = Region::firstOrCreate(['name' => $cInfo->region, 'country_id' => $cId['ourId']]);
                        if (isset($cInfo->area)) {
                            $area = Area::firstOrCreate(['name' => $cInfo->area, 'region_id' => $region->id]);
                        }
                    }
                    $area_id = isset($area->id) ? $area->id : null;
                    $region_id = isset($region->id) ? $region->id : null;
                    City::firstOrCreate(['name' => $cInfo->title, 'country_id' => $cId['ourId'], 'area_id' => $area_id, 'region_id' => $region_id]);
                    $offset++;
                    $area = null;
                    $region =  null;
                }
            } while ($offset < $cities->response->count);
        }
    }
    //Не хватает столиц:
}
