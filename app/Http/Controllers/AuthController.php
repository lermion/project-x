<?php

namespace App\Http\Controllers;

use App\SMS;
use App\User;
use Illuminate\Contracts\Validation\ValidationException;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Mockery\CountValidator\Exception;
use Validator;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        try {
            $this->validate($request, [
                'phone' => 'required|unique:users|numeric|min:5',
                'country_id' => 'required|numeric|exists:countries,id'
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
        $smsCode = rand(0, 10) . rand(0, 10) . rand(0, 10) . rand(0, 10);
        $userPhone = $request->input('phone');
        $countryId = $request->input('country_id');
        try {
            $smsResult = SMS::sendSMS($smsCode, $userPhone);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Curl SMS error",
                    'code' => '3'
                ]
            ];
            return response()->json($result);
        }
        if ($smsResult > 0) {
            $user = User::create(['phone' => $userPhone, 'country_id' => $countryId]);
            $request->session()->put('smsCode', $smsCode);
            return response()->json(['status' => true, 'phone' => $userPhone, 'user_id' => $user->id]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "SMS error, code $smsResult",
                    'code' => '3'
                ]
            ];
            return response()->json($result);
        }

    }

    public function checkSMSCode(Request $request)
    {
        $smsCode = $request->input('sms_code');
        if ($request->session()->has('smsCode')) {
            if ($smsCode == $request->session()->get('smsCode')) {
                $request->session()->put('canRegistered', true);
                return response()->json(["status" => true]);
            } else {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect code",
                        'code' => '4'
                    ]
                ];
                return response()->json([$result]);
            }
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "No variable in the session",
                    'code' => '5'
                ]
            ];
            return response()->json([$result]);
        }
    }

    public function auth(Request $request)
    {
        $login = $request->input('login');
        $password = $request->input('password');
        if ($login && $password) {
            $status = false;
            if(Auth::attempt(['login' => $login, 'password' => $password])){
                $status = true;
            }elseif(Auth::attempt(['phone' => $login, 'password' => $password])){
                $status = true;
            }
            return response()->json(['status'=>$status,'user_id'=>Auth::id()]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Validation error",
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }
    }

    public function logOut(){
        Auth::logout();
    }
}
