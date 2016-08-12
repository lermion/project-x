<?php

namespace App\Http\Controllers\Admin;

use App\BlackList;
use App\User;
use App\Comment;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

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
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        $offset = 0;
        $limit = 10;
        Comment::with(['videos', 'images', 'user'])->where('user_id', $id)->get()->toArray()
            ? $user->comments = Comment::with(['videos', 'images', 'user'])->where('user_id', $id)->get()->toArray()
            : $user->comments = false;
        $user->getSubscription($id)->toArray()
            ? $user->subscription = $user->getSubscription($id)
            : $user->subscription = false;
        $user->getSubscribers($id)->toArray()
            ? $user->subscribers = $user->getSubscribers($id)
            : $user->subscribers = false;
        $user->getPublication($id)->toArray()
            ? $user->publications = $user->getPublication($id)
            : $user->publications = false;
        User::find($user->id)->groups()->where(['group_users.user_id' => $user->id, 'group_users.is_creator' => true])->get()->toArray()
            ? $user->groups = User::find($user->id)->groups()->where(['group_users.user_id' => $user->id, 'group_users.is_creator' => true])->get()->toArray()
            : $user->groups = false;
        User::find($user->id)->places()->where(['place_users.user_id' => $user->id, 'place_users.is_creator' => true])->get()->toArray()
            ? $user->places = User::find($user->id)->places()->where(['place_users.user_id' => $user->id, 'place_users.is_creator' => true])->get()->toArray()
            : $user->places = false;
        return view('admin.user.show')->with('user', $user);
        //return response()->json(["status" => true, 'user' => $user]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @param  int $month
     * @return \Illuminate\Http\Response
     */
    public function confirm($id)
    {
        $user = User::where(['id' => $id])->first();
        if ($user->status != 'Подтвержден' or $user->status = '') {
            $user->status = 'Подтвержден';
            $user->save();
            return response()->json(['status' => true]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return response()->json($result);
        }
    }

    public function getConfirm()
    {
        if ($user = User::where(['status' => 'Подтвержден'])->get()->toArray()) {
            return $user;
        } else {
            $result = [
                "status" => false,
            ];
            return response()->json($result);
        }
    }

    public function review($id)
    {
        $user = User::where(['id' => $id])->first();
        if ($user->status != 'На заметке' or $user->status = '') {
            $user->status = 'На заметке';
            $user->save();
            return response()->json(['status' => true]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return response()->json($result);
        }
    }

    public function getReview()
    {
        if ($user = User::where(['status' => 'На заметке'])->get()->toArray()) {
            return $user;
        } else {
            $result = [
                "status" => false,
            ];
            return response()->json($result);
        }
    }

    public function suspicious($id)
    {
        $user = User::where(['id' => $id])->first();
        if ($user->status != 'Подозрительный' or $user->status = '') {
            $user->status = 'Подозрительный';
            $user->save();
            return response()->json(['status' => true]);
        } else {
            $result = [
                "status" => false,
                "error" => [
                    'message' => "The user has this status",
                    'code' => '7'
                ]
            ];
            return response()->json($result);
        }
    }

    public function getSuspicious()
    {
        if ($user = User::where(['status' => 'Подозрительный'])->get()->toArray()) {
            return $user;
        } else {
            $result = [
                "status" => false,
            ];
            return response()->json($result);
        }
    }

    public function destroy($id, $month)
    {
        $user = User::find($id);
        $timestamp = strtotime('+' . $month . ' month');
        $date = date('Y:m:d', $timestamp);
        Blacklist::create(['phone' => $user->phone, 'date' => $date]);
        $user->first_name = 'Пользователь';
        $user->last_name = 'удален';
        //$user->login = str_random(8);
        //$user->phone = '';
        $user->password = str_random(8);
        $user->avatar_path = '/upload/avatars/no-avatar';
        $user->status = 'Удален';
        $user->original_avatar_path = '/upload/avatars/no-avatar';
        $user->user_quote = '';
        $user->is_private = true;
        $user->save();
        return redirect()->action('Admin\UserController@index');
    }

    public function mainPicture(Request $request)
    {
        try {
            $this->validate($request, [
                'picture' => 'required|image|mimes:png|max:5000'
            ]);
        } catch (\Exception $ex) {
            $result = [
                "status" => false,
                "error" => [
                    'message' => $ex->validator->errors(),
                    'code' => '1'
                ]
            ];
            return response()->json($result);
        }
        if ($request->hasFile('picture')) {
            $picture = $request->file('picture');
            $path = '/images/';
            $fullPath = public_path() . $path;
            Storage::put('bc.png', file_get_contents($picture->getRealPath()));
            $picture->move($fullPath, 'bc.png');
            Storage::delete('bc.png');
            $result = 'true';
        }
        return response()->json($result);

    }
}
