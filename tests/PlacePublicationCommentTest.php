<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PlacePublicationCommentTest extends TestCase
{
    use DatabaseTransactions;

    public function testStore()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
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
        \App\PlaceUser::create(['user_id' => $user->id, 'place_id' => $place->id, 'is_admin' => 0]);
        $this->be($user);
        $this->be($user);
        $data = [
            'text' => 'test'
        ];
        $publication = $place->publications()->create(['user_id' => $user->id]);
        $this->json('POST', 'place/'.$place->id.'/publication/'.$publication->id.'/comment/store', $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('comments', $data);
    }
}
