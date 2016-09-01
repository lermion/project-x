<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PublicationVideo extends Model
{
    protected $fillable = [
        'video_id', 'publication_id', 'is_cover'
    ];
}
