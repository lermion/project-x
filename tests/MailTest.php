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
    public function testMailCreate()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->be($user);
        $this->json('POST', 'admin/mail/create', ['name' => 'name','email'=>'email@email.com','text' => 'text'])
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('user_mails', ['name' => 'name','email' => 'email@email.com','text'=>'text']);
    }

    public function testMail()
    {
        $this->json('GET', 'admin/mail')->AssertResponseOk();
    }

    public function testMailReview()
    {
        $this->json('GET', 'admin/mail/get_review')->AssertResponseOk();
    }

    public function testMailClosed()
    {
        $this->json('GET', 'admin/mail/get_closed')->AssertResponseOk();
    }

    public function testDestroyMail()
    {
        $mail = \App\UserMail::create(['name'=>'test', 'email'=>'email@email.com', 'text'=>'test']);
        $this->json('GET', 'admin/mail/destroy/'.$mail->id)->assertRedirectedTo('admin/mail/');
    }

    public function testMailStatusReview()
    {
        $mail = \App\UserMail::create(['name' => 'test', 'email' => 'email@email.com', 'text' => 'test']);
        $this->json('GET', 'admin/mail/status_review/' . $mail->id)->seeJson(['status' => true]);
        $this->seeInDatabase('user_mails', ['name'=>'test', 'email'=>'email@email.com', 'text'=>'test']);
    }

    public function testMailStatusClosed()
    {
        $mail = \App\UserMail::create(['name'=>'test', 'email'=>'email@email.com', 'text'=>'test']);
        $this->json('GET', 'admin/mail/status_closed/'.$mail->id)->seeJson(['status' => true]);
        $this->seeInDatabase('user_mails', ['name'=>'test', 'email'=>'email@email.com', 'text'=>'test']);
    }
}
