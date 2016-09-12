<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Scope extends Model
{
    protected $fillable = [
        'name','img','order','is_protected'
    ];

    public function users()
    {
        return $this->belongsToMany('App\User', 'scope_users')->withTimestamps();
    }

    public function publications()
    {
        return $this->belongsToMany('App\Publication', 'scope_publications')->withTimestamps();
    }

    public function groups()
    {
        return $this->belongsToMany('App\Group', 'scope_groups')->withTimestamps();
    }

    public function places()
    {
        return $this->belongsToMany('App\Place', 'scope_places')->withTimestamps();
    }

}
