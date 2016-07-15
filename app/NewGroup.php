<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class NewGroup extends Model
{
    protected $fillable = [
        'user_id', 'group_id'
    ];
}
