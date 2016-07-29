<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TypePlace;
use App\Image;
use App\Http\Requests;

class TypePlaceController extends Controller
{
    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required|unique:type_places',
                'description' => 'required',
                'avatar' => 'required|image',
                'is_dynamic' => 'boolean'
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

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar');
            $path = Image::getAvatarPath($avatar);
            $placeData['avatar'] = $path;
        }

        $type_place = TypePlace::create($placeData);

        return response()->json(["status" => true, 'type_place' => $type_place]);
    }

    public function getStatic($is_dynamic = false)
    {
        $static_type_place = TypePlace::where('is_dynamic',$is_dynamic)->get();
        return $static_type_place;
    }

    public function getDynamic($is_dynamic = true)
    {
        $dynamic_type_place = TypePlace::where('is_dynamic',$is_dynamic)->get();
        return $dynamic_type_place;
    }
}
