<?php

namespace App\Http\Controllers;

use App\Group;
use App\GroupInvite;
use App\GroupUser;
use App\Image;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Group::with(['users'])->where('is_open', true)->get();
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
                'avatar' => 'file'
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
        $publicationData = $request->all();
        $publicationData['url_name'] = $this->transliterate($request->input('name'));
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $publicationData['avatar'] = $path;
        }
        $group = Group::create($publicationData);
        GroupUser::create(['user_id' => Auth::id(), 'group_id' => $group->id, 'is_admin' => true]);
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
                return null;
            }
            $group->count_users = $group->users()->count();
            $group->count_publications = 0;
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
                'name' => 'required|unique:groups',
                'description' => 'required',
                'is_open' => 'required|boolean',
                'avatar' => 'file'
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
        $groupData['url_name'] = $this->transliterate($request->input('name'));
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $groupData['avatar'] = $path;
        }
        $group = Group::find($id);
        $group->update($groupData);
        return response()->json(["status" => true]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
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

    public function invite($groupId,$userId){
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
            if ($invite = GroupInvite::where(['group_id' => $group->id, 'user_id' => $userId])->first()){
                $isInvited = false;
                $invite->delete();
            }else{
                $isInvited = true;
                GroupInvite::create(['group_id' => $group->id,'inviter_user_id'=> Auth::id(), 'user_id' => $userId]);
            }
            return response()->json(['status' => true, 'is_invited' => $isInvited]);
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