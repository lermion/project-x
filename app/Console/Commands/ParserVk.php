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
            ['ourId' => 8, 'vkId' => 1], // Россия
            ['ourId' => 12, 'vkId' => 2], // Украина
            ['ourId' => 3, 'vkId' => 3], // Белоруссия
            ['ourId' => 5, 'vkId' => 4], // Казахстан
            ['ourId' => 1, 'vkId' => 5], // Азербайджан
            ['ourId' => 4, 'vkId' => 6], // Грузия
            ['ourId' => 11, 'vkId' => 8], // Узбекистан
            ['ourId' => 7, 'vkId' => 15], // Молдавия
            ['ourId' => 6, 'vkId' => 13], // Киргизия
            //['ourId' => 2, 'vkId' => 13], //Армения
            ['ourId' => 9, 'vkId' => 16], //Таджикистан
            ['ourId' => 10, 'vkId' => 17] //Туркмения
        ];
        foreach ($countries as $cId) {
            $countryId = $cId['vkId'];
            $count = 1000;
            $regionsOffset = 0;
            $regions = $this->doRequest('http://api.vk.com/method/database.getRegions?v=5.5&need_all=1&offset='.$regionsOffset.'&count='.$count.'&country_id='.$countryId);

            foreach ($regions->response->items as $rInfo) {
                $region = Region::firstOrCreate(['name' => $rInfo->title, 'country_id' => $cId['ourId']]);
                $citiesOffset = 0;
                do {
                    $cities = $this->doRequest('http://api.vk.com/method/database.getCities?v=5.5&country_id=' . $countryId . '&region_id=' . $rInfo->id . '&offset=' . $citiesOffset . '&need_all=1&count=' . $count);
                    foreach ($cities->response->items as $cInfo) {
                        if (isset($cInfo->area)) {
                            $areaInfo = Area::firstOrCreate(['name' => $cInfo->area, 'region_id' => $region->id]);
                        }
                        $area_id = isset($areaInfo->id) ? $areaInfo->id : null;
                        $r = City::firstOrCreate(['name' => $cInfo->title, 'country_id' => $cId['ourId'], 'area_id' => $area_id, 'region_id' => $region->id]);
                        if(!$r){echo $cInfo->title; echo $cId['ourId']; echo $area_id; echo $region->id;}
                        $citiesOffset++;
                    }
                } while ($citiesOffset < $cities->response->count);
            }

//                Log::info('Region ... from country ... parsed ' . ($offset + $cities['count']) . ' cities');
        }
    }


    private function doRequest($url) {
        $result = file_get_contents($url);
        $result = json_decode($result);
        //isset($result['response']) ? $result = $result['response']: $result = null;
        return $result;
    }
}
