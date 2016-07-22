<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
         'text', 'user_id'
    ];

    public function images()
    {
        return $this->belongsToMany('App\Image', 'message_images')->withTimestamps();
    }

    public function videos()
    {
        return $this->belongsToMany('App\Video', 'message_videos')->withTimestamps();
    }
}
