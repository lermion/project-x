<?php

namespace App\Http\Controllers;

use App\ChatRoom;
use App\Image;
use App\MessageVideo;
use App\Video;
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
use Illuminate\Support\Facades\Validator;


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
            return response()->json(['status' => true,$result]);

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

    public function file_chat($room_id)
    {
        $image = Image::select('images.url', 'images.created_at')
            ->join('message_images','message_images.image_id','=', 'images.id')
            ->join('user_rooms_messages','user_rooms_messages.message_id','=','message_images.message_id')
            ->where('user_rooms_messages.room_id',$room_id)
            ->get()
            ->toArray();

        $video = Video::select('videos.url', 'videos.created_at','img_url')
            ->join('message_videos','message_videos.video_id','=', 'videos.id')
            ->join('user_rooms_messages','user_rooms_messages.message_id','=','message_videos.message_id')
            ->where('user_rooms_messages.room_id',$room_id)
            ->get()
            ->toArray();
        if (!$video && !$image){
            $result = [
                "status" => false,
                "error" => [
                    'message' => "No videos and image",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
        $files = array_merge($image, $video);
        $ar_sort = array();
        foreach($files as &$files_item)
        {
            $ar_sort[] = $files_item['created_at'];
        }
        array_multisort($ar_sort, SORT_ASC, $files);
        $file = array_reverse($files);
        $result = array_chunk($file, 21);
        foreach($result as &$files){
            $tmp = [];
            foreach($files as &$f){
                $tmp[] = (object)$f;
            }
            $files = $tmp;
        }
        return response()->json(['status' => true, 'data' => $result]);
    }

    public function users(Request $request, $room_id)
    {
        try {
            $this->validate($request, [
                'avatar' => 'image',
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }
        if (!$chat = ChatRoom::find($room_id)) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "This chat does not exist",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        $chat = ChatRoom::find($room_id);
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = '/upload/';
            $fileName = str_random(8) . $avatar->getClientOriginalName();
            $fullPath = public_path() . $path;
            $avatar->move($fullPath, $fileName);
            $Data['avatar'] = $path . $fileName;
            $chat->avatar = $Data['avatar'];
        }
        $chat->status = $request->input('status');
        $chat->name = $request->input('name');
        $chat->save();
        $users = $request->input('id');
        foreach ($users as $user) {
            UserChat::firstOrCreate(['user_id' => $user, 'room_id' => $room_id]);
            UserChat::whereNotIn('user_id',$users)->where('room_id',$room_id)->delete();
        }
        return response()->json(["status" => true]);
    }

    public function exit_user($room_id)
    {
        if (!$chat = ChatRoom::find($room_id)) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "This chat does not exist",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->delete();
        return response()->json(["status" => true]);
    }

    public function exit_admin($room_id, $user_id)
    {
        if (!$chat = ChatRoom::find($room_id)) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "This chat does not exist",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        $user = UserChat::where(['user_id' => $user_id, 'room_id' => $room_id])->first();
        $user->is_admin = !$user->is_admin;
        $user->save();
        UserChat::where(['user_id' => Auth::id(), 'room_id' => $room_id])->delete();
        return response()->json(["status" => true]);
    }

    public function videos(Request $request)
    {
        try {
            $this->validate($request, [
                'message_id' => 'required|numeric',
                'videos' => 'required|array'
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }

        if ($request->hasFile('videos')) {
            $validator = Validator::make($request->file('videos'), [
                'mimes:mp4,3gp,WMV,avi,mkv,mov,wma,flv'
            ]);

            if ($validator->fails()) {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => 'Bad video',
                        'code' => '1'
                    ]
                ];
                return response()->json($result);
            }
        }
        $message_id = $request->input('message_id');
        $cover = [];
        foreach ($request->file('videos') as $video) {
            $f_name = $video->getClientOriginalName();
            $f_path = storage_path('tmp/video/');
            $video->move($f_path, $f_name);
            $new_fname = 'upload/chat/videos/' . uniqid();
            Video::makeFrame($f_name, $f_path, $new_fname);
            //Video::makeVideo($f_name, $f_path, $new_fname);
            $cmd = 'php ' . base_path() . '/artisan video:make "' . $f_name . '" ' . $f_path . ' ' . $new_fname;
            if (substr(php_uname(), 0, 7) == "Windows") {
                pclose(popen("start /B " . $cmd, "r"));
            } else {
                exec($cmd . " > /dev/null &");
            }
            $vidos = Video::create(['url' => $new_fname . '.mp4', 'img_url' => $new_fname . '.jpg',]);
            MessageVideo::create(['message_id' => $message_id, 'video_id' => $vidos->id]);
            $cover = ['id' => $vidos->id, 'url' => $new_fname . '.jpg'];
        }
        $result = ["status" => true, "cover"=>$cover];
        return response()->json($result);
    }
}
