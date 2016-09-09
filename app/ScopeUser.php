<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ScopeUser extends Model
{
    protected $fillable = [
        'user_id','scope_id'
    ];
}
