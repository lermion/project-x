<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Log;
use App\Area;
use App\Http\Requests;
use App\Region;
use App\City;

set_time_limit(0);
class ParserVkController extends Controller
{
    private function doRequest($url) {
        $result = file_get_contents($url);
        $result = json_decode($result);
        //isset($result['response']) ? $result = $result['response']: $result = null;
        return $result;
    }

    public function index()
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
            $count = 100000;
            $regionsOffset = 0;
            $regions = $this->doRequest('http://api.vk.com/method/database.getRegions?v=5.5&need_all=1&offset='.$regionsOffset.'&count=1000&country_id='.$countryId);
            foreach ($regions->response->items as $rInfo) {

                $region = Region::create(['name' => $rInfo->title,'country_id' => $countryId]);
                // parse cities
                $offset = 0;
                do {
                    $cities = $this->doRequest('http://api.vk.com/method/database.getCities?v=5.5&country_id='.$countryId.'&region_id='.$rInfo->id.'&offset='.$offset.'&need_all=1&count=1000');

                    if (isset($cities->response->items)) {
                        foreach ($cities->response->items as $cInfo) {
                            //$areaInfo =Area::where('name', $cInfo['area'])->where('regionId', $region->id)->findOrCreate();
                            if (isset($cInfo->area)) {
                                $areaInfo = Area::create(['name' => $cInfo->area, 'region_id' => $region->id]);
                            }
                            $area_id = isset($areaInfo->id) ? $areaInfo->id : null;
                            $city = City::create(['name' => $cInfo->title, 'country_id' => $countryId, 'area_id' => $area_id, 'region_id' => $region->id]);
                        }
                    }
                } while ($offset + $count < $cities->response->count);

              //  Log::info('Region ... from country ... parsed ' . ($offset + $cities['count']) . ' cities')
            }
        }
    }
}
