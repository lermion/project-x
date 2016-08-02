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

    public function testComments()
    {
        $this->json('GET', 'moderator/comments/');
    }

    public function testDeleteComment()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $coment = \App\Comment::create(['text' => 'test','user_id' => $user->id]);
        $this->json('GET', 'moderator/delete_comment/'.$coment->id);
        $coment->delete();
    }

    public function testGetComplaints()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $user2 = \App\User::where('phone','380731059231')->first();
        if(!$user2){
            $user2 = \App\User::create(['phone'=>'380731059231', 'login'=>'bone', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $coment = \App\Comment::create(['text' => 'test','user_id' => $user->id]);
        $complaint_comment = \App\ComplaintComment::create(['comment_id' => $coment->id, 'complaint_category_id' => 1, 'user_which_id' => $user->id, 'user_to_id' => $user2->id]);
        $this->json('GET', 'moderator/complaints/');
        $complaint_comment->delete();
        $coment->delete();
    }

    public function testDeleteComplaints()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $user2 = \App\User::where('phone','380731059231')->first();
        if(!$user2){
            $user2 = \App\User::create(['phone'=>'380731059231', 'login'=>'bone', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $coment = \App\Comment::create(['text' => 'test','user_id' => $user->id]);
        $complaint_comment = \App\ComplaintComment::create(['comment_id' => $coment->id, 'complaint_category_id' => 1, 'user_which_id' => $user->id, 'user_to_id' => $user2->id]);
        $this->json('GET', 'moderator/delete_complaint/'.$complaint_comment->id);
        $coment->delete();
    }

}
