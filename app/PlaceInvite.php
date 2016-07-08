<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PlaceInvite extends Model
{
    protected $table = 'place_invitations';
    protected $fillable = [
        'user_id', 'inviter_user_id', 'place_id'
    ];
}
