<?php

namespace App\Http\Controllers;

use App\AccessCode;
use App\DesiredScope;
use App\Online;
use App\Option;
use App\Publication;
use App\Scope;
use App\ScopeUser;
use App\Subscriber;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\ChatLockedUser;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

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
        ChatLockedUser::where(['user_id' => $user->id, 'locked_user_id' => Auth::id()])->first() ? $user->is_lock = true : $user->is_lock = false;
        $user->is_online = Online::isOnline($user->id);
        $user->is_sub = Subscriber::isSub($user->id, Auth::id());
        $user->subscription_count = $user->subscription()->count();
        $user->subscribers_count = $user->subscribers()->count();
        $user->publications_count = Publication::getCountUserPublication($user->id);
        $user->scopes =$this->getScopes();
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
                //'scopes' => 'required|array|max:3',
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
                'last_name' => 'required',
                'scopes' => 'required|array|max:1'
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
        $closed_registration = Option::pluck('closed_registration');
        if($closed_registration[0] == true) {
            $code = $request->session()->get('code');
            $correct_code = AccessCode::where(['code' => $code])->first();
            $correct_code->invited_user_id = $userId;
            $correct_code->save();
            $user_id_sub = $correct_code->user_id;
            if ($user_id_sub) {
                Subscriber::create(['user_id' => $userId, 'user_id_sub' => $user_id_sub, 'is_confirmed' => true]);
                Subscriber::create(['user_id' => $user_id_sub, 'user_id_sub' => $userId, 'is_confirmed' => true]);
            }
        }
        $desired_scope = $request->input('desired_scope');
        if ($desired_scope) {
            DesiredScope::create(['user_id' => $userId, 'scope_name' => $desired_scope]);
        }
        $scopes = $request->input('scopes');
        $user->scopes()->attach($scopes);
        $user->update($request->all());
        $user->password = bcrypt($password);
        AccessCode::generateCode($userId);
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

    public function getCodes($id)
    {
       $codes = AccessCode::where('user_id',$id)->get();
        $result = [];
        foreach ($codes as $code){
            $result[] = [
                'code' => $code->code,
                'isUsed' => $code->invited_user_id == null ? false : true
            ];
        }
        return response()->json($result);

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

    public function getScopes()
    {
        $user = User::find(Auth::id());
        $scopes_user = $user->scopes()->pluck('scopes.id');
        $scopes = Scope::orderBy('order')->get();
        $all = false;
//        foreach ($scopes_user as $scope_user){
//            if ($scope_user == 1){
//                $all = true;
//            }
//        }
//        if ($all == true) {
//            $data_scope = [];
//            foreach ($scopes as $scope) {
//                $scope['signed'] = true;
//                $data_scope[] = $scope;
//            }
//            return $data_scope;
//        } else {
            $data_scope = [];
            foreach ($scopes as $scope) {
                foreach ($scopes_user as $scope_user) {
                    if ($scope['id'] == $scope_user) {
                        $scope['signed'] = true;
                    }
                }
                $data_scope[] = $scope;
            }
            return $data_scope;
//        }
    }

    public function updateScopes(Request $request)
    {
        try {
            $this->validate($request, [
                'scopes' => 'required|array|max:3',
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
        $updated_at_scope = ScopeUser::where('user_id',Auth::id())->orderBy('updated_at')->take(1)->pluck('updated_at');
        $carbon_updated_at_scope =  new Carbon($updated_at_scope[0]);
        $timestamp_carbon_updated_at_scope = $carbon_updated_at_scope->timestamp;
        $now = Carbon::now();
        $yesterday_timestamp = $now->subDay()->timestamp;
        if ($timestamp_carbon_updated_at_scope < $yesterday_timestamp){
            $desired_scope = $request->input('desired_scope');
            $user = User::find(Auth::id());
            ScopeUser::where('user_id',Auth::id())->delete();
            $scopes = $request->input('scopes');
            $user->scopes()->attach($scopes);
            if ($desired_scope) {
                DesiredScope::create(['user_id' => $user->id, 'scope_name' => $desired_scope]);
            }
            $result = [
                "status" => true
            ];
            return response()->json($result);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => 'Changes may be once a day',
                    'code' => '2'
                ]
            ];
            return response()->json($result);
        }
    }
}
