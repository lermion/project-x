<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ChatLockedUser;
use App\User;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class ChatLockedUserController extends Controller
{
    public function get_locked_users()
    {
        //$locked_users = ChatLockedUser::where('user_id', Auth::id())->pluck('locked_user_id');
        $locked_users = User::join('chat_locked_users','chat_locked_users.locked_user_id','=','users.id')
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.avatar_path', 'users.login')
            ->where(['chat_locked_users.user_id'=>Auth::id()])->get();
        return $locked_users;
    }

    public function locked($locked_user_id)
    {
        if ($chat_locked_user = ChatLockedUser::where(['locked_user_id' => $locked_user_id, 'user_id' => Auth::id()])->first()) {
            $chat_locked_user->delete();
            $islock = false;
        } else {
            ChatLockedUser::create(['locked_user_id' => $locked_user_id, 'user_id' => Auth::id()]);
            $islock = true;
        }
        return response()->json(['status' => true, 'is_lock' => $islock]);
    }
}
