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
        $image->move($fullPath, $fileName);

        return $path.$fileName;
    }

    public static function getCoverPath($image){
        $path = '/upload/publication/cover/';
        $fileName = str_random(8) . $image->getClientOriginalName();
        $fullPath = public_path() . $path;
        $image->move($fullPath, $fileName);

        return $path.$fileName;
    }

    public static function getOriginalCoverPath($image){
        $path = '/upload/publication/original_cover/';
        $fileName = str_random(8) . $image->getClientOriginalName();
        $fullPath = public_path() . $path;
        $image->move($fullPath, $fileName);

        return $path.$fileName;
    }

    public static function getAvatarPath($avatar)
    {
        $path = '/upload/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getAvatarGroupPath($avatar)
    {
        $path = '/upload/group/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getCardGroupPath($avatar)
    {
        $path = '/upload/group/card/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getOriginalAvatarGroupPath($avatar)
    {
        $path = '/upload/group/original_avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getCoverPlacePath($cover)
    {
        $path = '/upload/place/covers/';
        $fileName = str_random(8) . $cover->getClientOriginalName();
        $fullPath = public_path() . $path;
        $cover->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getOriginalCoverPlacePath($cover)
    {
        $path = '/upload/place/original_covers/';
        $fileName = str_random(8) . $cover->getClientOriginalName();
        $fullPath = public_path() . $path;
        $cover->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getAvatarPlacePath($avatar)
    {
        $path = '/upload/place/avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }

    public static function getOriginalAvatarPlacePath($avatar)
    {
        $path = '/upload/place/original_avatars/';
        $fileName = str_random(8) . $avatar->getClientOriginalName();
        $fullPath = public_path() . $path;
        $avatar->move($fullPath, $fileName);

        return $path . $fileName;
    }

}
