<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlaceUser extends Model
{
    protected $fillable = [
        'user_id', 'place_id', 'is_admin'
    ];
}
