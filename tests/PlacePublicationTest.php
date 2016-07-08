<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PlacePublicationTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $place = \App\Place::first();
        if (!$place) {
            $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        $this->json('GET', 'place/' . $place->id . '/publication')->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $place = \App\Place::first();
        if (!$place) {
            $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1]);
        $this->be($user);
        $data = [
            'text' => 'test', 'is_anonym' => false, 'is_main' => false,
        ];
        $this->json('POST', 'place/' . $place->id . '/publication/store', $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }

    public function testUpdate()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $place = \App\Place::first();
        if (!$place) {
            $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 1]);
        $publication = $place->publications()->create(['user_id' => $user->id]);
        $data = [
            'text' => 'test'
        ];
        $this->json('POST', 'place/'.$place->id.'/publication/update/'.$publication->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }
}
