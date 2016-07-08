<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class GroupTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $this->json('GET', 'group/')->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        if($group = \App\Group::where(['name' => 'test',])->first()){
            $group->delete();
        }
        $data = [
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('POST', 'group/store', $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('groups', $data);
    }

    public function testUpdate()
    {
        $user = \App\User::where('phone', '380731059230')->first();
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
            'name' => str_random(8),
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('POST', 'group/update/' . $group->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('groups', $data);
    }

    public function testDelete()
    {
        $user = \App\User::where('phone', '380731059230')->first();
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
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('GET', 'group/destroy/' . $group->id, $data)->seeJson([
            'status' => true,
        ]);
    }

    public function testShow()
    {
        $user = \App\User::where('phone', '380731059230')->first();
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
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('GET', 'group/show/' . $group->url_name, $data)->AssertResponseOk();
    }

    public function testSubscription()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $group = \App\Group::firstOrCreate(['name' => 'test']);
        $group->is_open = 1;
        $group->save();
        $this->json('GET', 'group/subscription/' . $group->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testInvite()
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
        $group = \App\Group::firstOrCreate(['name' => 'test']);
        $group->is_open = 1;
        $group->save();
        \App\GroupUser::create(['user_id' => $user->id, 'group_id' => $group->id, 'is_admin' => 1]);
        $this->json('POST', 'group/invite/' . $group->id,['user_id'=>array($user2->id)])->seeJson([
            'status' => true,
        ]);
    }

    public function setUserAdmin()
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
        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test']);
        \App\GroupUser::create(['user_id' => $user->id, 'group_id' => $group->id, 'is_admin' => 1]);
        \App\GroupUser::create(['user_id' => $user2->id, 'group_id' => $group->id, 'is_admin' => 1]);
        $this->json('GET', 'group/set_user_admin/' . $group->id . '/' . $user2->id)->seeJson([
            'status' => true,
        ]);
    }
}
