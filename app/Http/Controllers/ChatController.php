<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DeleteMessage;
use App\Subscriber;
use App\ChatLockedUser;
use App\User;
use App\UserChat;
use App\Message;
use DB;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function delete_chat($room_id)
    {
        if (UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->delete()) {
            return response()->json(['status'=>true]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect room id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);

        }
    }

    public function delete_user($room_id, $user_id_sub)
    {
        if (UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->delete()) {
            Subscriber::where(['user_id' => Auth::id(), 'user_id_sub' => $user_id_sub])->delete();
            Subscriber::where(['user_id' => $user_id_sub, 'user_id_sub' => Auth::id()])->delete();
            return response()->json(['status'=>true]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect room id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);

        }
    }

    public function get_locked_users()
    {
        //$locked_users = ChatLockedUser::where('user_id', Auth::id())->pluck('locked_user_id');
        $locked_users = User::join('chat_locked_users','chat_locked_users.locked_user_id','=','users.id')
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.avatar_path', 'users.login')
            ->where(['chat_locked_users.user_id'=>Auth::id()])->get();
        if ($locked_users){
            foreach ($locked_users as &$locked){
                $room = DB::select('SELECT `room_id` FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` WHERE `user_id`=?) AND `user_id` = ?', [Auth::id(), $locked->id]);
                $locked->room_id = $room[0]->room_id;
            }
        }
        return $locked_users;
    }

    public function locked($locked_user_id)
    {
        if (ChatLockedUser::where(['locked_user_id' => $locked_user_id, 'user_id' => Auth::id()])->delete()) {
            if ($room = DB::select('SELECT `room_id` FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` WHERE `user_id`=?) AND `user_id` = ?', [Auth::id(), $locked_user_id])) {
                $room_id = $room[0]->room_id;
                $user_chat = UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->first();
                $user_chat->is_lock = !$user_chat->is_lock;
                $user_chat->save();
                $roomId = true;
            } else {
                $roomId = false;
            }
            $islock = false;
        } else {
            ChatLockedUser::create(['locked_user_id' => $locked_user_id, 'user_id' => Auth::id()]);
            if ($room = DB::select('SELECT `room_id` FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` WHERE `user_id`=?) AND `user_id` = ?', [Auth::id(), $locked_user_id])){
                $room_id = $room[0]->room_id;
                $user_chat = UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->first();
                $user_chat->is_lock = !$user_chat->is_lock;
                $user_chat->save();
                $roomId = true;
            } else {
                $roomId = false;
            }
            $islock = true;
        }
        return response()->json(['status' => true, 'is_lock' => $islock, 'room_id'=>$roomId]);
    }

    public function notification_chat($room_id)
    {
        if ($user_chat = UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->first()) {
            $user_chat->show_notif = !$user_chat->show_notif;
            $user_chat->save();
            return response()->json(['status' => true]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect room id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);

        }
    }

    public function correspondence_delete($room_id)
    {
        if(!$max_massage = Message::join('user_rooms_messages','user_rooms_messages.message_id','=','messages.id')->join('users','messages.user_id','=','users.id')->where('user_rooms_messages.room_id',$room_id)->max('messages.id')){
            $result = [
                "status" => false,
                "error" => [
                    'message' => "No correspondence",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
        if ($delete_massege = DeleteMessage::where(['user_id' => Auth::id(), 'room_id' => $room_id])->first()){
            $delete_massege->message_id = $max_massage;
            $delete_massege->save();
        } else {
            DeleteMessage::create(['user_id' => Auth::id(), 'room_id' => $room_id, 'message_id' => $max_massage]);
        }
        return response()->json(['status' => true]);
    }


}
