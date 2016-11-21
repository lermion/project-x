<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class WorkingHoursModerator extends Model
{
    protected $table = 'working_hours_moderators';
    protected $fillable = [
        'weekday','from_time','to_time', 'moderator_id'
    ];
}
