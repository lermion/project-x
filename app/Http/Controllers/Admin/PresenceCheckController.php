<?php

namespace App\Http\Controllers\Admin;

use App\WorkingHoursModerator;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PresenceCheckController extends Controller
{
    public function getCheckTime(Request $request)
    {
        $admin = $request->session()->get('moderator');
        $time = Carbon::now();
        $weekday = $time->dayOfWeek;
        //dd($weekday);
        $timestamp = $time->timestamp;
        //dd($weekday);
        $working_hours = WorkingHoursModerator::where(['moderator_id'=>$admin['id'], 'weekday'=>$weekday])->first();
        //dd($working_hours->from_time);
        $Y2K = Carbon::create(null, null, null, $working_hours->from_time, NULL);

        dd($Y2K);
        //$working_hours->from_time;
    }
}
