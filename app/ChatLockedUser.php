<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChatLockedUser extends Model
{
    protected $fillable = [
        'user_id','locked_user_id'
    ];
}
