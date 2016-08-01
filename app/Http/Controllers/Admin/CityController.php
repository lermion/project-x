<?php

namespace App\Http\Controllers\Admin;

use App\City;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CityController extends Controller
{
    public function create(Request $request)
    {
        if (City::where(['country_id'=>$request->input('country_id'), 'name'=>$request->input('name')])->first()){
            return view('admin.country.create',['error'=>'Этот грорд уже есть']);
        }
        $data = $request->all();
        City::create($data);
        $result = [
            "status" => true];
        return response()->json($result);

    }

    public function destroy($id)
    {
        City::where('id',$id)->delete();
        $result = [
            "status" => true];
        return response()->json($result);
    }
}
