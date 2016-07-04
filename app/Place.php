<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = [
        'avatar','description','name','address','coordinates_x','coordinates_y','expired_days','city_id','type_place_id'
    ];
}
