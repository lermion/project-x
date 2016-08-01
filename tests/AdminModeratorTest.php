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
//    public function testIndex()
//    {
//        $this->json('GET', 'admin/moderator/')->assertRedirectedTo('admin/moderator/');
//    }

    public function testStore()
    {
        $data = ['email'=>'email@mail.ru',
            'first_name'=>'12345',
            'last_name'=>'12345',
            'password'=>'111111',
            'photo'=>'photo'];

        $this->json('POST', 'admin/moderator/store/',$data)->AssertResponseOk();
    }
}
