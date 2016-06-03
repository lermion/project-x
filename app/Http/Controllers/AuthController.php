<?php

namespace App\Http\Controllers;

use App\SMS;
use App\User;
use Illuminate\Contracts\Validation\ValidationException;
use Illuminate\Http\Request;

use App\Http\Requests;
use Mockery\CountValidator\Exception;
use Validator;

class AuthController extends Controller
{
    public function store(Request $request)
    {
        try {
            $this->validate($request, [
                'phone' => 'required|unique:users|numeric|min:5',
                'country_id' => 'required|numeric'
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
        $smsCode = rand(4, 4);
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
            User::create(['phone' => $userPhone, 'country_id' => $countryId]);
            $request->session()->put('smsCode', $smsCode);
            return response()->json(['status' => true, 'phone' => $userPhone]);
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

    }

    public function auth(Request $request)
    {

    }
}
