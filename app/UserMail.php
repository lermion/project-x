<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserMail extends Model
{
    protected $fillable = [
        'user_id','name','email','text','status'
    ];
}
