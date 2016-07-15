<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserRoomsMessage extends Model
{
    protected $fillable = [
        'room_id', 'message_id'
    ];
}
