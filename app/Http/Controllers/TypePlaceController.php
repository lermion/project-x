<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TypePlace;
use App\Http\Requests;

class TypePlaceController extends Controller
{
//   try {
//   $this->validate($request, ['name' => 'required|unique:type_places',]);
//   } catch (\Exception $ex) {
//    $result = [
//        "status" => false,
//        "error" => [
//            'message' => $ex->validator->errors(),
//            'code' => '1'
//        ]
//    ];
//    return response()->json($result);
//    }


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
