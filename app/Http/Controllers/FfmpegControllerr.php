<?php

namespace App\Http\Controllers;


use App\Video;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Coordinate\TimeCode;
use FFMpeg\Format\Video\WebM;


use Illuminate\Http\Request;
use FFMpeg\FFMpeg;
use App\Http\Requests;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\File;


class FfmpegControllerr extends Controller
{


    /**
     * @param Request $request
     */
    public function put(Request $request)
    {
        
        try {
            $file = $request->file('video');
            $f_name = $file->getClientOriginalName();
            $f_path = storage_path('tmp/video');
            $file->move($f_path, $f_name);
            $ffmpeg = FFMpeg::create();
            $video = $ffmpeg->open($f_path . $f_name);
            $new_fname = uniqid();

            $video
                ->filters()
                ->resize(new Dimension(300, 200))
                ->synchronize();
            $video
                ->frame(TimeCode::fromSeconds(10))
                ->save('video/' . $new_fname . '.jpg');
            $video
                ->save(new WebM(), 'video/' . $new_fname . '.webm');
            Storage::disk('video')->delete($f_name);
            $video = Video::create(['url' => 'video/' . $new_fname . '.webm',
                           'img_url' => 'video/' . $new_fname . '.jpg']);
            $result = [
                "status" => true,
                "id" => $video->id,
                "url" => 'video/' . $new_fname . '.webm',
                "img_url" => 'video/' . $new_fname . '.jpg'
            ];
            return response()->json($result);
        }
        catch (\Exception $e) {
            Storage::disk('video')->delete($f_name);
            $result = [
                "status" => false,
                "error" => "sorry something went wrong with this video. please try again"
            ];
            return response()->json($result);
        }
    }
}