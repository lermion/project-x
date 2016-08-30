<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PublicationImage extends Model
{
    protected $fillable = [
        'image_id', 'publication_id', 'is_cover'
    ];
}
