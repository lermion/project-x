<?php

namespace App\Http\Controllers;

use App\Place;
use App\TypePlace;
use App\PlaceUser;
use App\PlaceInvite;
use App\Image;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class PlaceController extends Controller
{
    public function index()
    {
        //
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
                    'expired_date' => 'required'
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
        PlaceUser::create(['user_id' => Auth::id(), 'place_id' => $place->id, 'is_admin' => true]);
        return response()->json(["status" => true, 'place' => $place]);
    }





    public function show($name)
    {
        $place = Place::where('url_name', $name)->first();
       /* if ($place) {
            if (!PlaceUser::where(['place_id' => $place->id, 'user_id' => Auth::id()])->first()) {
                //return null;
            }
            $place->count_users = $place->users()->count();
            $place->count_publications = $place->publications()->count();
        }*/
        return $place;
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
                if ($invite = PlaceInvite::where(['place_id' => $place->id, 'user_id' => $userId])->first()) {
                    $invite->delete();
                } else {
                    PlaceInvite::create(['place_id' => $place->id, 'inviter_user_id' => Auth::id(), 'user_id' => $userId]);
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
