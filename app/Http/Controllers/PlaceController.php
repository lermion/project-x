<?php

namespace App\Http\Controllers;

use App\Place;
use Illuminate\Http\Request;

use App\Http\Requests;

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
                'coordinates_x'=> 'numeric',
                'coordinates_y'=> 'numeric',
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
        $placeData['url_name'] = $this->transliterate($request->input('name')); //????????
        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $placeData['avatar'] = $path;
        }
        $group = Place::create($placeData);
        GroupUser::create(['user_id' => Auth::id(), 'group_id' => $group->id, 'is_admin' => true]);
        return response()->json(["status" => true, 'group' => $group]);
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
