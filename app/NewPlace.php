<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NewPlace extends Model
{
    protected $fillable = [
        'user_id', 'place_id'
    ];
}
