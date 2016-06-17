<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    protected $fillable = [
        'user_id', 'user_id_sub'
    ];
    
    public static function isSub($userId, $subId){
        return self::where('user_id',$userId)->where('user_id_sub',$subId)->first()!=null;
    }
}
