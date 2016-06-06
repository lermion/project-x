<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PasswordTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testUpdate()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('654321'), 'country_id' => 1]);
        } else {
            $user->password = bcrypt('654321');
        }
        $this->be($user);
        $this->json('POST', 'password/update', ['password' => '123456', 'old_password' => '654321'])
            ->seeJson([
                'status' => true,
            ]);
    }

    public function testRestore(){
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('654321'), 'country_id' => 1]);
        }
        $this->json('POST', 'password/restore', ['phone' => '380731059230'])
            ->seeJson([
                'status' => true,
            ]);
    }

    public function testValidateCode(){
        $this->withSession(['smsCodePass' => '1111'])
            ->json('POST', 'password/validate_code', ['sms_code' => '1111'])
            ->seeJson([
                'status' => true,
            ]);
    }
}
