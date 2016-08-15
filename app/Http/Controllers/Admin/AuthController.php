<?php

namespace App\Http\Controllers\Admin;

use App\Moderator;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{
    public function login(){
        return view('admin.auth');
    }
    public function auth(Request $request){
        $email = $request->input('email');
        $password = $request->input('password');
        if($moderator = Moderator::where('email',"=", $email)->first())
        {
            if (Hash::check($password, $moderator->password)) {
                $request->session()->put('moderator', $moderator);
                return redirect()->action('Admin\HomeController@index');
            }else {
                return redirect()->action('Admin\AuthController@login');
            }
        }else{
            return redirect()->action('Admin\AuthController@login');
        }
    }

    public function logout(Request $request){
        $request->session()->forget('moderator');
        return redirect()->action('Admin\HomeController@index');
    }
}
