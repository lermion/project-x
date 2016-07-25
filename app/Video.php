<?php

namespace App;

use FFMpeg\Coordinate\Dimension;
use FFMpeg\Coordinate\TimeCode;
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\WebM;
use FFMpeg\Format\Video\X264;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Video extends Model
{
    protected $fillable = ['url','img_url','is_coded'];

    public static function makeFrame($f_name, $f_path, $new_fname){
        if (substr(php_uname(), 0, 7) == "Windows"){
            $ffmpeg = FFMpeg::create([
                'ffmpeg'        => 'C:\ffmpeg\bin\ffmpeg.exe',
                'ffprobe'        => 'C:\ffmpeg\bin\ffprobe.exe'
            ]);
        }
        else {
            $ffmpeg = FFMpeg::create();
        }
        $file = $ffmpeg->open($f_path . $f_name);
        $file
            ->filters()
            ->resize(new Dimension(640, 480))
            ->synchronize();
        $file
            ->frame(TimeCode::fromSeconds(10))
            ->save($new_fname . '.jpg');
    }
    public static function makeVideo($f_name, $f_path, $new_fname)
    {
        /*$path = '/upload/publication/videos/';
        $fileName = str_random(8) . $video->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $video->move($fullPath, $fileName);*/

            if (substr(php_uname(), 0, 7) == "Windows"){
                $ffmpeg = FFMpeg::create([
                'ffmpeg'        => 'C:\ffmpeg\bin\ffmpeg.exe',
                'ffprobe'        => 'C:\ffmpeg\bin\ffprobe.exe'
            ]);

            }
            else {
                $ffmpeg = FFMpeg::create();
//dd($ffmpeg);

           }
            $file = $ffmpeg->open($f_path . $f_name);
            $file
                ->filters()
  //              ->resize(new Dimension(640, 480))
                ->synchronize();
//dd($file);
            $file
		
        //        ->save(new WebM(), $new_fname . '.webm');
		->save(new X264(), 'export-x264.mp4');
            Storage::disk('video')->delete($f_name);
        
    }

    public static function getVideoPath($video){
        $path = '/upload/publication/videos/';
        $fileName = str_random(8) . $video->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $video->move($fullPath, $fileName);

        return $path.$fileName;
    }

}
