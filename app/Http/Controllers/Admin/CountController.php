<?php

namespace App\Http\Controllers\Admin;

use App\Group;
use App\Place;
use App\Publication;
use App\User;
use App\UserMail;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class CountController extends Controller
{
    public function users()
    {
        $user = User::where('status', '')->count();
        return $user;
    }

    public function mails()
    {
        $mails = UserMail::where('status', 'New')->count();
        return $mails;
    }

    public function to_remove()
    {
        $to_remove = \DB::transaction(function() {
            $user = User::where('is_block', true)->count();
            $place = Place::where('is_block', true)->count();
            $group = Group::where('is_block', true)->count();
            $publication = Publication::where('is_block', true)->count();
            $remove = $user+$place+$group+$publication;
            return $remove;
        });
        return $to_remove;

    }
}

