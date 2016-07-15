<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeleteMessage extends Model
{
    protected $fillable = [
        'user_id','id','room_id','message_id'
    ];
}
