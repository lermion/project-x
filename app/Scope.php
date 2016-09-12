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
        return $this->belongsToMany('App\User', 'scope_publications')->withTimestamps();
    }

}
