<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ComplaintPublication extends Model
{
    protected $fillable = ['publication_id', 'complaint_category_id', 'user_which_id', 'user_to_id'];
}
