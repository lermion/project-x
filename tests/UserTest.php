<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserTest extends TestCase
{
    use DatabaseTransactions;
    
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUpdate()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->be($user);
        $this->json('POST', 'user/update/', ['first_name' => 'test','last_name'=>'test'])
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('users', ['phone' => $user->phone,'first_name' => 'test','last_name'=>'test']);
    }

    public function testAddFirstInfo()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->withSession(['canRegistered' => true,'user_id' => $user->id])
            ->json('POST', 'user/add_first_info/', ['login' => 'test','password'=>'testtest','first_name'=>'test','last_name'=>'test'])
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('users', ['phone' => $user->phone,'first_name' => 'test','last_name'=>'test']);
    }

    public function testShow(){
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230','password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->json('GET', 'user/show/'.$user->login, [])->AssertResponseOk() ;
    }
    
}
