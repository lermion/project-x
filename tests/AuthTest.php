<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class AuthTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUserCreate()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if($user){
            $user->delete();
        }
        $this->json('POST', 'auth/create', ['phone' => '380731059230','country_id'=>1])
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('users', ['phone' => '380731059230']);
    }
    
    public function testCheckSMSCode(){
        $this->withSession(['smsCode' => '1111'])
            ->json('POST', 'auth/check_sms', ['sms_code' => '1111'])
            ->seeJson([
                'status' => true,
            ]);
    }

    public function testAuth(){
        $user = \App\User::where('phone','380731059230')->first();
        if($user){
            $user->password = bcrypt('123');
            $user->save();
        }
        $this->json('POST', 'auth/', ['login' => '380731059230','password'=>'123'])
            ->seeJson([
                'status' => true,
            ]);
    }

    public function testLogOut()
    {
        $this->json('GET', 'auth/log_out')->AssertResponseOk();
    }
}
