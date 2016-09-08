<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class IncorrectCode extends Model
{
    protected $fillable = [
        'ip','col_error'
    ];
}
