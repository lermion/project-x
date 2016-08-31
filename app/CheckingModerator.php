<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CheckingModerator extends Model
{
    protected $fillable = [
        'moderator_id','work_date','hours_worked'
    ];
}
