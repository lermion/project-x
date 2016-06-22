<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Moderator extends Model
{
    protected $fillable = ['email','password','first_name','last_name','photo'];
}
