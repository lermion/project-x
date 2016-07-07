<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AdminUserTest extends TestCase
{
    use DatabaseTransactions;
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $this->json('GET', 'admin/user/')->AssertResponseOk();
    }
    
    public function testShow()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->json('GET', 'admin/user/show/'.$user->id)->AssertResponseOk();
    }
    
    public function testDestroy()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->json('GET', 'admin/user/delete/'.$user->id.'/1')->assertRedirectedTo('/admin/user');
        $this->seeInDatabase('black_lists', ['phone'=>$user->phone]);
    }
}
