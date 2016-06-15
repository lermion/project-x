<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Online extends Model
{
    protected $table = 'onlines';

    protected $fillable = ['user_id', 'last_action'];

    public static function getLastOnline($userId){
        if($lastAction = User::join('onlines', 'users.id', '=', 'onlines.user_id')
            ->where('users.id', '=', $userId)
            ->select('onlines.last_action')
            ->first()){
            return $lastAction->last_action;
        }else{
            return false;
        }
    }

    public static function logOut($userId){
        self::where('user_id','=',$userId)->delete();
    }

    public static function isOnline($userId){
        $lastAction = self::getLastOnline($userId);
        if(!$lastAction){
            return false;
        }
        $now = (new \DateTime('now'))->getTimestamp();
        $lastAction = (new \DateTime($lastAction))->getTimestamp();
        $fifteenMinutes = 5*60;
        if($now-$lastAction<$fifteenMinutes){
            return true;
        }else{
            return false;
        }
    }
}
