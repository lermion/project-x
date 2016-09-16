<?php

namespace App\Http\Controllers;

use App\ChatRoom;
use App\Group;
use App\NewGroup;
use App\GroupInvite;
use App\GroupUser;
use App\Image;
use App\Scope;
use App\ScopeGroup;
use App\User;
use App\Online;
use App\UserRoomsMessage;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = User::find(Auth::id());
        $scopes = $user->scopes()->pluck('scopes.id');
        $all_scope = 0;
        foreach ($scopes as $scope) {
            if ($scope == 1)$all_scope++;
        }
        if ($all_scope == 1) {
                $groups = Group::select('groups.id', 'groups.is_open', 'groups.name', 'groups.url_name', 'groups.description', 'groups.avatar', 'groups.card_avatar', 'groups.created_at', 'groups.room_id')
                    ->where('groups.is_open', true)
                    ->orWhere(function ($query) {
                        $query->where('groups.is_open', false);
                        $query->whereExists(function ($query) {
                            $query->select(DB::raw('id'))
                                ->from('group_users')
                                ->where('group_users.user_id', Auth::id())
                                ->whereRaw('group_users.group_id = groups.id');
                        });
                    })
                    ->get();
                foreach ($groups as $group) {
                    $group->count_chat_message = UserRoomsMessage::where('room_id', $group->room_id)->count();
                    $group->count_user = $group->users()->count();
                    $group->publications = $group->publications()->count();
                    if (GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()) {
                        $group->is_sub = true;
                    } else {
                        $group->is_sub = false;
                    }
                    if (GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()) {
                        $group->is_admin = true;
                    } else {
                        $group->is_admin = false;
                    }
                    if (GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id(), 'is_creator' => true])->first()) {
                        $group->is_creator = true;
                    } else {
                        $group->is_creator = false;
                    }
                    if (NewGroup::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()) {
                        $group->is_new_group = true;
                    } else {
                        $group->is_new_group = false;
                    }
                }
            $result = array_unique($groups);
            return $result;
        } else {
            $all = [];
            foreach ($scopes as $scope) {
                $groups = Group::select('groups.id', 'groups.is_open', 'groups.name', 'groups.url_name', 'groups.description', 'groups.avatar', 'groups.card_avatar', 'groups.created_at', 'groups.room_id', 'scope_groups.scope_id')
                    ->join('scope_groups', 'groups.id', '=', 'scope_groups.group_id')
                    ->where(function ($query) use ($scope) {
                        $query->where('groups.is_open', true)
                            ->where('scope_groups.scope_id', $scope)
                        ->orWhere('scope_groups.scope_id', 1);
                    })
                    ->orWhere(function ($query) {
                        $query->where('groups.is_open', false);
                        $query->whereExists(function ($query) {
                            $query->select(DB::raw('id'))
                                ->from('group_users')
                                ->where('group_users.user_id', Auth::id())
                                ->whereRaw('group_users.group_id = groups.id');
                        });
                    })
                    ->get();
                foreach ($groups as $group) {
                    $group->count_chat_message = UserRoomsMessage::where('room_id', $group->room_id)->count();
                    $group->count_user = $group->users()->count();
                    $group->publications = $group->publications()->count();
                    if (GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()) {
                        $group->is_sub = true;
                    } else {
                        $group->is_sub = false;
                    }
                    if (GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()) {
                        $group->is_admin = true;
                    } else {
                        $group->is_admin = false;
                    }
                    if (GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id(), 'is_creator' => true])->first()) {
                        $group->is_creator = true;
                    } else {
                        $group->is_creator = false;
                    }
                    if (NewGroup::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()) {
                        $group->is_new_group = true;
                    } else {
                        $group->is_new_group = false;
                    }
                }
                $all[] = $groups;
            }
            $group = [];
            foreach ($all as $array) {
                foreach ($array as $one) {
                    $group[] = $one;
                }
            }
            $result = array_unique($group);
            return $result;
        }
    }

    public function adminGroup()
    {
        //return Group::join('group_users','group_users.group_id','=','groups.id')->where(['group_users.user_id'=>Auth::id(),'is_admin'=>true])->get();
        return User::find(Auth::id())->groups()->where(['group_users.user_id'=>Auth::id(),'group_users.is_admin'=>true])->get();
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required|unique:groups',
                'description' => 'required',
                'is_open' => 'required|boolean',
                'avatar' => 'image',
                'card_avatar' => 'image',
                'original_avatar' => 'image',
                'scopes' => 'required|array|max:3'
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
        $room = ChatRoom::create(['name' => $request->name]);
        $publicationData = $request->all();
        $publicationData['url_name'] = $this->transliterate($request->input('name'));
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarGroupPath($avatar);
            $publicationData['avatar'] = $path;
        }
        if ($request->hasFile('original_avatar')) {
            $avatar = $request->file('original_avatar');
            $path = Image::getOriginalAvatarGroupPath($avatar);
            $publicationData['original_avatar'] = $path;
        }
        if ($request->hasFile('card_avatar')) {
            $card_avatar = $request->file('card_avatar');
            $path = Image::getCardGroupPath($card_avatar);
            $publicationData['card_avatar'] = $path;
        }
        $publicationData['room_id'] = $room->id;
        $group = Group::create($publicationData);
        $scopes = $request->input('scopes');
        $group->scopes()->attach($scopes);
        NewGroup::create(['user_id' => Auth::id(), 'group_id' => $group->id,]);
        GroupUser::create(['user_id' => Auth::id(), 'group_id' => $group->id, 'is_admin' => true, 'is_creator' => true]);
        return response()->json(["status" => true, 'group' => $group]);
    }

    /**
     * Display the specified resource.
     *
     * @param  string $name
     * @return \Illuminate\Http\Response
     */
    public function show($name)
    {
        $group = Group::where('url_name', $name)->first();

        if ($group) {
            if (!$group->is_open && !GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()) {
                //return null;
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($result);
            }
            NewGroup::where(['user_id' => Auth::id(), 'group_id' => $group->id,])->delete();
            $group->count_chat_message = UserRoomsMessage::where('room_id',$group->room_id)->count();
            $group->count_users = $group->users()->count();
            $group->count_publications = $group->publications()->count();
            $group->count_chat_files = $group->count_chat_files($group->room_id);
            $group->users = User::join('group_users','group_users.user_id','=','users.id')->select('users.id', 'users.first_name', 'users.last_name', 'users.avatar_path', 'users.user_quote', 'users.login', 'group_users.is_admin')
            ->where('group_users.group_id',$group->id)->get();

            foreach ($group->users as $user) {
                $user->is_online = Online::isOnline($user->id);
            }

            if (GroupUser::where(['group_id' =>$group->id,'user_id' => Auth::id()])->first()){
                $group->is_sub = true;
            } else {$group->is_sub = false;}
            if(GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()){
                $group->is_admin = true;
            } else {$group->is_admin = false;}
            if(GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id(), 'is_admin' => true, 'is_creator' => true])->first()){
                $group->is_creator = true;
            } else {$group->is_creator = false;}
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
        return $group;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $this->validate($request, [
                'name' => 'unique:groups',
                'description' => 'required',
                'is_open' => 'required|boolean',
                'avatar' => 'image',
                'card_avatar' => 'image',
                'original_avatar' => 'image',
                'scopes' => 'required|array|max:3'
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
        if (!$groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $id, 'is_admin' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        $groupData = $request->all();
        if($request->input('name')){
            $groupData['url_name'] = $this->transliterate($request->input('name'));
        }
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarGroupPath($avatar);
            $groupData['avatar'] = $path;
        }

        if ($request->hasFile('original_avatar')) {
            $avatar = $request->file('original_avatar');
            $path = Image::getOriginalAvatarGroupPath($avatar);
            $groupData['original_avatar'] = $path;
        }

        if ($request->hasFile('card_avatar')) {
            $card_avatar = $request->file('card_avatar');
            $path = Image::getCardGroupPath($card_avatar);
            $groupData['card_avatar'] = $path;
        }
        $group = Group::find($id);
        ScopeGroup::where('publication_id',$group->id)->delete();
        $scopes = $request->input('scopes');
        $group->scopes()->attach($scopes);
        $group->update($groupData);
        return response()->json(["status" => true, "groupData" => $groupData]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!$groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $id, 'is_admin' => true, 'is_creator' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        if ($group = Group::find($id)) {
            $group->delete();
        }
        return response()->json(["status" => true]);
    }

    public function subscription($id)
    {
        if ($group = Group::find($id)) {
            if ($user = GroupUser::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()) {
                    $isSub = false;
                $user->delete();
            } else {
                $isSub = true;
                if($group->is_open){
                    GroupUser::create(['group_id' => $group->id, 'user_id' => Auth::id()]);
                }elseif ($invite = GroupInvite::where(['group_id' => $group->id, 'user_id' => Auth::id()])->first()){
                    $invite->delete();
                    GroupUser::create(['group_id' => $group->id, 'user_id' => Auth::id()]);
                }else{
                    $result = [
                        "status" => false,
                        "error" => [
                            'message' => "Permission denied",
                            'code' => '8'
                        ]
                    ];
                    return response()->json($result);
                }
            }
            return response()->json(['status' => true, 'is_sub' => $isSub]);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function invite(Request $request, $groupId){
        try {
            $this->validate($request, [
                'user_id' => 'array'
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

        if ($group = Group::find($groupId)) {
            if (!$groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            foreach($request->input('user_id') as $userId) {
//                if ($invite = GroupInvite::where(['group_id' => $group->id, 'user_id' => $userId])->first()) {
//                    $invite->delete();
//                } else {
//                    GroupInvite::create(['group_id' => $group->id, 'inviter_user_id' => Auth::id(), 'user_id' => $userId]);
//                }
                if (!GroupUser::where(['user_id' => $userId, 'group_id' => $groupId,])->first()){
                    NewGroup::create(['user_id' => $userId, 'group_id' => $groupId,]);
                    GroupUser::create(['user_id' => $userId, 'group_id' => $groupId,]);
                }
            }
            return response()->json(['status' => true]);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function admin_subscription_delete(Request $request, $groupId){
        try {
            $this->validate($request, [
                'user_id' => 'array'
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

        if ($group = Group::find($groupId)) {
            if ($groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true, 'is_creator' => true])->first()) {
                foreach($request->input('user_id') as $userId) {
                    if ($invite = GroupUser::where(['group_id' => $group->id, 'user_id' => $userId])->first()) {
                        $invite->delete();
                    }
                }
                return response()->json(['status' => true]);
            } elseif (!$groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            foreach($request->input('user_id') as $userId) {
                if ($invite = GroupUser::where(['group_id' => $group->id, 'user_id' => $userId, 'is_admin' => false])->first()) {
                    $invite->delete();
                }
            }
            return response()->json(['status' => true]);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function setUserAdmin($groupId,$userId){
        if ($group = Group::find($groupId)) {
            if (!$groupUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            if ($user = GroupUser::where(['group_id' => $group->id, 'user_id' => $userId])->first()){
                $user->is_admin = !$user->is_admin;
                $user->save();
                return response()->json(['status'=>true,'is_admin'=>$user->is_admin]);
            }else{
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect user id",
                        'code' => '6'
                    ]
                ];
                return response()->json($result);
            }
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Incorrect group id",
                    'code' => '6'
                ]
            ];
            return response()->json($result);
        }
    }

    public function setUserCreator($groupId,$userId)
    {
        if ($group = Group::find($groupId)) {
            if (!$creatorUser = GroupUser::where(['user_id' => Auth::id(), 'group_id' => $groupId, 'is_admin' => true, 'is_creator' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            if ($user = GroupUser::where(['group_id' => $group->id, 'user_id' => $userId, 'is_admin' => true])->first()) {
                $user->is_creator = !$user->is_creator;
                $creatorUser->delete();
                $user->save();
                return response()->json(['status' => true, 'is_creator' => $user->is_creator]);
            } else {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect group id",
                        'code' => '6'
                    ]
                ];
                return response()->json($result);
            }
        }
    }

    public function counter_new_group ()
    {
        return NewGroup::where(['user_id' => Auth::id()])->count();
    }

    public function getGroupScopes($id)
    {
        $group = Group::find($id);
        $scopes_groups = $group->scopes()->pluck('scopes.id');
        $scopes = Scope::all();
        $all = false;
        foreach ($scopes_groups as $scopes_group){
            if ($scopes_group == 1){
                $all = true;
            }
        }
        if ($all == true) {
            $data_scope = [];
            foreach ($scopes as $scope) {
                $scope['signed'] = true;
                $data_scope[] = $scope;
            }
            return $data_scope;
        } else {
            $data_scope = [];
            foreach ($scopes as $scope) {
                foreach ($scopes_groups as $scopes_group) {
                    if ($scope['id'] == $scopes_group) {
                        $scope['signed'] = true;
                    }
                }
                $data_scope[] = $scope;
            }
            return $data_scope;
        }
    }

    function transliterate($input)
    {
        $translite = array(
            "Є" => "ye", "І" => "i", "Ѓ" => "g", "і" => "i", "№" => "-", "є" => "ye", "ѓ" => "g",
            "А" => "a", "Б" => "b", "В" => "v", "Г" => "g", "Д" => "d",
            "Е" => "e", "Ё" => "yo", "Ж" => "zh",
            "З" => "z", "И" => "i", "Й" => "j", "К" => "k", "Л" => "l",
            "М" => "m", "Н" => "n", "О" => "o", "П" => "p", "Р" => "r",
            "С" => "s", "Т" => "t", "У" => "u", "Ф" => "f", "Х" => "x",
            "Ц" => "c", "Ч" => "ch", "Ш" => "sh", "Щ" => "shh", "Ъ" => "'",
            "Ы" => "y", "Ь" => "", "Э" => "e", "Ю" => "yu", "Я" => "ya",
            "а" => "a", "б" => "b", "в" => "v", "г" => "g", "д" => "d",
            "е" => "e", "ё" => "yo", "ж" => "zh",
            "з" => "z", "и" => "i", "й" => "j", "к" => "k", "л" => "l",
            "м" => "m", "н" => "n", "о" => "o", "п" => "p", "р" => "r",
            "с" => "s", "т" => "t", "у" => "u", "ф" => "f", "х" => "x",
            "ц" => "c", "ч" => "ch", "ш" => "sh", "щ" => "shh", "ъ" => "",
            "ы" => "y", "ь" => "", "э" => "e", "ю" => "yu", "я" => "ya",
            " " => "_", "—" => "_", "," => "_", "!" => "_", "@" => "_",
            "#" => "-", "$" => "", "%" => "", "^" => "", "&" => "", "*" => "",
            "(" => "", ")" => "", "+" => "", "=" => "", ";" => "", ":" => "",
            "'" => "", "\"" => "", "~" => "", "`" => "", "?" => "", "/" => "",
            "\\" => "", "[" => "", "]" => "", "{" => "", "}" => "", "|" => ""
        );

        return strtr($input, $translite);
    }
}
