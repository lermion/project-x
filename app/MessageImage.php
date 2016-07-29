<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MessageImage extends Model
{
    protected $fillable = [
        'message_id', 'image_id'
    ];
}
