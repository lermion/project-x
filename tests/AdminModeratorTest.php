<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AdminModeratorTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $this->json('GET', 'admin/moderator/')->assertRedirectedTo('admin/moderator/');
    }

    public function testShow()
    {
        $user = \App\Moderator::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->json('GET', 'admin/user/show/'.$user->id)->AssertResponseOk();
    }
}
