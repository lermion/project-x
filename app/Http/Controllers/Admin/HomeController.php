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
}