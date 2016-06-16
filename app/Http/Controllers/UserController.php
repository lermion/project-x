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
        $user = User::where('login',$login)->first();
        $user->is_online = Online::isOnline($user->id);
        $user->is_sub = Subscriber::isSub($user->id,Auth::id());
        return $user;
    }

    /**
     * Update user information.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Auth::check()) {
            if (Auth::user()->id != $id) {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect user id",
                        'code' => '7'
                    ]
                ];
                return response()->json($result);
            }
        } elseif (!$request->session()->has('canRegistered')) {
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
                'phone' => 'unique:users|numeric|min:5',
                'login' => 'unique:users'
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
            if ($password = $request->input('password')) {
                $user->password = bcrypt($password);
                $user->save();
                Auth::attempt(['login' => $user->login, 'password' => $password]);
            }
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $path = $this->getAvatarPath($avatar);
                $user->avatar_path = $path;
            }
            $user->save();
            
            return response()->json(["status" => true,'user_id'=>$user->id,'login'=>$user->login]);
        }
    }

    private function getAvatarPath($avatar){
        $path = '/upload/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $avatar->move($fullPath, $fileName);

        return $path.$fileName;
    }
}
