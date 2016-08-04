<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AdminLockContentTest extends TestCase
{
    public function testGetLockPlaces()
    {
        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/places');
        $place->delete();
    }

    public function testUnlockPlace()
    {
        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/unlock_place/'.$place->id);
        $place->delete();
    }

    public function testDestroyPlace()
    {
        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/destroy_place/'.$place->id);
    }

    public function testGetLockGroups()
    {
        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/groups');
        $group->delete();
    }


    public function testUnlockGroup()
    {
        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/unlock_group/'.$group->id);
        $group->delete();
    }

    public function testDestroyGroup()
    {
        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/destroy_group/'.$group->id);
    }

    public function testGetLockPublications()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/publications');
        $publication->delete();
    }

    public function testUnlockPublication()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/unlock_publication/'.$publication->id);
        $publication->delete();
    }

    public function testDestroyPublication()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id, 'is_block'=>true]);
        $this->json('GET', 'admin/lock/destroy_publication/'.$publication->id);
    }

}
