<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PlaceTest extends TestCase
{
    use DatabaseTransactions;

    public function testIndex()
    {
        $this->json('GET', 'place/')->AssertResponseOk();
    }

    public function testAdminGroup()
    {
        $this->json('GET', 'place/admin_place')->AssertResponseOk();
    }

     public function testCreate()
     {
         $user = \App\User::where('phone', '380731059230')->first();
         if (!$user) {
             $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
         }
         $room = \App\ChatRooms::first();
         if (!$room){
             $room = \App\ChatRooms::create(['name' => 'test', 'avatar' => 'test']);
         }
         $this->be($user);
         if($place = \App\Place::where(['name' => 'test'])->first()){
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
             'room_id' => $room->id
         ];
         $this->json('POST', 'place/create', $data)->seeJson(['status' => true]);
         $this->seeInDatabase('places', $data);
     }

    public function testUpdate()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $place = \App\Place::first();
        if (!$place) {
            $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test']);
        }
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1]);
        $this->be($user);
        $data = [
            'name' => str_random(8),
            'description' => 'lorem',
            'city_id' => '4',
            'type_place_id' => '2',
            'address' => 'test',
            'coordinates_x'=> '2',
            'coordinates_y'=> '2'
        ];
        $this->json('POST', 'place/update/' . $place->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('places', $data);
    }

    public function testDelete()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $place = \App\Place::first();
        if (!$place) {
            $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test']);
        }
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1, 'is_creator' => 1]);
        $this->be($user);
        $data = [
            'name' => str_random(8),
            'description' => 'lorem',
            'city_id' => '4',
            'type_place_id' => '2',
            'address' => 'test',
            'coordinates_x'=> '2',
            'coordinates_y'=> '2'
        ];
        $this->json('GET', 'place/destroy/' . $place->id, $data)->seeJson([
            'status' => true,
        ]);
    }

    public function testShow()
     {
         $user = \App\User::where('phone', '380731059230')->first();
            if (!$user) {
                $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
            }
         $this->be($user);
            $place = \App\Place::first();
            if (!$place) {
                $place = \App\Place::create(
                    [
                        'name' => 'test',
                        'url_name' => 'test',
                        'coordinates_y'=> '1',
                        'coordinates_x'=> '1',
                        'address' => 'test',
                        'description' => 'test',
                        'type_place_id' => '1',
                        'city_id' => '1',
                        'is_open' => '1',
                        'avatar' => 'test'
                    ]
                );
            }
            \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1]);
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

    public function testUserCreator()
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
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1, 'is_creator' => 1]);
        \App\PlaceUser::create(['user_id' => $user2->id, 'place_id' => $place->id, 'is_admin' => 1]);
        $this->json('GET', 'place/set_user_admin/' . $place->id . '/' . $user2->id)->seeJson([
            'status' => true,
        ]);
    }


    public function testAdmin_subscription_delete()
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
        $room = \App\ChatRooms::first();
        if (!$room){
            $room = \App\ChatRooms::create(['name' => 'test', 'avatar' => 'test']);
        }
        $place = \App\Place::first();
        if (!$place) {
            $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'avatar' => 'test', 'city_id' => 11, 'address' => 'test', 'coordinates_x' => 1, 'coordinates_y' => 1, 'cover' => 'test', 'type_place_id' => 3, 'room_id' => $room->id]);
        }
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1, 'is_creator' => 1]);
        \App\PlaceUser::create(['user_id' => $user2->id, 'place_id' => $place->id, 'is_admin' => 0]);
        $this->json('POST', 'place/delete_subscription/' . $place->id, ['user_id'=>array($user2->id)])->seeJson([
            'status' => true,
        ]);
    }

    public function testCounterNewPlace()
    {
        $this->json('GET', 'place/counter_new_place')->AssertResponseOk();
    }
}


