<?php

namespace App\Http\Controllers\Moderator;

use App\Comment;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $count = $request->input('count') ? $request->input('count') : 10;
        $users = User::all();
        return response()->json(["status" => true, 'users' => $users]);
    }

    public function show($id)
    {
        $user = User::find($id);
        $offset = 0;
        $limit = 10;
        Comment::with(['videos', 'images', 'user'])->where('user_id', $id)->get()->toArray()
            ? $user->comments = Comment::with(['videos', 'images', 'user'])->where('user_id', $id)->get()->toArray()
            : $user->comments = false;
        $user->getSubscription($id)->toArray()
            ? $user->subscription = $user->getSubscription($id)
            : $user->subscription = false;
        $user->getSubscribers($id)->toArray()
            ? $user->subscribers = $user->getSubscribers($id)
            : $user->subscribers = false;
        $user->getPublication($id)->toArray()
            ? $user->publications = $user->getPublication($id)
            : $user->publications = false;
        User::find($user->id)->groups()->where(['group_users.user_id' => $user->id, 'group_users.is_creator' => true])->get()->toArray()
            ? $user->groups = User::find($user->id)->groups()->where(['group_users.user_id' => $user->id, 'group_users.is_creator' => true])->get()->toArray()
            : $user->groups = false;
        User::find($user->id)->places()->where(['place_users.user_id' => $user->id, 'place_users.is_creator' => true])->get()->toArray()
            ? $user->places = User::find($user->id)->places()->where(['place_users.user_id' => $user->id, 'place_users.is_creator' => true])->get()->toArray()
            : $user->places = false;
        //return view('admin.user.show')->with('user', $user);
        return response()->json(["status" => true, 'user' => $user]);
    }


    public function confirm($id)
    {
        if (\DB::transaction(function($id) use ($id){
            $user = User::find($id);
            if ($user->status != 'Подтвержден' or $user->status = '') {
                $user->status = 'Подтвержден';
                $user->save();
                return true;
            } }))
        {return response()->json(['status' => true]);} else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return response()->json($result);
        }
    }

    public function getConfirm()
    {
        if ($user = User::where(['status' => 'Подтвержден'])->get()->toArray()) {
            return $user;
        } else {
            $result = [
                "status" => false,
            ];
            return response()->json($result);
        }
    }

    public function review($id)
    {
        if (\DB::transaction(function($id) use ($id){
            $user = User::find($id);
            if ($user->status != 'На заметке' or $user->status = '') {
                $user->status = 'На заметке';
                $user->save();
                return true;
            } }))
        {return response()->json(['status' => true]);} else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return response()->json($result);
        }
    }

    public function getReview()
    {
        if ($user = User::where(['status' => 'На заметке'])->get()->toArray()) {
            return $user;
        } else {
            $result = [
                "status" => false,
            ];
            return response()->json($result);
        }
    }

    public function suspicious($id)
    {
        if (\DB::transaction(function($id) use ($id){
        $user = User::find($id);
        if ($user->status != 'Подозрительный' or $user->status = '') {
            $user->status = 'Подозрительный';
            $user->save();
            return true;
        } }))
        {return response()->json(['status' => true]);} else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return response()->json($result);
        }
    }

    public function getSuspicious()
    {
        if ($user = User::where(['status' => 'Подозрительный'])->get()->toArray()) {
            return $user;
        } else {
            $result = [
                "status" => false,
            ];
            return response()->json($result);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id);
        $user->is_block = true;
        $user->save();
        return response()->json(['status' => true]);
    }

    public function newCountUsers()
    {
        $user = User::where(['status'=>'','is_block'=>false])->count();
        return response()->json(['status' => true, 'users'=> $user]);
    }
}
