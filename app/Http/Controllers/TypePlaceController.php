<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TypePlace;
use App\Http\Requests;

class TypePlaceController extends Controller
{
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
