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
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('GET', 'publication/comment/'.$publication->id)->AssertResponseOk();
    }

    public function testStore()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $data = [
            'text' => 'test'
        ];
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $this->json('POST', 'publication/comment/store/'.$publication->id, $data)->seeJson([
            'status' => true,
        ]);
        $this->seeInDatabase('comments', $data);
    }

    public function testDelete()
    {
        $user = \App\User::first();
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
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
        if(!$user){
            $user = \App\User::create(['country_id'=>1,'phone'=>'12345']);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id' => $user->id]);
        $comment = $publication->comments()->create(['user_id' => $user->id]);
        $this->json('GET', 'publication/comment/like/' . $comment->id)->seeJson([
            'status' => true,
        ]);
    }

    public function testCreate()
    {
        $user1 = \App\User::create(['phone' => '88888888888', 'password' => bcrypt('123'), 'country_id' => 1]);
        $user2 = \App\User::create(['phone' => '99999999999', 'password' => bcrypt('123'), 'country_id' => 1]);
        $this->be($user1);
        $comment = \App\Comment::create(['user_id'=> $user2->id,'text' => 'test']);
        $this->json('POST', 'publication/comment/complaint', ['comment_id' =>$comment->id,
            'complaint_category_id'=>1])
            ->seeJson([
            'status' => true,
        ]);
    }
}
