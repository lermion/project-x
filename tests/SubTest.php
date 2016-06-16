<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class SubTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testStore()
    {
        $user1 = \App\User::create(['phone' => '88888888888', 'password' => bcrypt('123'), 'country_id' => 1]);
        $user2 = \App\User::create(['phone' => '99999999999', 'password' => bcrypt('123'), 'country_id' => 1]);
        $this->be($user1);
        $this->json('POST', 'user/subscribe/store', ['user_id' => $user2->id])
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('subscribers', ['user_id' => $user2->id, 'user_id_sub' => $user1->id]);
    }
}
