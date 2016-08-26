<?php

namespace App\Http\Controllers\Admin;

use App\BlackList;
use App\User;
use App\Comment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $users = User::where(['status' => ''])->paginate(25);
        return view('admin.user.index')->with('users',$users);
        $query = DB::table('users');
        if ($request->has('gender')) {
            $query->where('gender', $request->input('gender'));
        }
        if ($request->has('is_avatar')) {
            $query->where('is_avatar', $request->input('is_avatar'));
        }
        if ($request->has('reg_range_from') and $request->has('reg_range_to')) {
            $query->whereBetween('created_at', [$request->input('reg_range_from'), $request->input('reg_range_to')]);
        }
        if ($request->has('keywords')) {
            $query->where('user_quote', 'like', '%'.$request->input('keywords').'%');
//            ->orWhere('first_name', 'like', '%'.$request->input('keywords').'%')
//                ->orWhere('last_name', 'like', '%'.$request->input('keywords').'%')
//                ->orWhere('login', 'like', '%'.$request->input('keywords').'%');
        }
//        if ($request->has('keywords')) {
//            $query->where('first_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('last_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('login', 'like', '%'.$request->input('keywords').'%');
//        }
        if ($request->has('num_records')) {
            $query->take($request->input('num_records'));
        }
        if ($request->has('age_range_from') and $request->has('age_range_to')) {
            $from = Carbon::now()->subYears($request->input('age_range_from'))->toDateString();
            $to = Carbon::now()->subYears($request->input('age_range_to'))->toDateString();
            $query->whereBetween('birthday', [$to,$from]);
        }
        $users = $query->get();
        return response()->json($users);
    }

    public function getConfirm(Request $request)
    {
        $query = DB::table('users')->where(['status' => 'Подтвержден']);
        if ($request->has('gender')) {
            $query->where('gender', $request->input('gender'));
        }
        if ($request->has('is_avatar')) {
            $query->where('is_avatar', $request->input('is_avatar'));
        }
        if ($request->has('reg_range_from') and $request->has('reg_range_to')) {
            $query->whereBetween('created_at', [$request->input('reg_range_from'), $request->input('reg_range_to')]);
        }
        if ($request->has('keywords')) {
            $query->where('user_quote', 'like', '%'.$request->input('keywords').'%');
//                ->orWhere('first_name', 'like', '%'.$request->input('keywords').'%')
//                ->orWhere('last_name', 'like', '%'.$request->input('keywords').'%')
//                ->orWhere('login', 'like', '%'.$request->input('keywords').'%');
        }
//        if ($request->has('keywords')) {
//            $query->where('first_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('last_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('login', 'like', '%'.$request->input('keywords').'%');
//        }
        if ($request->has('num_records')) {
            $query->take($request->input('num_records'));
        }
        if ($request->has('age_range_from') and $request->has('age_range_to')) {
            $from = Carbon::now()->subYears($request->input('age_range_from'))->toDateString();
            $to = Carbon::now()->subYears($request->input('age_range_to'))->toDateString();
            $query->whereBetween('birthday', [$to,$from]);
        }
        $users = $query->get();
        return response()->json($users);
    }

    public function getReview(Request $request)
    {
        $query = DB::table('users')->where(['status' => 'На заметке']);
        if ($request->has('gender')) {
            $query->where('gender', $request->input('gender'));
        }
        if ($request->has('is_avatar')) {
            $query->where('is_avatar', $request->input('is_avatar'));
        }
        if ($request->has('reg_range_from') and $request->has('reg_range_to')) {
            $query->whereBetween('created_at', [$request->input('reg_range_from'), $request->input('reg_range_to')]);
        }
        if ($request->has('keywords')) {
            $query->where('user_quote', 'like', '%'.$request->input('keywords').'%');
//                ->orWhere('first_name', 'like', '%'.$request->input('keywords').'%')
//                ->orWhere('last_name', 'like', '%'.$request->input('keywords').'%')
//                ->orWhere('login', 'like', '%'.$request->input('keywords').'%');
        }
//        if ($request->has('keywords')) {
//            $query->where('first_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('last_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('login', 'like', '%'.$request->input('keywords').'%');
//        }
        if ($request->has('num_records')) {
            $query->take($request->input('num_records'));
        }
        if ($request->has('age_range_from') and $request->has('age_range_to')) {
            $from = Carbon::now()->subYears($request->input('age_range_from'))->toDateString();
            $to = Carbon::now()->subYears($request->input('age_range_to'))->toDateString();
            $query->whereBetween('birthday', [$to,$from]);
        }
        $users = $query->get();
        return response()->json($users);
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
        $groups = $user -> getGroup($id);
        $publications = $user -> getPublication($id);
        $places = $user -> getPlace($id);
        $subscriptions = $user -> getSubscription($id);
        $subscribers = $user -> getSubscribers($id);
        return view('admin.user.show',['subscribers'=>$subscribers,
            'subscriptions'=>$subscriptions,
            'places'=>$places,'groups'=>$groups,
            'user'=>$user,
            'publications'=>$publications
        ]);
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

    public function get_Confirm()
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
