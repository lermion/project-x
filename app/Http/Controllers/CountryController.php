<?php

namespace App\Http\Controllers;

use App\Country;
use Illuminate\Http\Request;

use App\Http\Requests;

class CountryController extends Controller
{
    /**
     * Display a countries.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $countries = Country::all();
        return $countries;
    }
}
