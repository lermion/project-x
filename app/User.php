<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'login', 'phone', 'password', 'country_id', 'first_name', 'last_name', 'gender', 'status', 'is_avatar',
        'is_visible'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token'
    ];

    public function publications()
    {
        return $this->hasMany('App\Publication');
    }

    public function subscription(){
        return $this->belongsToMany('App\User', 'subscribers','user_id_sub')->withTimestamps();
    }
    public function subscribers(){
        return $this->belongsToMany('App\User', 'subscribers','user_id','user_id_sub')->withTimestamps();
    }
}
