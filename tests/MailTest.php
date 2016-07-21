<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class MailTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->be($user);
        $this->json('POST', 'mail/', ['name' => 'name','email'=>'email@email.com','text' => 'text'])
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('user_mails', ['name' => 'name','email' => 'email@email.com','text'=>'text']);
    }
}
