<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['url'];
    
    public static function getImagePath($image){
        $path = '/upload/publication/images/';
        $fileName = str_random(8) . $image->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $image->move($fullPath, $fileName);

        return $path.$fileName;
    }

    public static function getAvatarPath($avatar)
    {
        $path = '/upload/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;

        // Avatar
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }
}
