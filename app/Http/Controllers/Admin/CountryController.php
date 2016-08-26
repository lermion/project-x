<?php

namespace App\Http\Controllers\Admin;

use App\Area;
use App\City;
use App\Country;
use App\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $country->name = $request->input('name');
        $country->code = $request->input('code');
        $country->save();
        //$country->update('name',$request->input('name'));
        return redirect('/admin/base/')->with('message', 'Странна изменинна');
    }

    public function createRegion(Request $request)
    {
        if (Region::where(['name'=>$request->input('name'),'country_id'=>$request->input('country_id')])->first()){
            return redirect('/admin/base/region')->with('message', 'Ошибка!!! Такая область уже есть в базе');
        }
        $data = $request->all();
        Region::create($data);
        return redirect('/admin/base/region')->with('message', 'Область добавленна');

    }

    public function editRegion($id)
    {
        $countries = Country::get();
        $region = Region::find($id);
        return view('admin.base.regionEdit',['region'=>$region,'countries'=>$countries]);
    }

    public function editRegionSave(Request $request)
    {
        $region = Region::find($request->input('id'));
        $region->name = $request->input('name');
        $region->country_id = $request->input('country_id');
        $region->save();
        return redirect('/admin/base/region')->with('message', 'Область изменинна');
    }

    public function createDistrict(Request $request)
    {
        if (Area::where(['name'=>$request->input('name'),'region_id'=>$request->input('region_id')])->first()){
            return redirect('/admin/base/district')->with('message', 'Ошибка!!! Такая область уже есть в базе');
        }
        $data = $request->all();
        Area::create($data);
        return redirect('/admin/base/district')->with('message', 'Район добавленн');
    }

    public function editDistrict($id)
    {
        $countries = Country::get();
        $regions = Region::get();
        $district = Area::find($id);
        return view('admin.base.districtEdit',['district'=>$district,'region'=>$regions,'countries'=>$countries]);
    }

    public function editDistrictSave(Request $request)
    {
        $district = Area::find($request->input('id'));
        $district->name = $request->input('name');
        $district->region_id = $request->input('region_id');
        $district->save();
        return redirect('/admin/base/region')->with('message', 'Район измененн');
    }

    public function createSettlement(Request $request)
    {
        if (City::where(['name'=>$request->input('name'),'area_id'=>$request->input('area_id')])->first()){
            return redirect('/admin/base/settlement')->with('message', 'Ошибка!!! Такой населенный пункт уже есть в базе');
        }
        $data = $request->all();
        City::create($data);
        return redirect('/admin/base/settlement')->with('message', 'Населенный пункт добавленн');
    }

    public function getRegion($id)
    {
        $countries = Country::all();
        $regions = Region::where('country_id',$id)->get();
        return view('admin.base.regions', ['regions' => $regions, 'countries' => $countries]);
    }

    public function getArea(Request $request)
    {
        $query = DB::table('areas');
        if ($request->has('country_id')) {
            $query->where('country_id', $request->input('country_id'));
        }
        if ($request->has('region_id')) {
            $query->where('region_id', $request->input('region_id'));
        }
        $areas = $query->get();
        return response()->json($areas);
    }

    public function getCity(Request $request)
    {
        $query = DB::table('cities');
        if ($request->has('country_id')) {
            $query->where('country_id', $request->input('country_id'));
        }
        if ($request->has('region_id')) {
            $query->where('region_id', $request->input('region_id'));
        }
        if ($request->has('area_id')) {
            $query->where('area_id', $request->input('area_id'));
        }
        $cities = $query->get();
        return response()->json($cities);
    }
}
