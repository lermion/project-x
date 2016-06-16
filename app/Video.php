<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = ['url'];

    public static function getVideoPath($video){
        $path = '/upload/publication/videos/';
        $fileName = str_random(8) . $video->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $video->move($fullPath, $fileName);

        return $path.$fileName;
    }
}
