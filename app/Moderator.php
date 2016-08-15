<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Moderator extends Model
{
    use \Illuminate\Foundation\Auth\Access\Authorizable;
    protected $fillable = ['email','password','first_name','last_name','photo'];
}
