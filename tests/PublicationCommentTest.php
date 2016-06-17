<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class PublicationCommentTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     *
     * @return void
     */
    public function testIndex()
    {
        $user = \App\User::first();
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/comment/'.$publication->id)->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::first();
        $this->be($user);
        $data = [
            'text' => 'test'
        ];
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('POST', 'publication/comment/store/'.$publication->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('publications', $data);
    }

    public function testDelete()
    {
        $user = \App\User::first();
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $comment = $publication->comments()->create(['user_id' => $user->id]);
        $this->json('GET', 'publication/comment/destroy/' . $comment->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testLike()
    {
        $user = \App\User::first();
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $comment = $publication->comments()->create(['user_id' => $user->id]);
        $this->json('GET', 'publication/comment/like/' . $comment->id)->seeJson([
            'status' => true,
        ]);
    }
}
