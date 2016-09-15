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

//    public function testComments()
//    {
//        $this->json('GET', 'moderator/comments/');
//    }
//
//    public function testDeleteComment()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $coment = \App\Comment::create(['text' => 'test','user_id' => $user->id]);
//        $this->json('GET', 'moderator/delete_comment/'.$coment->id);
//        $coment->delete();
//    }
//
//    public function testGetPublicationComplaints()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $user2 = \App\User::where('phone','380731059231')->first();
//        if(!$user2){
//            $user2 = \App\User::create(['phone'=>'380731059231', 'login'=>'bone', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id]);
//        $complaint_comment = \App\ComplaintPublication::create(['publication_id' => $publication->id, 'complaint_category_id' => 1, 'user_which_id' => $user->id, 'user_to_id' => $user2->id]);
//        $this->json('GET', 'moderator/publication_complaints/');
//        $complaint_comment->delete();
//        $publication->delete();
//    }
//
//    public function testDeletePublicationComplaints()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $user2 = \App\User::where('phone','380731059231')->first();
//        if(!$user2){
//            $user2 = \App\User::create(['phone'=>'380731059231', 'login'=>'bone', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id]);
//        $complaint_comment = \App\ComplaintPublication::create(['publication_id' => $publication->id, 'complaint_category_id' => 1, 'user_which_id' => $user->id, 'user_to_id' => $user2->id]);
//        $this->json('GET', 'moderator/delete_complaint_publication/'.$complaint_comment->id);
//        $publication->delete();
//    }
//
//    public function testGetCommentComplaints()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $user2 = \App\User::where('phone','380731059231')->first();
//        if(!$user2){
//            $user2 = \App\User::create(['phone'=>'380731059231', 'login'=>'bone', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $coment = \App\Comment::create(['text' => 'test','user_id' => $user->id]);
//        $complaint_comment = \App\ComplaintComment::create(['comment_id' => $coment->id, 'complaint_category_id' => 1, 'user_which_id' => $user->id, 'user_to_id' => $user2->id]);
//        $this->json('GET', 'moderator/comment_complaints/');
//        $complaint_comment->delete();
//        $coment->delete();
//    }
//
//    public function testDeleteCommentComplaints()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $user2 = \App\User::where('phone','380731059231')->first();
//        if(!$user2){
//            $user2 = \App\User::create(['phone'=>'380731059231', 'login'=>'bone', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $coment = \App\Comment::create(['text' => 'test','user_id' => $user->id]);
//        $complaint_comment = \App\ComplaintComment::create(['comment_id' => $coment->id, 'complaint_category_id' => 1, 'user_which_id' => $user->id, 'user_to_id' => $user2->id]);
//        $this->json('GET', 'moderator/delete_complaint_comment/'.$complaint_comment->id);
//        $coment->delete();
//    }
//
//    public function testConfirmPublication()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id]);
//        $this->json('GET', 'moderator/confirmPublication/'.$publication->id);
//        $publication->delete();
//    }
//
//    public function testBlockPublication()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id]);
//        $data = ['block_message' => 'test'];
//        $this->json('POST', 'moderator/blockPublication/'.$publication->id, $data);
//        $publication->delete();
//    }
//
//    public function testTopicPublication()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id]);
//        $this->json('GET', 'moderator/topic/'.$publication->id);
//        $publication->delete();
//    }
//
//    public function testGetPublication()
//    {
//        $user = \App\User::where('phone','380731059230')->first();
//        if(!$user){
//            $user = \App\User::create(['phone'=>'380731059230', 'login'=>'bonep', 'password'=>bcrypt('123'),'country_id'=>1]);
//        }
//        $publication = \App\Publication::create(['text' => 'test','user_id' => $user->id]);
//        $this->json('GET', 'moderator/getPublication/');
//        $publication->delete();
//    }
//
//    public function testGetGroups()
//    {
//        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>false]);
//        $this->json('GET', 'moderator/getGroups/');
//        $group->delete();
//    }
//
//    public function testConfirmGroup()
//    {
//        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>false]);
//        $this->json('GET', 'moderator/confirmGroup/'.$group->id);
//        $group->delete();
//    }
//
//    public function testBlockGroup()
//    {
//        $group = \App\Group::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'is_open' => 1, 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>false]);
//        $data = ['block_message' => 'test'];
//        $this->json('POST', 'moderator/blockGroup/'.$group->id, $data);
//        $group->delete();
//    }
//
//    public function testGetPlaces()
//    {
//        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>false]);
//        $this->json('GET', 'moderator/getPlaces/');
//        $place->delete();
//    }
//
//    public function testConfirmPlace()
//    {
//        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>false]);
//        $this->json('GET', 'moderator/confirmPlace/'.$place->id);
//        $place->delete();
//    }
//
//    public function testBlockPlace()
//    {
//        $place = \App\Place::create(['name' => 'test', 'url_name' => 'test', 'description' => 'test', 'city_id' => '1', 'type_place_id' => '1', 'address' => 'test', 'coordinates_x'=> '1', 'coordinates_y'=> '1', 'avatar' => 'test', 'is_moderate'=>false, 'is_block'=>false]);
//        $data = ['block_message' => 'test'];
//        $this->json('POST', 'moderator/blockPlace/'.$place->id, $data);
//        $place->delete();
//    }
}
