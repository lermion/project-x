<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests;

class AuthorizationController extends Controller
{
    public function index()
    {
        if (Auth::id()) {$result = 'true';} else {$result = 'false';}
        return response()->json(["is_authorization" => $result]);
    }
}
