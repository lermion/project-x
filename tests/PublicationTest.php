<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PublicationTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $this->json('GET', 'publication/')->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::first();
        $this->be($user);
        $data = [
            'text' => 'test', 'is_anonym' => false, 'is_main' => false,
        ];
        $this->json('POST', 'publication/store', $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }

    public function testDeleet()
    {
        $user = \App\User::first();
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/destroy/' . $publication->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testLike()
    {
        $user = \App\User::first();
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/like/' . $publication->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testShow()
    {
        $user = \App\User::first();
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/show/' . $publication->id)->seeJson();
    }
}
