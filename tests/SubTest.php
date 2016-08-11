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

    public function testConfirm()
    {
        $user1 = \App\User::create(['phone' => '88888888888', 'password' => bcrypt('123'), 'country_id' => 1]);
        $user2 = \App\User::create(['phone' => '99999999999', 'password' => bcrypt('123'), 'country_id' => 1]);
        $sub = \App\Subscriber::create(['user_id' => $user1->id, 'user_id_sub' => $user2->id, 'is_confirmed' => false]);
        $this->be($user1);
        $this->json('get', 'user/subscribe/confirm/'.$sub->id)
            ->seeJson([
                'status' => true,
            ]);
        $this->seeInDatabase('subscribers', ['user_id' => $user1->id, 'user_id_sub' => $user2->id,'is_confirmed'=>true]);
    }

    public function testSubscription()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $this->json('GET', 'user/'.$user->id.'/subscription')->AssertResponseOk();
    }

    public function testSubscribers()
    {
        $user = \App\User::first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $this->json('GET', 'user/'.$user->id.'/subscribers')->AssertResponseOk();
    }

    public function testCountNotConfirmed()
    {
        $user1 = \App\User::create(['phone' => '88888888888', 'password' => bcrypt('123'), 'country_id' => 1, 'is_private' => false]);
        $user2 = \App\User::create(['phone' => '99999999999', 'password' => bcrypt('123'), 'country_id' => 1]);
        $sub = \App\Subscriber::create(['user_id' => $user1->id, 'user_id_sub' => $user2->id, 'is_confirmed' => false]);
        $this->be($user1);
        $this->json('get', 'user/count_not_confirmed')
            ->seeJson([
                'status' => true,
            ]);
        $user1->delete();
        $user2->delete();
        $sub->delete();
    }
}
