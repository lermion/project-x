<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = [
        'avatar','description','name','url_name','address','coordinates_x','coordinates_y','dynamic','expired_days','city_id','type_place_id'
    ];

    public function users()
    {
        return $this->belongsToMany('App\User', 'place_users')->withTimestamps();
    }

    public function publications()
    {
        return $this->belongsToMany('App\Publication', 'place_publications')->withTimestamps();
    }
}
