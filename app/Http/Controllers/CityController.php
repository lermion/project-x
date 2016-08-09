<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\City;
use App\Http\Requests;

class CityController extends Controller
{
    public function index($country_id)
    {
        $cities = City::where('country_id', $country_id)->orderBy('name', 'asc')->get();
        return $cities;
    }
}
