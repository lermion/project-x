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
        $working_hours = WorkingHoursModerator::where(['moderator_id' => $admin['id'], 'weekday' => $weekday])->first();
        $from_time = explode(":", $working_hours->from_time);
        $hour = $from_time[0];
        $min = $from_time[1];
        $working_time = Carbon::create(null, null, null, $hour, $min, 0, NULL)->timestamp;
        $to_time = explode(":", $working_hours->to_time);
        $to_hour = $to_time[0];
        $to_min = $to_time[1];
        $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, 0, NULL)->timestamp;
        $timestamp = $time->timestamp;
        if ($timestamp < $to_working_time) {
            function inspection($working_time)
            {
                $p = null;
                $interval = 30 * 60;
                $time = Carbon::now();
                $timestamp = $time->timestamp;
                if ($timestamp > $working_time) {
                    $inspection = inspection($working_time + $interval);
                } else {
                    $inspection = Carbon::createFromTimestamp($working_time)->toTimeString();
                }
                return $inspection;
            }

            $time_inspection = inspection($working_time);
            return response()->json(["status" => true, "time" => $time_inspection]);
        }
        else
        {
            return response()->json(["status" => false, "error" => 'Today moderator does not work']);
        }
    }
}