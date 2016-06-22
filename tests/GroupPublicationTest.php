<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class GroupPublicationTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $group = \App\Group::first();
        if (!$group) {
            $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        $this->json('GET', 'group/' . $group->id . '/publication')->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $group = \App\Group::first();
        if (!$group) {
            $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        \App\GroupUser::create(['user_id' => $user->id, 'group_id' => $group->id, 'is_admin' => 1]);
        $this->be($user);
        $data = [
            'text' => 'test', 'is_anonym' => false, 'is_main' => false,
        ];
        $this->json('POST', 'group/' . $group->id . '/publication/store', $data)->seeJson([
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
        $group = \App\Group::first();
        if (!$group) {
            $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        }
        \App\GroupUser::create(['user_id' => $user->id, 'group_id' => $group->id, 'is_admin' => 1]);
        $publication = $group->publications()->create(['user_id' => $user->id]);
        $data = [
            'text' => 'test'
        ];
        $this->json('POST', 'group/'.$group->id.'/publication/update/'.$publication->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }
}
