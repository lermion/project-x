<?php

namespace App\Http\Controllers\Admin;

use App\Scope;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ScopeController extends Controller
{
    public function index()
    {
        $scope = Scope::paginate(25);
        return view('admin.option.index')->with('scope', $scope);
    }

    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                'name' => 'required|unique:scopes',
                'img' => 'required|file',
                'order' => 'required|numeric'
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }
        $data = $request->all();
        $img = $request->file('img');
        $path = '/upload/scope/';
        $fileName = str_random(8) . $img->getClientOriginalName();
        $fullPath = public_path() . $path;
        $img->move($fullPath, $fileName);
        $data['img'] = $path.$fileName;
        Scope::create($data);
        $result = ["status" => true];
        return response()->json($result);
    }

    public function update($id)
    {
        $moderators = Moderator::find($id);
        $moderators['working_hours'] = WorkingHoursModerator::where('moderator_id',$id)->get();
        return view('admin.moderator.update')->with('moderators', $moderators);
    }

    public function destroy($id)
    {
        Moderator::find($id)->delete();
        WorkingHoursModerator::where('moderator_id',$id)->delete();
        return redirect('/admin/moderator/')->with('message', 'Модератор удаленн');
    }
}

