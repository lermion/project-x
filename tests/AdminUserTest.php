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

    public function testConfirm()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345','status'=>'confirm']);
        }
        $this->json('GET', 'admin/user/confirm/'.$user->id)->AssertResponseOk();
    }

    public function testReview()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345','status'=>'review']);
        }
        $this->json('GET', 'admin/user/review/'.$user->id)->AssertResponseOk();
    }

    public function testSuspicious()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345','status'=>'suspicious']);
        }
        $this->json('GET', 'admin/user/suspicious/'.$user->id)->AssertResponseOk();
    }
}
