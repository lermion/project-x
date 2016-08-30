<?php

namespace App\Http\Controllers\Admin;

use App\Option;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

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
//        try {
//            $this->validate($request, [
//                'picture' => 'required|image|mimes:png|max:5000'
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
        try
        {
            $this->validate($request, [
                'picture' => 'required|image|mimes:jpeg|max:1000'
            ]);
            $request->hasFile('picture');
            $picture = $request->file('picture');
            $cover = getimagesize($picture);
            if($cover[0] > 1920){
                $x = $cover[0];
            }
            if ($cover[1] >= 1080){
                $y = $cover[1];
            }
            $data = $x;

            //dd($cover);


            $path = '/images/';
            $fullPath = public_path() . $path;
            Storage::put('bc.png', file_get_contents($picture->getRealPath()));
            $picture->move($fullPath, 'bc.png');
            Storage::delete('bc.png');
            $result = 'true';

        }
        catch (\Exception $e) {
            $result = [
                "status" => false,
                "error" => "Bed image"
            ];
            return response()->json($result);
        }
        return response()->json($result);
    }



    public static function cropAvatar($path)
    {
        self::resize($path, $path, null, 587);
        list($w_i, $h_i, $type) = getimagesize($path);
        if ($w_i > 386) {
            $del = ($w_i - 376) / 2;
            self::crop($path, $path, array($del, 0, -$del, -1));
        }
    }

    public static function crop($file_input, $file_output, $crop = 'square', $percent = false)
    {
        list($w_i, $h_i, $type) = getimagesize($file_input);
        if (!$w_i || !$h_i) {
            echo '?????????? ???????? ????? ? ?????? ???????????';
            return;
        }
        $types = array('', 'gif', 'jpeg', 'png');
        $ext = $types[$type];
        if ($ext) {
            $func = 'imagecreatefrom' . $ext;
            $img = $func($file_input);
        } else {
            echo '???????????? ?????? ?????';
            return;
        }
        if ($crop == 'square') {
            $min = $w_i;
            if ($w_i > $h_i) $min = $h_i;
            $w_o = $h_o = $min;
        } else {
            list($x_o, $y_o, $w_o, $h_o) = $crop;
            if ($percent) {
                $w_o *= $w_i / 100;
                $h_o *= $h_i / 100;
                $x_o *= $w_i / 100;
                $y_o *= $h_i / 100;
            }
            if ($w_o < 0) $w_o += $w_i;
            $w_o -= $x_o;
            if ($h_o < 0) $h_o += $h_i;
            $h_o -= $y_o;
        }
        $img_o = imagecreatetruecolor($w_o, $h_o);
        imagecopy($img_o, $img, 0, 0, $x_o, $y_o, $w_o, $h_o);
        if ($type == 2) {
            return imagejpeg($img_o, $file_output, 100);
        } else {
            $func = 'image' . $ext;
            return $func($img_o, $file_output);
        }
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
