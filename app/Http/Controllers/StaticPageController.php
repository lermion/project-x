<?php

namespace App\Http\Controllers;

use App\Country;
use App\Option;
use App\StaticPage;
use Illuminate\Http\Request;

use App\Http\Requests;

class StaticPageController extends Controller
{
    public function show($name){
        return StaticPage::where('name',$name)->first();
    }

    public function getNames(){
        $static_page['static_page'] = StaticPage::select('name','id','description')->get();
        $static_page['copyright'] = Option::select('copyright')->get();
        return $static_page;
    }
}
