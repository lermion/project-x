<?php

namespace App\Http\Controllers\Admin;

use App\BlackList;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $count = $request->input('count') ? $request->input('count') : 10;
        $users = User::all();
        return view('admin.user.index')->with('users', $users);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        $offset = 0;
        $limit = 10;
        return view('admin.user.show')->with('user', $user);
        return Publication::getMainPublication($offset,$limit,$userId = $user->id );
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @param  int  $month
     * @return \Illuminate\Http\Response
     */
    public function destroy($id,$month)
    {
        $user = User::find($id);
        $timestamp = strtotime('+'.$month.' month');
        $date = date('Y:m:d', $timestamp);
        Blacklist::create(['phone'=>$user->phone,'date'=>$date]);
        $user->delete();
        return redirect()->action('Admin\UserController@index');
    }
}
