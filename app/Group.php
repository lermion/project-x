<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = [
        'name', 'url_name', 'description', 'is_open', 'avatar', 'card_avatar', 'room_id'
    ];

    public function users()
    {
        return $this->belongsToMany('App\User', 'group_users')->withTimestamps();
    }

    public function publications()
    {
        return $this->belongsToMany('App\Publication', 'group_publications')->withTimestamps();
    }
}
