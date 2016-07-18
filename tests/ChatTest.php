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
        $room = \App\ChatRooms::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRooms::create(['name' => 'test', 'id' => 1]);
        }
        \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        $this->json('GET', 'chat/locked/' . $user2->id )->seeJson([
            'status' => true,
        ]);
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
        \App\ChatLockedUser::create(['user_id' => $user->id, 'locked_user_id' => $user2->id]);
        $this->json('GET', 'chat/get_locked_users')->AssertResponseOk();
    }

    public function testDeleteChat()
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
        $room = \App\ChatRooms::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRooms::create(['name' => 'test', 'id' => 1]);
        }
        \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        $this->json('GET', 'chat/delete_chat/' . $room->id )->seeJson([
            'status' => true,
        ]);
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
        $room = \App\ChatRooms::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRooms::create(['name' => 'test', 'id' => 1]);
        }
        \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        $sub = \App\Subscriber::create(['user_id' => $user->id, 'user_id_sub' => $user2->id, 'is_confirmed' => false]);
        \App\Subscriber::create(['user_id' => $user2->id, 'user_id_sub' => $user->id, 'is_confirmed' => false]);
        $this->json('GET', 'chat/delete_user/' . $room->id . '/' . $sub->user_id_sub )->seeJson([
            'status' => true,
        ]);
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
        $room = \App\ChatRooms::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRooms::create(['name' => 'test', 'id' => 1]);
        }
        \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        $this->json('GET', 'chat/notification/' . $room->id )->seeJson([
            'status' => true,
        ]);
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
        $room = \App\ChatRooms::where('name', 'test')->first();
        if (!$room) {
            $room = \App\ChatRooms::create(['name' => 'test']);
        }
        \App\UserChat::create(['user_id' => $user->id, 'room_id' => $room->id]);
        \App\UserChat::create(['user_id' => $user2->id, 'room_id' => $room->id]);
        $message = \App\Message::create(['text' => 'test', 'user_id' => $user2->id]);
        $message2 = \App\Message::create(['text' => 'test2', 'user_id' => $user->id]);
        $message3 = \App\Message::create(['text' => 'test3', 'user_id' => $user2->id]);
        \App\UserRoomsMessage::create(['room_id' => $room->id, 'message_id' => $message2->id]);

        $this->json('GET', 'chat/correspondence_delete/' . $room->id )->seeJson([
            'status' => true,
        ]);
    }
}
