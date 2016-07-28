<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ChatNoticeMessage extends Model
{
    protected $fillable = [
        'user_id','room_id', 'message_id'
    ];
}
