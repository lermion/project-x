<?php

namespace App\Http\Controllers;

use App\Country;
use App\StaticPage;
use Illuminate\Http\Request;

use App\Http\Requests;

class StaticPageController extends Controller
{
    public function show($name){
        return StaticPage::where('name',$name)->first();
    }
}
