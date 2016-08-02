<?php

namespace App\Http\Controllers\Admin;

use App\Country;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CountryController extends Controller
{
    public function create(Request $request)
    {
        if (Country::where('name',$request->input('name'))->first()){
            return view('admin.country.create',['error'=>'Такая страна уже есть']);
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
