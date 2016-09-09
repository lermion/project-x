<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DesiredScope extends Model
{
    protected $fillable = [
        'user_id', 'scope_name'
    ];
}
