<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserChat extends Model
{
    protected $fillable = [
        'user_id','room_id'
    ];
}
