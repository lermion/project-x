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
    public function index()
    {
        $users = User::where(['status' => ''])->paginate(25);
        return view('admin.user.index',['users'=>$users, 'url'=>'New']);
    }
    public function getConfirm(Request $request)
    {
        $query = DB::table('users')->where('status','На заметке');
        if ($request->input('gender') != null) {
            $query->where('gender', $request->input('gender'));
        }
        if ($request->input('is_avatar') != null) {
            $query->where('is_avatar', $request->input('is_avatar'));
        }
        if ($request->input('reg_range_from') and $request->input('reg_range_to')) {
            $query->whereBetween('created_at', [$request->input('reg_range_from'), $request->input('reg_range_to')]);
        }
        if ($request->input('keywords')) {
            $query->where('user_quote', 'like', '%' . $request->input('keywords') . '%')
                ->orWhere('first_name', 'like', '%' . $request->input('keywords') . '%')
                ->orWhere('last_name', 'like', '%' . $request->input('keywords') . '%')
                ->orWhere('login', 'like', '%' . $request->input('keywords') . '%');
        }
        if ($request->input('num_records')) {
            $query->take($request->input('num_records'));
        }
        if ($request->input('age_range_from') and $request->input('age_range_to')) {
            $from = Carbon::now()->subYears($request->input('age_range_from'))->toDateString();
            $to = Carbon::now()->subYears($request->input('age_range_to'))->toDateString();
            $query->whereBetween('birthday', [$to, $from]);
        }
        $users = $query->get();
        return response()->json($users);
    }

    public function getUsers(Request $request)
    {
        $admin = $request->session()->get('moderator');
        if ($admin['is_admin'] == 1) {
            $query = DB::table('users')->where('status', '!=', 'На заметке');
            if ($request->input('gender') != null) {
                $query->where('gender', $request->input('gender'));
            }
            if ($request->input('is_avatar') != null) {
                $query->where('is_avatar', $request->input('is_avatar'));
            }
            if ($request->input('reg_range_from') and $request->input('reg_range_to')) {
                $query->whereBetween('created_at', [$request->input('reg_range_from'), $request->input('reg_range_to')]);
            }
            if ($request->input('keywords')) {
                $query->where('user_quote', 'like', '%' . $request->input('keywords') . '%')
                    ->orWhere('first_name', 'like', '%' . $request->input('keywords') . '%')
                    ->orWhere('last_name', 'like', '%' . $request->input('keywords') . '%')
                    ->orWhere('login', 'like', '%' . $request->input('keywords') . '%');
            }
//        if ($request->has('keywords')) {
//            $query->where('first_name', 'like', '%'.$request->input('keywords').'%');
//        }
//        if ($request->has('keywords')) {
//            $query->where('last_name', 'like', '%'.$request->input('keywords').'%');
//        }
//       if ($request->has('keywords')) {
//            $query->where('login', 'like', '%'.$request->input('keywords').'%');
//        }
            if ($request->input('num_records')) {
                $query->take($request->input('num_records'));
            }
            if ($request->input('age_range_from') and $request->input('age_range_to')) {
                $from = Carbon::now()->subYears($request->input('age_range_from'))->toDateString();
                $to = Carbon::now()->subYears($request->input('age_range_to'))->toDateString();
                $query->whereBetween('birthday', [$to, $from]);
            }
            $users = $query->get();
            return response()->json($users);
        }
        else
        {
            $query = DB::table('users')->where('status','');
            if ($request->input('gender') != null) {
                $query->where('gender', $request->input('gender'));
            }
            if ($request->input('is_avatar') != null) {
                $query->where('is_avatar', $request->input('is_avatar'));
            }
            if ($request->input('reg_range_from') and $request->input('reg_range_to')) {
                $query->whereBetween('created_at', [$request->input('reg_range_from'), $request->input('reg_range_to')]);
            }
            if ($request->input('keywords')) {
                $query->where('user_quote', 'like', '%' . $request->input('keywords') . '%')
                    ->orWhere('first_name', 'like', '%' . $request->input('keywords') . '%')
                    ->orWhere('last_name', 'like', '%' . $request->input('keywords') . '%')
                    ->orWhere('login', 'like', '%' . $request->input('keywords') . '%');
            }
            if ($request->input('num_records')) {
                $query->take($request->input('num_records'));
            }
            if ($request->input('age_range_from') and $request->input('age_range_to')) {
                $from = Carbon::now()->subYears($request->input('age_range_from'))->toDateString();
                $to = Carbon::now()->subYears($request->input('age_range_to'))->toDateString();
                $query->whereBetween('birthday', [$to, $from]);
            }
            $users = $query->get();
            return response()->json($users);
        }
    }

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

}
