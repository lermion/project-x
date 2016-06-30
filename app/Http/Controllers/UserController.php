<?php

namespace App\Http\Controllers;

use App\Online;
use App\Subscriber;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Get a listing of the users.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Get user.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($login)
    {
        $user = User::where('login', $login)->first();
        $user->is_online = Online::isOnline($user->id);
        $user->is_sub = Subscriber::isSub($user->id, Auth::id());
        $user->subscription_count = $user->subscription()->count();
        $user->subscribers_count = $user->subscribers()->count();
        $user->publications_count = $user->publications()->where(['is_anonym' => false])->count();
        if (!$user->is_avatar)
            $user->avatar_path = '';
        return $user;
    }

    /**
     * Update user information.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $id = Auth::id();
        try {
            $this->validate($request, [
                'phone' => 'unique:users|numeric|min:5',
                'login' => 'unique:users',
                'is_visible' => 'boolean',
                'is_avatar' => 'boolean'
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
        $user = User::find($id);
        if (!$user) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect user id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        } else {
            $user->update($request->all());
            if ($request->input('is_visible') == false)
                Online::logOut(Auth::id());
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $path = $this->getAvatarPath($avatar);
                $user->avatar_path = $path;
                if ($request->hasFile('original_avatar')) {
                    $originalAvatar = $request->file('original_avatar');
                    $path = $this->getAvatarPath($originalAvatar);
                }
                $user->original_avatar_path = $path;
            }
            $user->save();

            return response()->json(["status" => true, 'user' => $user, 'user_id' => $user->id, 'login' => $user->login]);
        }
    }

    public function addFirstInfo(Request $request)
    {
        if (!$request->session()->has('canRegistered')) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($result);
        }
        try {
            $this->validate($request, [
                'login' => 'required|unique:users',
                'password' => 'required|min:6',
                'first_name' => 'required',
                'last_name' => 'required'
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
        $password = $request->input('password');
        $userId = $request->session()->get('user_id');
        $user = User::find($userId);
        $user->update($request->all());
        $user->password = bcrypt($password);
        $user->save();
        Auth::attempt(['login' => $user->login, 'password' => $password]);
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = $this->getAvatarPath($avatar);
            $user->avatar_path = $path;
            if ($request->hasFile('original_avatar')) {
                $originalAvatar = $request->file('original_avatar');
                $path = $this->getAvatarPath($originalAvatar);
            }
            $user->original_avatar_path = $path;
        }
        $user->save();
        return response()->json(["status" => true, 'user' => $user, 'user_id' => $user->id, 'login' => $user->login]);
    }

    private function getAvatarPath($avatar)
    {
        $path = '/upload/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }
}
