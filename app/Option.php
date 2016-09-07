<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    protected $fillable = [
        'contacts','terms_of_use','privacy_policy','copyright','copyright_link','mail','time_chat_message','users_chat_message','user_foto_bloc','moderate_publication'
    ];
}
