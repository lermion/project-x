<?php

namespace App\Http\Controllers;

use App\Subscriber;
use App\User;
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
                    'message' => "Can not subscribe to yourself",
                    'code' => '14'
                ]
            ];
            return response()->json($result);
        }
        if (!Auth::check()) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
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
            Subscriber::create(['user_id' => $userId, 'user_id_sub' => $userIdSub,'is_confirmed'=>$isConfirmed]);
            $resultData['is_sub'] = true;
            return response()->json($resultData);
        }
    }

    public function subscription($id)
    {
        $user = User::find($id);
        if ($user) {
            $subscription = $user->subscription;
            if (Auth::check()) {
                foreach ($subscription as &$sub) {
                    $sub->is_sub = Subscriber::isSub($user->id, Auth::id());
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
                    $sub->is_sub = Subscriber::isSub($user->id, Auth::id());
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
}
