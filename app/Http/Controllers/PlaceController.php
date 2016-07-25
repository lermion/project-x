<?php

namespace App\Http\Controllers;

use App\Place;
use App\NewPlace;
use App\TypePlace;
use App\PlaceUser;
use App\PlaceInvite;
use App\Image;
use App\City;
use App\Country;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class PlaceController extends Controller
{
    public function index()
    {
        $places = Place::all();
        foreach($places as &$place){
            $place->count_user = $place->users()->count();
            $place->publications = $place->publications()->count();
            if (PlaceUser::where(['place_id' =>$place->id,'user_id' => Auth::id()])->first()){
                $place->is_sub = true;
            } else {$place->is_sub = false;}
            if(PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()){
                $place->is_admin = true;
            } else {$place->is_admin = false;}
            if(NewPlace::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()){
                $place->is_new_place = true;
            } else {$place->is_new_place = false;}
            $place->city_name = City::where(['id' => $place->city_id])->pluck('name');

        }
        return $places;
    }

    public function adminPlace()
    {
        return Place::join('place_users','place_users.place_id','=','places.id')->where(['place_users.user_id'=>Auth::id(),'is_admin'=>true])->get();
    }

    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required|unique:places',
                'description' => 'required',
                'city_id' =>'required',
                'address' => 'required',
                'coordinates_x'=> 'required|numeric',
                'coordinates_y'=> 'required|numeric',
                'avatar' => 'image',
                'cover' => 'image',
                'type_place_id' => 'required'
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

        $placeData = $request->all();

        if (TypePlace::where('id', $placeData['type_place_id'])->value('is_dynamic')) {
            try {
                $this->validate($request, [
                    'expired_days' => 'required'
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
        }


        $placeData['url_name'] = $this->transliterate($request->input('name'));
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $placeData['avatar'] = $path;
        }
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');
            $path = Image::getCoverPath($cover);
            $placeData['cover'] = $path;
        }
        $place = Place::create($placeData);
        PlaceUser::create(['user_id' => Auth::id(), 'place_id' => $place->id, 'is_admin' => true, 'is_creator' => true]);
        return response()->json(["status" => true, 'place' => $place]);
    }

    public function show($name)
    {
        $place = Place::where('url_name', $name)->first();
        NewPlace::where(['user_id' => Auth::id(), 'place_id' => $place->id,])->delete();
        if ($place) {
            if (!PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                return null;
            }
            $place->count_users = $place->users()->count();
            $place->count_publications = $place->publications()->count();
            $place->users = User::join('place_users','place_users.user_id','=','users.id')->select('users.id', 'users.first_name', 'users.last_name', 'users.avatar_path', 'users.status', 'place_users.is_admin')
                ->where('place_users.place_id',$place->id)->get();
            if (PlaceUser::where(['place_id' =>$place->id,'user_id' => Auth::id()])->first()){
                $place->is_sub = true;
            } else {$place->is_sub = false;}
            if(PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true])->first()){
                $place->is_admin = true;
            } else {$place->is_admin = false;}
            if(PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id(), 'is_admin' => true, 'is_creator' => true])->first()){
                $place->is_creator = true;
            } else {$place->is_creator = false;}
            if(TypePlace::where(['id' => $place->type_place_id, 'is_dynamic' => true])->first()){
                $place->is_dynamic = true;
            } else {$place->is_dynamic = false;}

            $place->type_place = TypePlace::where(['id' => $place->type_place_id])->first();

            $city = City::where(['id' => $place->city_id])->first();
            $place->country = Country::where(['id' => $city->country_id])->first();
            $place->cities = City::where(['country_id' => $city->country_id])->get();
        }
        return $place;
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
                'name' => 'unique:places',
                'description' => 'required',
                'city_id' =>'required',
                'address' => 'required',
                'coordinates_x'=> 'required|numeric',
                'coordinates_y'=> 'required|numeric',
                'avatar' => 'image',
                'cover' => 'image',
                'type_place_id' => 'required'
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
        if (!PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $id, 'is_admin' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        $placeData = $request->all();
        if ($request->input('name')){
            $placeData['url_name'] = $this->transliterate($request->input('name'));
        }
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $placeData['avatar'] = $path;
        }
        if ($request->hasFile('cover')) {
            $cover = $request->file('cover');
            $path = Image::getAvatarPath($cover);
            $placeData['cover'] = $path;
        }
        $place = Place::find($id);
        $place->update($placeData);
        return response()->json(["status" => true, "placeData" => $placeData]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        if (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $id, 'is_admin' => true, 'is_creator' => true])->first()) {
            $responseData = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($responseData);
        }
        if ($place = Place::find($id)) {
            $place->delete();
        }
        return response()->json(["status" => true]);
    }

    public function subscription($id)
    {
        if ($place = Place::find($id)) {
            if ($user = PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                $isSub = false;
                $user->delete();
            } else {
                $isSub = true;
                if($place->is_open){
                    PlaceUser::create(['place_id' => $place->id, 'user_id' => Auth::id()]);
                }elseif ($invite = PlaceInvite::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()){
                    $invite->delete();
                    PlaceUser::create(['place_id' => $place->id, 'user_id' => Auth::id()]);
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

    public function setUserAdmin($placeId, $userId){
        if ($place = Place::find($placeId)) {
            if (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            if ($user = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId])->first()){
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

    public function invite(Request $request, $placeId){
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
        if ($place = Place::find($placeId)) {
            if (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true])->first()) {
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
//                if ($invite = PlaceInvite::where(['place_id' => $place->id, 'user_id' => $userId])->first()) {
//                    $invite->delete();
//                } else {
//                    PlaceInvite::create(['place_id' => $place->id, 'inviter_user_id' => Auth::id(), 'user_id' => $userId]);
//                }
                if (!PlaceUser::where(['user_id' => $userId, 'place_id' => $placeId,])->first()){
                    NewPlace::create(['user_id' => $userId, 'place_id' => $placeId,]);
                    PlaceUser::create(['user_id' => $userId, 'place_id' => $placeId,]);
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

    public function admin_subscription_delete(Request $request, $placeId){
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

        if ($place = Place::find($placeId)) {
            if ($placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true, 'is_creator' => true])->first()) {
                foreach($request->input('user_id') as $userId) {
                    if ($invite = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId])->first()) {
                        $invite->delete();
                    }
                }
                return response()->json(['status' => true]);
            } elseif (!$placeUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true])->first()) {
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
                if ($invite = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId, 'is_admin' => false])->first()) {
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

    public function setUserCreator($placeId,$userId)
    {
        if ($place = Place::find($placeId)) {
            if (!$creatorUser = PlaceUser::where(['user_id' => Auth::id(), 'place_id' => $placeId, 'is_admin' => true, 'is_creator' => true])->first()) {
                $responseData = [
                    "status" => false,
                    "error" => [
                        'message' => "Permission denied",
                        'code' => '8'
                    ]
                ];
                return response()->json($responseData);
            }
            if ($user = PlaceUser::where(['place_id' => $place->id, 'user_id' => $userId, 'is_admin' => true])->first()) {
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

    public function counter_new_place ()
    {
        return NewPlace::where(['user_id' => Auth::id()])->count();
    }

    function transliterate($input)
    {
        $translite = array(
            "�" => "ye", "�" => "i", "�" => "g", "�" => "i", "�" => "-", "�" => "ye", "�" => "g",
            "�" => "a", "�" => "b", "�" => "v", "�" => "g", "�" => "d",
            "�" => "e", "�" => "yo", "�" => "zh",
            "�" => "z", "�" => "i", "�" => "j", "�" => "k", "�" => "l",
            "�" => "m", "�" => "n", "�" => "o", "�" => "p", "�" => "r",
            "�" => "s", "�" => "t", "�" => "u", "�" => "f", "�" => "x",
            "�" => "c", "�" => "ch", "�" => "sh", "�" => "shh", "�" => "'",
            "�" => "y", "�" => "", "�" => "e", "�" => "yu", "�" => "ya",
            "�" => "a", "�" => "b", "�" => "v", "�" => "g", "�" => "d",
            "�" => "e", "�" => "yo", "�" => "zh",
            "�" => "z", "�" => "i", "�" => "j", "�" => "k", "�" => "l",
            "�" => "m", "�" => "n", "�" => "o", "�" => "p", "�" => "r",
            "�" => "s", "�" => "t", "�" => "u", "�" => "f", "�" => "x",
            "�" => "c", "�" => "ch", "�" => "sh", "�" => "shh", "�" => "",
            "�" => "y", "�" => "", "�" => "e", "�" => "yu", "�" => "ya",
            " " => "_", "�" => "_", "," => "_", "!" => "_", "@" => "_",
            "#" => "-", "$" => "", "%" => "", "^" => "", "&" => "", "*" => "",
            "(" => "", ")" => "", "+" => "", "=" => "", ";" => "", ":" => "",
            "'" => "", "\"" => "", "~" => "", "`" => "", "?" => "", "/" => "",
            "\\" => "", "[" => "", "]" => "", "{" => "", "}" => "", "|" => ""
        );

        return strtr($input, $translite);
    }
}
