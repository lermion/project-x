<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class TypePlaceTest extends TestCase
{
//    public function testCreateTypePlace()
//    {
//        $user = \App\User::where('phone', '380731059230')->first();
//        if (!$user) {
//            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
//        }
//        $this->be($user);
//        $type_place = \App\TypePlace::where(['name' => 'test'])->first();
//        if($type_place){
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
