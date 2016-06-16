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
}
