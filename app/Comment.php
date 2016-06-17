<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['text', 'user_id'];

    public function images()
    {
        return $this->belongsToMany('App\Image', 'comment_images')->withTimestamps();
    }

    public function videos()
    {
        return $this->belongsToMany('App\Video', 'comment_videos')->withTimestamps();
    }

    public function likes()
    {
        return $this->belongsToMany('App\Like', 'comment_likes')->withTimestamps();
    }
    
    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
