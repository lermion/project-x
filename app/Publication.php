<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = ['text', 'is_anonym', 'is_main', 'user_id'];
    
    public function images()
    {
        return $this->belongsToMany('App\Image','publication_images')->withTimestamps();
    }

    public function videos()
    {
        return $this->belongsToMany('App\Video','publication_videos')->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
