<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ComplaintComment extends Model
{
    protected $fillable = ['comment_id', 'complaint_category_id', 'user_which_id', 'user_to_id'];
}
