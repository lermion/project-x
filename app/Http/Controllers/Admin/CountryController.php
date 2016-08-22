<?php

namespace App\Http\Controllers\Admin;

use App\Area;
use App\City;
use App\Country;
use App\Region;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
    public function index()
    {
        $countries = Country::paginate(25);
        return view('admin.base.country')->with('countries',$countries);
    }

    public function district()
    {
        $countries = Country::get();
        $regions = Region::get();
        $areas = Area::paginate(25);
        return view('admin.base.district',['areas'=>$areas,'regions'=>$regions,'countries'=>$countries]);
    }


    public function region()
    {
        $countries = Country::get();
        $regions = Region::paginate(25);
        return view('admin.base.region',['regions'=>$regions,'countries'=>$countries]);
    }


    public function settlement()
    {
        $countries = Country::get();
        $regions = Region::get();
        $areas = Area::get();
        $cities = City::paginate(25);
        return view('admin.base.settlement',['cities'=>$cities,'areas'=>$areas,'regions'=>$regions,'countries'=>$countries]);
    }


    public function createCountry(Request $request)
    {
        if (Country::where('name',$request->input('name'))->first()){
            return redirect('/admin/base/')->with('message', 'Ошибка!!! Такая странна уже есть в базе');
        }
        $data = $request->all();
        Country::create($data);
        return redirect('/admin/base/')->with('message', 'Странна добавленна');

    }

    public function editCountry($id)
    {
        $country = Country::find($id);
        return view('admin.base.countryEdit')->with('country',$country);
    }

    public function editCountrySave(Request $request)
    {
        $country = Country::find($request->input('id'));
        $countryData = $request->all();
        $country->update($countryData);
        return redirect('/admin/base/')->with('message', 'Странна изменинна');
    }
}
