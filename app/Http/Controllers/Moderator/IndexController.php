<?php

namespace App\Http\Controllers\Moderator;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class IndexController extends Controller
{
    public function index(){
        return view('moderator.index');
    }
    
    public function edit(Request $request){
        $moderator = $request->session()->get('moderator');
        return view('moderator.edit',['moderator'=>$moderator]);
    }

    public function update(Request $request){
        $moderator = $request->session()->get('moderator');
        $data = $request->all();
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        if ($request->hasFile('photo')) {
            $avatar = $request->file('photo');
            $path = $this->getAvatarPath($avatar);
            $data['photo'] = $path;
        }
        $moderator->update($data);
        return redirect()->action('Moderator\IndexController@edit');
    }

    private function getAvatarPath($avatar)
    {
        $path = '/upload/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }
}
