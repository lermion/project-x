<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PlaceTest extends TestCase
{
    use DatabaseTransactions;

     public function testCreate()
     {
         $user = \App\User::where('phone', '380731059230')->first();
         if (!$user) {
             $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
         }
         $this->be($user);
         if($place = \App\Place::where(['name' => 'test',])->first()){
             $place->delete();
         }
         $data = [
             'name' => 'test',
             'description' => 'lorem',
             'city_id' => '1',
             'type_place_id' => '1',
             'address' => 'test',
             'coordinates_x'=> '1',
             'coordinates_y'=> '1',
         ];
         $this->json('POST', 'place/create', $data)->seeJson([
             'status' => true,
         ]);
         $this->seeInDatabase('places', $data);
     }
     public function testShow()
     {
         $user = \App\User::where('phone', '380731059230')->first();
            if (!$user) {
                $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
            }
            $place = \App\Place::first();
            if (!$place) {
                $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test','city_id'=>1,
                'type_place_id'=>1]);
            }
            \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1]);
            $this->be($user);
            $data = [
                'name' => 'test',
                'description' => 'lorem'
            ];
            $this->json('GET', 'place/show/' . $place->url_name, $data)->AssertResponseOk();
     }

    public function testUserAdmin()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'avatar' => 'test', 'city_id' =>11, 'address' => 'test', 'coordinates_x'=> 1, 'coordinates_y'=> 1, 'cover' => 'test', 'type_place_id' => 3]);
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1]);
        \App\PlaceUser::create(['user_id' => $user2->id, 'place_id' => $place->id, 'is_admin' => 1]);
        $this->json('GET', 'place/set_user_admin/' . $place->id . '/' . $user2->id)->seeJson([
            'status' => true,
        ]);
    }

}


