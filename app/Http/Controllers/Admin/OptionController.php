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
        $option = Option::first();
        return view('admin.option.index')->with('option', $option);
    }

    public function create(Request $request)
    {
        try {
            $this->validate($request, [
                //'copyright_link' => 'url',
                'mail' => 'email',
                'time_chat_message' => 'integer',
                'users_chat_message' => 'integer',
                //'user_foto_bloc' => 'boolean'
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return redirect('admin/option/')->with('message', 'Ошибка!!! Не сохраненно');
        }
        $optionData = $request->all();
        if ($request->input('user_foto_bloc') == 'on'){
            $optionData['user_foto_bloc'] = true;
        } else {
            $optionData['user_foto_bloc'] = false;
        }
        $option = Option::first();
        $option->update($optionData);
        return redirect('admin/option/')->with('message', 'Сохраненно');
    }

    public function mainPicture(Request $request)
    {
        try {
            $this->validate($request, [
                'picture' => 'required|image|mimes:png|max:5000'
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
        if ($request->hasFile('picture')) {
            $picture = $request->file('picture');
            $path = '/images/';
            $fullPath = public_path() . $path;
            Storage::put('bc.png', file_get_contents($picture->getRealPath()));
            $picture->move($fullPath, 'bc.png');
            Storage::delete('bc.png');
            $result = 'true';
        }
        return response()->json($result);

    }

//    public function update(Request $request, $id)
//    {
//        try {
//            $this->validate($request, [
//                'copyright_link' => 'url',
//                'mail' => 'email',
//                'time_chat_message' => 'integer',
//                'users_chat_message' => 'integer',
//                'user_foto_bloc' => 'boolean'
//            ]);
//        } catch (\Exception $ex) {
//            $result = [
//                "status" => false,
//                "error" => [
//                    'message' => $ex->validator->errors(),
//                    'code' => '1'
//                ]
//            ];
//            return response()->json($result);
//        }
//        $optionData = $request->all();
//        $option = Option::find($id);
//        $option->update($optionData);
////        return response()->json(["status" => true, 'option' => $option]);
//        return redirect('admin.option.index')->with('message', '��������� ���������');
//    }
}
