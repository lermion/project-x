<?php

namespace App\Http\Controllers\Admin;

use App\Option;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image as Image2;

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
        if ($request->input('moderate_publication') == 'on'){
            $optionData['moderate_publication'] = true;
        } else {
            $optionData['moderate_publication'] = false;
        }
        $option = Option::first();
        $option->update($optionData);
        return redirect('admin/option/')->with('message', 'Сохраненно');
    }

    public function mainPicture(Request $request)
    {
        try
        {
            $this->validate($request, [
                'picture' => 'required|image|max:3000'
            ]);
            $request->hasFile('picture');
            $picture = $request->file('picture');
            $cover = getimagesize($picture);

            if ($cover[0] < 1920 || $cover[1] < 1080){
                $result = [
                    "status" => false,
                    "error" => "Low resolution images"
                ];
            }

            if($cover[0] > 1920 || $cover[1] > 1080)
            {
                $picture = Image2::make($picture);
                $picture->resize(1920, 1080);
                $path = '/images/';
                $fullPath = public_path() . $path;
                Storage::delete('bc.jpeg');
                $picture->save($fullPath.'bc.jpeg');
                $result = [
                    "status" => true,
                    "error" => "Picture set"
                ];
            }

            elseif($cover[0] == 1920 and $cover[1] == 1080)
            {
                $path = '/images/';
                $fullPath = public_path() . $path;
                Storage::delete('bc.jpeg');
                $picture->save($fullPath.'bc.jpeg');
                $result = [
                    "status" => true,
                    "error" => "Picture set"
                ];
            }

        }
        catch (\Exception $e) {
            $result = [
                "status" => false,
                "error" => "Bed image"
            ];
            return response()->json($result);
        }
        return redirect('admin/option/')->with('message',$result);
    }
}
