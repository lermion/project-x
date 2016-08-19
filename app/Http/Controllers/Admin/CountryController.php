<?php

namespace App\Http\Controllers\Admin;

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
        return view('admin.base.district');
    }


    public function region()
    {
        $countries = Country::get();
        $regions = Region::paginate(25);
        return view('admin.base.region')->with('regions',$regions);
    }


    public function settlement()
    {
        return view('admin.base.settlement');
    }


    public function create(Request $request)
    {
        if (Country::where('name',$request->input('name'))->first()){
            return view('admin.country.create',['error'=>'����� ������ ��� ����']);
        }
        $data = $request->all();
        Country::create($data);
        $result = [
            "status" => true];
        return response()->json($result);

    }

    public function destroy($id)
    {
        Country::where('id',$id)->delete();
        $result = [
            "status" => true];
        return response()->json($result);
    }
}
