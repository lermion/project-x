<?php

namespace App\Http\Controllers;

use App\SMS;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    public function update(Request $request)
    {
        try {
            $this->validate($request, [
                'password' => 'required|min:6'
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
        if (Auth::check()) {
            $oldPass = $request->input('old_password');
            $user = Auth::user();
            if(!Hash::check($oldPass, $user->password)){
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect old password",
                        'code' => '9'
                    ]
                ];
                return response()->json($result);
            }
        } elseif ($request->session()->has('canUpdate')) {
            $userId = $request->session()->get('user_id');
            $user = User::find($userId);
        }else{
            $result = [
                "status" => false,
                "error" => [
                    'message' => "Permission denied",
                    'code' => '8'
                ]
            ];
            return response()->json($result);
        }
        $password = $request->input('password');
        $user->password = bcrypt($password);
        $user->save();
        Auth::attempt(['login' => $user->login, 'password' => $password]);

        return response()->json(['status'=>true,'user_id'=>$user->id]);
    }

    public function restore(Request $request)
    {
        try {
            $this->validate($request, [
                'phone' => 'required|exists:users,phone'
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
            $user = User::where('phone', $userPhone)->first();
            $request->session()->put('smsCodePass', $smsCode);
            $request->session()->put('user_id', $user->id);
            return response()->json(['status' => true]);
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

    public function validateCode(Request $request)
    {
        $smsCode = $request->input('sms_code');
        if ($request->session()->has('smsCodePass')) {
            if ($smsCode == $request->session()->get('smsCodePass')) {
                $request->session()->put('canUpdate', true);
                return response()->json(["status" => true]);
            } else {
                $result = [
                    "status" => false,
                    "error" => [
                        'message' => "Incorrect code",
                        'code' => '4'
                    ]
                ];
                return response()->json($result);
            }
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "No variable in the session",
                    'code' => '5'
                ]
            ];
            return response()->json($result);
        }
    }
}
