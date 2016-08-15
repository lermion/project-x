<?php

namespace App\Http\Controllers;

use DB;
use App\UserChat;
use App\ChatLockedUser;
use App\Subscriber;
use App\User;
use App\Online;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class SubscriberController extends Controller
{
    public function store(Request $request)
    {
        try {
            $this->validate($request, [
                'user_id' => 'required|exists:users,id',
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

        $userId = $request->input('user_id');
        $userIdSub = Auth::id();
        if ($userId == $userIdSub) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Can not subscribe to your self",
                    'code' => '14'
                ]
            ];
            return response()->json($result);
        }
        $resultData = [
            'status' => true
        ];
        if ($sub = Subscriber::where('user_id', $userId)->where('user_id_sub', $userIdSub)->first()) {
            $sub->delete();
            $resultData['is_sub'] = false;
            return response()->json($resultData);
        } else {
            $isConfirmed = !User::find($userId)->is_private;
            Subscriber::create(['user_id' => $userId, 'user_id_sub' => $userIdSub, 'is_confirmed' => $isConfirmed]);
            $resultData['is_sub'] = true;
            return response()->json($resultData);
        }
    }

    public function confirm($id)
    {
        $sub = Subscriber::find($id);
        if (!$sub) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        } elseif ($sub->user_id != Auth::id()) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($result);
        } else {
            $sub->is_confirmed = true;
            $sub->save();
            return response()->json(['status' => true]);
        }
    }

    public function subscription($id)
    {
        $user = User::find($id);
        if ($user) {
            $subscription = $user->subscription;
            if (Auth::check()) {
                foreach ($subscription as &$sub) {
                    $sub->is_sub = Subscriber::isSub($sub->id, Auth::id());
                    $sub->is_online = Online::isOnline($sub->id);
                    if (ChatLockedUser::where(['user_id'=>$id, 'locked_user_id'=>$sub->id])->first()) {
                        $sub->is_lock = true;
                    } else {
                        $sub->is_lock = false;
                    }
                    if ($room = DB::select('SELECT `room_id` FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` WHERE `user_id`=?) AND `user_id` = ?', [$sub->id, $id])){
                        $sub->room_id = $room[0]->room_id;
                    } else {$sub->room_id = false;
                    }
                }
            }
            return $subscription;
        } else {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => 'Incorrect id',
                    'code' => '1'
                ]
            ];
            return response()->json($responseData);
        }
    }

    public function subscribers($id)
    {
        $user = User::find($id);
        if ($user) {
            $subscribers = $user->subscribers;
            if (Auth::check()) {

                foreach ($subscribers as &$sub) {
                    $sub->is_sub = Subscriber::isSub($sub->id, Auth::id());
                    $sub->is_confirmed = Subscriber::isConfirmed($sub->id, Auth::id());
                    $sub->is_online = Online::isOnline($sub->id);
                    if (ChatLockedUser::where(['user_id'=>$id, 'locked_user_id'=>$sub->id])->first()) {
                        $sub->is_lock = true;
                    } else {
                        $sub->is_lock = false;
                    }
                    if ($room = DB::select('SELECT `room_id` FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` WHERE `user_id`=?) AND `user_id` = ?', [$sub->id, $id])){
                        $sub->room_id = $room[0]->room_id;
                    } else {$sub->room_id = false;
                    }
                }
            }
            return $subscribers;
        } else {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => 'Incorrect id',
                    'code' => '1'
                ]
            ];
            return response()->json($responseData);
        }
    }


    public function count_not_confirmed()
    {
        $confirmed = Subscriber::where(['user_id' =>  Auth::id(), 'is_confirmed' => false])->count();
        return response()->json(['status' => true, 'confirmed' => $confirmed]);

    }

}
