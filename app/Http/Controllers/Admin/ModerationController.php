<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ModerationController extends Controller
{
    public function index()
    {

        return view('admin.moderation.index');
    }

    public function groups()
    {

        return view('admin.moderation.groups');
    }

    public function places()
    {

        return view('admin.moderation.places');
    }
}
