<?php

namespace App\Http\Controllers\Admin;

use App\Country;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
    public function index()
    {
        return view('admin.base.country');
    }

    public function district()
    {
        return view('admin.base.district');
    }


    public function region()
    {
        return view('admin.base.region');
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
