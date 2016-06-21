<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupUser extends Model
{
    protected $fillable = [
        'user_id', 'group_id', 'is_admin'
    ];
}
