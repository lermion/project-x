<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ComplaintsController extends Controller
{
    public function index()
    {
        return view('admin.complaints.index');
    }
}
