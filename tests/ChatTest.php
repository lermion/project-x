<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ChatTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testLockedChatUser()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test']);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if (!$user_chat){
            \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $user_chat2 = \App\UserChat::where(['user_id' => $user2->id, 'room_id' => $room->id]);
        if (!$user_chat2){
            \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }
        $this->json('GET', 'chat/locked/' . $user2->id )->seeJson(['status' => true]);
    }

    public function testGet_locked_users()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $chat_locked_user = \App\ChatLockedUser::where(['user_id' => $user->id, 'locked_user_id' => $user2->id]);
        if (!$chat_locked_user){
            \App\ChatLockedUser::create(['user_id' => $user->id, 'locked_user_id' => $user2->id]);
        }
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test']);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if (!$user_chat){
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $this->json('GET', 'chat/get_locked_users')->AssertResponseOk();
        $room->delete();
        $user_chat->delete();
    }

    public function testDeleteChat()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test']);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if ($user_chat){
            $user_chat->delete();
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }else {
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $this->be($user);
        $this->json('GET', 'chat/delete_chat/' . $room->id )->seeJson(['status' => true]);
    }

    public function testDeleteUser()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test', 'id' => 1]);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if ($user_chat){
            $user_chat->delete();
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }else {
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $user_chat2 = \App\UserChat::where(['user_id' => $user2->id, 'room_id' => $room->id]);
        if ($user_chat2){
            $user_chat2->delete();
            $user_chat2 = \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }else {
            $user_chat2 = \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }
        $sub = \App\Subscriber::create(['user_id' => $user->id, 'user_id_sub' => $user2->id, 'is_confirmed' => false]);
        \App\Subscriber::create(['user_id' => $user2->id, 'user_id_sub' => $user->id, 'is_confirmed' => false]);
        $this->json('GET', 'chat/delete_user/' . $room->id . '/' . $sub->user_id_sub )->seeJson(['status' => true]);
    }

    public function testNotificationChat()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test', 'id' => 1]);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if ($user_chat){
            $user_chat->delete();
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }else {
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $user_chat2 = \App\UserChat::where(['user_id' => $user2->id, 'room_id' => $room->id]);
        if ($user_chat2){
            $user_chat2->delete();
            $user_chat2 = \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }else {
            $user_chat2 = \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }
        $this->json('GET', 'chat/notification/' . $room->id )->seeJson(['status' => true]);
    }

    public function testCorrespondenceDelete()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $user2 = \App\User::where('phone', '380731059231')->first();
        if (!$user2) {
            $user2 = \App\User::create(['phone' => '380731059231', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test']);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if ($user_chat){
            $user_chat->delete();
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }else {
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $user_chat2 = \App\UserChat::where(['user_id' => $user2->id, 'room_id' => $room->id]);
        if ($user_chat2){
            $user_chat2->delete();
            $user_chat2 = \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }else {
            $user_chat2 = \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        }
        $message = \App\Message::where(['text' => 'test', 'user_id' => $user->id]);
        if ($message){
            $message->delete();
            $message = \App\Message::create(['text' => 'test', 'user_id' => $user->id]);
        }else {
            $message = \App\Message::create(['text' => 'test', 'user_id' => $user->id]);
        }
        \App\UserRoomsMessage::create(['room_id' => $room->id, 'message_id' => $message->id]);

        $this->json('GET', 'chat/correspondence_delete/' . $room->id )->seeJson(['status' => true]);
    }

    public function testFileChat()
    {
        $user = \App\User::where('phone', '380731059230')->first();
        if (!$user) {
            $user = \App\User::create(['phone' => '380731059230', 'password' => bcrypt('123'), 'country_id' => 1]);
        }
        $this->be($user);
        $room = \App\ChatRoom::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRoom::create(['name' => 'test']);
        }
        $user_chat = \App\UserChat::where(['user_id' => $user->id, 'room_id' => $room->id]);
        if ($user_chat){
            $user_chat->delete();
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }else {
            $user_chat = \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        }
        $message = \App\Message::where(['text' => 'test', 'user_id' => $user->id]);
        if ($message){
            $message->delete();
            $message = \App\Message::create(['text' => 'test', 'user_id' => $user->id]);
        }else {
            $message = \App\Message::create(['text' => 'test', 'user_id' => $user->id]);
        }
        \App\UserRoomsMessage::create(['room_id' => $room->id, 'message_id' => $message->id]);
        $image = \App\Image::create(['url' => 'url_image']);
        $video = \App\Video::create(['url' => 'url_video', 'img_url' => 'url_img', 'is_coded' => '34']);
        \App\MessageVideo::create(['message_id'=>$message->id, 'video_id' => $video->id]);
        \App\MessageImage::create(['message_id'=>$message->id, 'image_id' => $image->id]);
        $this->json('GET', 'chat/file_chat/' . $room->id )->seeJson(['status' => true]);
        \App\Image::where(['url' => 'url_image'])->delete();
        \App\UserRoomsMessage::where(['room_id' => $room->id, 'message_id' => $message->id])->delete();
        \App\Video::where(['url' => 'url_video', 'img_url' => 'url_img', 'is_coded' => '34'])->delete();
    }
}
