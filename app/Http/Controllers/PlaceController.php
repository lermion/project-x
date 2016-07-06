<?php

namespace App\Http\Controllers;

use App\Place;
use App\PlaceUser;
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
                //'address' =>
                //'coordinates_x'=> 'numeric',
                //'coordinates_y'=> 'numeric',
                'expired_days' => 'integer',
                'avatar' => 'image'
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
        $placeData['url_name'] = $this->transliterate($request->input('name'));
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $placeData['avatar'] = $path;
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
