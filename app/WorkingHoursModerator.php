<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkingHoursModerator extends Model
{
    protected $fillable = [
        'weekday','from_time','to_time', 'moderator_id'
    ];
}
