<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MessageVideo extends Model
{
    protected $fillable = [
        'message_id', 'video_id'
    ];
}
