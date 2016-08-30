<?php

namespace App\Http\Controllers\Admin;

use App\User;
use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Gate;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function statistic($date, $end_date)
    {
        $data=array();
        for ($i = new\DateTime($date);$i < new\DateTime($end_date);){
            (object)$data[$i->format('Y-m-d')] = (object)User::whereBetween('created_at', [ $i->format('Y-m-d'), $i->modify('+1 day')->format('Y-m-d')])->count();
        }
        return response()->json($data);
    }

    public function count_new_users()
    {
        $i = new\DateTime();
        $to_date = $i->format('Y-m-d');
        $date_day = $i->modify('-1 day')->format('Y-m-d');
        $day = User::whereBetween('created_at', [$date_day,$to_date])->count();
        $date_week = $i->modify('-7 day')->format('Y-m-d');
        $week = User::whereBetween('created_at', [$date_week,$to_date])->count();
        $date_month = $i->modify('-1 month')->format('Y-m-d');
        $month = User::whereBetween('created_at', [$date_month,$to_date])->count();
        $date_year = $i->modify('-1 year')->format('Y-m-d');
        $year = User::whereBetween('created_at', [$date_year,$to_date])->count();
        return response()->json(['day'=>$day,'week'=>$week,'month'=>$month,'year'=>$year]);
    }

}