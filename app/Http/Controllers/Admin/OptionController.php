<?php

namespace App\Http\Controllers\Admin;

use App\Option;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class OptionController extends Controller
{
    public function index()
    {
        $options = Option::all();
        return $options;
    }

    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                'copyright_link' => 'url',
                'mail' => 'email',
                'time_chat_message' => 'integer',
                'users_chat_message' => 'integer',
                'user_foto_bloc' => 'boolean'
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
        $optionData = $request->all();
        $option = Option::create($optionData);
        return response()->json(["status" => true, 'option' => $option]);
    }

    public function update(Request $request, $id)
    {
        try {
            $this->validate($request, [
                'copyright_link' => 'url',
                'mail' => 'email',
                'time_chat_message' => 'integer',
                'users_chat_message' => 'integer',
                'user_foto_bloc' => 'boolean'
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
        $optionData = $request->all();
        $option = Option::find($id);
        $option->update($optionData);
        return response()->json(["status" => true, 'option' => $option]);
    }
}
