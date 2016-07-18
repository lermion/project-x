<?php

namespace App\Http\Controllers\Admin;

//use App\Publication;
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
        $user->getSubscription($id)->toArray() ? $user->subscription = $user->getSubscription($id) : $user->subscription = false;
        $user->getSubscribers($id)->toArray() ? $user->subscribers = $user->getSubscribers($id) : $user->subscribers = false;
        $user->getPublication($id)->toArray() ? $user->publications = $user->getPublication($id) : $user->publications = false;
        User::find($user->id)->groups()->where(['group_users.user_id'=>$user->id,'group_users.is_creator'=>true])->get()->toArray() ? $user->groups = User::find($user->id)->groups()->where(['group_users.user_id'=>$user->id,'group_users.is_creator'=>true])->get()->toArray() : $user->groups = false;
        User::find($user->id)->places()->where(['place_users.user_id'=>$user->id,'place_users.is_creator'=>true])->get()->toArray() ? $user->places = User::find($user->id)->places()->where(['place_users.user_id'=>$user->id,'place_users.is_creator'=>true])->get()->toArray() : $user->places = false;
        return view('admin.user.show')->with('user', $user);
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
