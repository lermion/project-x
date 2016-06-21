<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupInvite extends Model
{
    protected $table = 'group_invitations';
    protected $fillable = [
        'user_id', 'inviter_user_id', 'group_id'
    ];
}
