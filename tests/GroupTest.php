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
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->be($user);
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
    
    public function testUpdate(){
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $group = \App\Group::first();
        if(!$group){
            $group = \App\Group::create(['name'=>'test', 'url_name'=>'test', 'description'=>'test', 'is_open'=>1, 'avatar'=>'test']);
        }
        \App\GroupUser::create(['user_id'=>$user->id,'group_id'=>$group->id,'is_admin'=>1]);
        $this->be($user);
        $data = [
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('POST', 'group/update/'.$group->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('groups', $data);
    }

    public function testDelete(){
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $group = \App\Group::first();
        if(!$group){
            $group = \App\Group::create(['name'=>'test', 'url_name'=>'test', 'description'=>'test', 'is_open'=>1, 'avatar'=>'test']);
        }
        \App\GroupUser::create(['user_id'=>$user->id,'group_id'=>$group->id,'is_admin'=>1]);
        $this->be($user);
        $data = [
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('GET', 'group/destroy/'.$group->id, $data)->seeJson([
            'status' => true,
        ]);
    }

    public function testShow(){
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $group = \App\Group::first();
        if(!$group){
            $group = \App\Group::create(['name'=>'test', 'url_name'=>'test', 'description'=>'test', 'is_open'=>1, 'avatar'=>'test']);
        }
        \App\GroupUser::create(['user_id'=>$user->id,'group_id'=>$group->id,'is_admin'=>1]);
        $this->be($user);
        $data = [
            'name' => 'test',
            'description' => 'lorem',
            'is_open' => true
        ];
        $this->json('GET', 'group/show/'.$group->url_name, $data)->AssertResponseOk();
    }
}
