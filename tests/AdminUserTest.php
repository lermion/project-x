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

    public function testGetConfirm()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345','status'=>'confirm']);
        }
        $this->json('GET', 'admin/user/get_confirm')->AssertResponseOk();
    }

    public function testGetReview()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345','status'=>'review']);
        }
        $this->json('GET', 'admin/user/get_review')->AssertResponseOk();
    }

    public function testGetSuspicious()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345','status'=>'suspicious']);
        }
        $this->json('GET', 'admin/user/get_suspicious')->AssertResponseOk();
    }

    public function testMainPicture()
    {
        $this->json('POST', 'admin/user/main_picture')->AssertResponseOk();
    }

    public function testCountUsers()
    {
        $user = \App\User::create(['country_id' => 1,'phone'=>'12345','status' => '']);
        $this->json('GET', 'admin/count/users');
        $user->delete();
    }

    public function testCountMails()
    {
        $user = \App\User::create(['country_id' => 1,'phone'=>'12345','status' => '']);
        $mail = \App\UserMail::create(['user_id' => $user->id, 'name'=>'name','email' => 'email','text' => 'text']);
        $this->json('GET', 'admin/count/mails');
        $user->delete();
        $mail->delete();
    }

    public function testCountBlockContent()
    {
        $user = \App\User::create(['country_id' => 1,'phone'=>'12345','status' => '','is_block'=>true]);
        $this->json('GET', 'admin/count/to_remove');
        $user->delete();
    }
}
