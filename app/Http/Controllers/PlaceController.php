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
            "ª" => "ye", "²" => "i", "" => "g", "³" => "i", "¹" => "-", "º" => "ye", "ƒ" => "g",
            "À" => "a", "Á" => "b", "Â" => "v", "Ã" => "g", "Ä" => "d",
            "Å" => "e", "¨" => "yo", "Æ" => "zh",
            "Ç" => "z", "È" => "i", "É" => "j", "Ê" => "k", "Ë" => "l",
            "Ì" => "m", "Í" => "n", "Î" => "o", "Ï" => "p", "Ğ" => "r",
            "Ñ" => "s", "Ò" => "t", "Ó" => "u", "Ô" => "f", "Õ" => "x",
            "Ö" => "c", "×" => "ch", "Ø" => "sh", "Ù" => "shh", "Ú" => "'",
            "Û" => "y", "Ü" => "", "İ" => "e", "Ş" => "yu", "ß" => "ya",
            "à" => "a", "á" => "b", "â" => "v", "ã" => "g", "ä" => "d",
            "å" => "e", "¸" => "yo", "æ" => "zh",
            "ç" => "z", "è" => "i", "é" => "j", "ê" => "k", "ë" => "l",
            "ì" => "m", "í" => "n", "î" => "o", "ï" => "p", "ğ" => "r",
            "ñ" => "s", "ò" => "t", "ó" => "u", "ô" => "f", "õ" => "x",
            "ö" => "c", "÷" => "ch", "ø" => "sh", "ù" => "shh", "ú" => "",
            "û" => "y", "ü" => "", "ı" => "e", "ş" => "yu", "ÿ" => "ya",
            " " => "_", "—" => "_", "," => "_", "!" => "_", "@" => "_",
            "#" => "-", "$" => "", "%" => "", "^" => "", "&" => "", "*" => "",
            "(" => "", ")" => "", "+" => "", "=" => "", ";" => "", ":" => "",
            "'" => "", "\"" => "", "~" => "", "`" => "", "?" => "", "/" => "",
            "\\" => "", "[" => "", "]" => "", "{" => "", "}" => "", "|" => ""
        );

        return strtr($input, $translite);
    }
}
