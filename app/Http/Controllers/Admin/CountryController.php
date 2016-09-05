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
        if (Country::where('name',$request->input('name'))->first()){
            return redirect('/admin/base/')->with('message', 'Ошибка!!! Такая странна уже есть в базе');
        }
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

    public function editRegion($id,$country_id)
    {
        $countries = Country::get();
        $region = Region::find($id);
        return view('admin.base.regionEdit',['region'=>$region,'countries'=>$countries,'country_id'=>$country_id]);
    }

    public function editRegionSave(Request $request)
    {
        if (Region::where(['name'=>$request->input('name'),'country_id'=>$request->input('country_id')])->first()){
            return redirect('/admin/base/region')->with('message', 'Ошибка!!! Такая область уже есть в базе');
        }
        $region = Region::find($request->input('id'));
        $region->country_id = $request->input('country_id');
        $region->name = $request->input('name');
        $region->save();
        return redirect('/admin/base/region')->with('message', 'Область изменинна');
    }

    public function createDistrict(Request $request)
    {
        if (Area::where(['name'=>$request->input('name'),'region_id'=>$request->input('region_id')])->first()){
            return redirect('/admin/base/district')->with('message', 'Ошибка!!! Такой район уже есть в базе');
        }
        $data = $request->all();
        Area::create($data);
        return redirect('/admin/base/district')->with('message', 'Район добавлен');
    }

    public function editDistrict($id)
    {
        $countries = Country::get();
        $regions = Region::get();
        $district = Area::find($id);
        return view('admin.base.districtEdit',['district'=>$district,'regions'=>$regions,'countries'=>$countries]);
    }

    public function editDistrictSave(Request $request)
    {
        if (Area::where(['name'=>$request->input('name'),'region_id'=>$request->input('region_id')])->first()){
            return redirect('/admin/base/district')->with('message', 'Ошибка!!! Такой район уже есть в базе');
        }
        $district = Area::find($request->input('id'));
        $district->name = $request->input('name');
        $district->region_id = $request->input('region_id');
        $district->save();
        return redirect('/admin/base/district')->with('message', 'Район изменен');
    }

    public function createSettlement(Request $request)
    {
        if (City::where(['name'=>$request->input('name'),'area_id'=>$request->input('area_id')])->orWhere(['name'=>$request->input('name'),'country_id'=>$request->input('country_id')])->orWhere(['name'=>$request->input('name'),'region_id'=>$request->input('region_id')])->first()){
            return redirect('/admin/base/settlement')->with('message', 'Ошибка!!! Такой населенный пункт уже есть в базе');
        }
        $data = $request->all();
        City::create($data);
        return redirect('/admin/base/settlement')->with('message', 'Населенный пункт добавлен');
    }

    public function editSettlement($id)
    {
        $countries = Country::get();
        $regions = Region::get();
        $areas = Area::get();
        $cities = City::find($id);
        return view('admin.base.settlementEdit',['areas'=>$areas,'regions'=>$regions,'countries'=>$countries,'cities'=>$cities]);
    }

    public function editSettlementSave(Request $request)
    {
        if (City::where(['name'=>$request->input('name'),'area_id'=>$request->input('area_id')])->orWhere(['name'=>$request->input('name'),'country_id'=>$request->input('country_id')])->orWhere(['name'=>$request->input('name'),'region_id'=>$request->input('region_id')])->first()){
            return redirect('/admin/base/settlement')->with('message', 'Ошибка!!! Такой населенный пункт уже есть в базе');
        }
        $settlement = City::find($request->input('id'));
        $settlement->name = $request->input('name');
        $settlement->country_id = $request->input('country_id');
        $settlement->area_id = $request->input('area_id');
        $settlement->region_id = $request->input('region_id');
        $settlement->save();
        return redirect('/admin/base/settlement')->with('message', 'Населенный пункт изменен');
    }

    public function getRegion($id)
    {
        $regions = Region::where('country_id',$id)->get();
        return response()->json($regions);
    }

    public function getArea($id)
    {
        $areas = Area::where('region_id',$id)->get();
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
