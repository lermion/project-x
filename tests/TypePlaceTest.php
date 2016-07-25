<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class TypePlaceTest extends TestCase
{
//    public function testCreateTypePlace()
//    {
//        if($type_place = \App\TypePlace::where(['name' => 'test'])->first()){
//            $type_place->delete();
//        }
//        $data = [
//            'name' => 'test',
//            'description' => 'lorem',
//            'avatar' => 'test'
//        ];
//        $this->json('POST', 'place/type/create', $data)->seeJson([
//            'status' => true,
//        ]);
//        $this->seeInDatabase('places', $data);
//    }

    public function testStaticTypePlace()
    {
        $this->json('GET', 'place/type/static')->AssertResponseOk();
    }

    public function testDynamicTypePlace()
    {
        $this->json('GET', 'place/type/dynamic')->AssertResponseOk();
    }
}
