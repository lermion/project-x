<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ModeratorTest extends TestCase
{
    public function testNewCountUsers()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $this->json('GET', 'moderator/users/new_count_users');
    }

    public function testCountComplaintComment()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $comment = \App\Comment::create(['user_id'=> $user->id, 'text'=> 'test']);
        $complaint_comment = \App\ComplaintComment::create(['comment_id'=>$comment->id, 'complaint_category_id'=>1, 'user_which_id'=>$user2->id, 'user_to_id'=>$user->id]);
        $this->json('GET', 'moderator/count_complaint_comment');
        $comment->delete();
        $complaint_comment->delete();
    }

    public function testCountComplaintPublication()
    {
        $user = \App\User::where('phone','380731059230')->first();
        if(!$user){
            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $publication = \App\Publication::create(['user_id'=> $user->id]);
        $complaint_publication = \App\ComplaintPublication::create(['publication_id'=>$publication->id, 'complaint_category_id'=>1, 'user_which_id'=>$user2->id, 'user_to_id'=>$user->id]);
        $this->json('GET', 'moderator/count_complaint_publication');
        $publication->delete();
        $complaint_publication->delete();
    }
}
