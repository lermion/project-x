<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class CityAdminTest extends TestCase
{
//    public function testCityAdminCreate()
//    {
//        $country = \App\Country::create([
//            'name'=>'test',
//            'code'=>'00'
//        ]);
//        $data = [
//            'country_id' => $country->id,
//            'name' => 'test'
//        ];
//        $this->json('POST', 'admin/city', $data )->seeJson(['status' => true]);
//        $country->delete();
//    }
//
//    public function testCityAdminDestroy()
//    {
//        $city = \App\City::where('name','test')->first();
//        if (!$city){
//            $city = \App\City::create(['country_id'=>1, 'name'=>'test']);
//        }
//        $this->json('get', 'admin/city/destroy/'.$city->id)->seeJson(['status' => true]);
//    }
}
