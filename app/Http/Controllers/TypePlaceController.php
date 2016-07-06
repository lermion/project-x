<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\TypePlace;
use App\Http\Requests;

class TypePlaceController extends Controller
{
    public function index(){
        return TypePlace::select('name', 'description', 'avatar')->get();
    }
}
