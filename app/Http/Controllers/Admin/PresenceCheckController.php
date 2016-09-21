<?php

namespace App\Http\Controllers\Admin;

use App\Option;
use App\WorkingHoursModerator;
use App\CreateCheckingModerator;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PresenceCheckController extends Controller
{
    public function getCheckTime(Request $request)
    {
        $option = Option::first()->pluck('inspection_moderator');
        $admin = $request->session()->get('moderator');
        $time = Carbon::now();
        $weekday = $time->dayOfWeek;
        $working_hours = WorkingHoursModerator::where(['moderator_id' => $admin['id'], 'weekday' => $weekday])->first();
        if (!$working_hours){
            return response()->json(["status" => false, "error" => 'Today moderator does not work']);
        };
        $from_time = explode(":", $working_hours->from_time);
        $hour = $from_time[0];
        $min = $from_time[1];
        $sec = $from_time[2];
        dd($from_time);
        $working_time = Carbon::create(null, null, null, $hour, $min, $sec, NULL)->timestamp;
        $to_time = explode(":", $working_hours->to_time);
        $to_hour = $to_time[0];
        $to_min = $to_time[1];
        $to_sec = $to_time[2];
        $to_working_time = Carbon::create(null, null, null, $to_hour, $to_min, $to_sec, NULL)->timestamp;
        $timestamp = $time->timestamp;
        if ($timestamp < $to_working_time)
        {
            if ($timestamp > $working_time) {
                $time_inspection = $this->inspection($working_time);
            } else {
                $interval = $option[0] * 60;
                $time_inspection = Carbon::createFromTimestamp($working_time + $interval)->toTimeString();
            }
            return response()->json(["status" => true, "time" => $time_inspection, "moderator_id" => $admin['id']]);
        }
        else
        {
            return response()->json(["status" => false, "error" => 'Today moderator does not work']);
        }
    }
    public function Confirmation($id)
    {
        $option = Option::first()->pluck('inspection_moderator');
        $data['moderator_id'] = $id;
        $time = Carbon::now();
        $time_working = $time->toDateString();

        $moderator_working = CreateCheckingModerator::where('moderator_id',$id)->where('created_at', 'like', $time_working.'%')->first();
        if ($moderator_working) {
            $moderator_working->hours_worked += $option[0];
            $moderator_working->save();
        } else{
            CreateCheckingModerator::create($data);
            $moderator_working = CreateCheckingModerator::where('moderator_id',$id)->where('created_at', 'like', $time_working.'%')->first();
            $moderator_working->hours_worked += $option[0];
            $moderator_working->save();
        }
        return response()->json(["status" => true]);
    }

    private function inspection(&$working_time)
    {
        $option = Option::first()->pluck('inspection_moderator');
        $p = null;
        $interval = $option[0] * 60;
        $time = Carbon::now();
        $timestamp = $time->timestamp;
        $working_time = $working_time + $interval;
        if ($timestamp > $working_time) {
            $this->inspection($working_time);
        }
        $res = Carbon::createFromTimestamp($working_time)->toTimeString();

        return $res;
    }
}