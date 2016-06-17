<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    protected $fillable = ['user_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function publications()
    {
        return $this->belongsToMany('App\Publication','publication_likes')->withTimestamps();
    }
}
