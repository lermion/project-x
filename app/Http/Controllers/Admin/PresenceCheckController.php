<?php

namespace App\Http\Controllers\Admin;

use App\WorkingHoursModerator;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PresenceCheckController extends Controller
{
    public function getCheckTime(Request $request)
    {
        $admin = $request->session()->get('moderator');
        dd($i = new\DateTime());
        WorkingHoursModerator::where(['moderator_id'=>$admin['id']]);
        dd($admin['id']);
    }
}
