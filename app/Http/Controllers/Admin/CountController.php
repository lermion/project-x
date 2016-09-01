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
        $user_count = User::where('is_block', true)->count();
        $places_count = Place::where('is_block', true)->count();
        $groups_count = Group::where('is_block', true)->count();
        $publications_count = Publication::where('is_block', true)->count();
        $count = $user_count+$places_count+$groups_count+$publications_count;
        $response = ['count'=>$count, 'user_count'=>$user_count, 'places_count'=>$places_count, 'groups_count'=>$groups_count, 'publications_count'=>$publications_count];
        return response()->json($response);

    }
}