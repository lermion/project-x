<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'login', 'phone', 'password', 'country_id', 'first_name', 'last_name', 'gender', 'is_avatar',
        'is_visible', 'is_private', 'user_quote'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'status'
    ];

    public function groups()
    {
        return $this->belongsToMany('App\Group', 'group_users')->withTimestamps();
    }

    public function places()
    {
        return $this->belongsToMany('App\Place', 'place_users')->withTimestamps();
    }

    public function publications()
    {
        return $this->hasMany('App\Publication');
    }

    public function subscription()
    {
        return $this->belongsToMany('App\User', 'subscribers', 'user_id_sub')->withTimestamps()->withPivot('id', 'is_confirmed');
    }

    public function subscribers()
    {
        return $this->belongsToMany('App\User', 'subscribers', 'user_id', 'user_id_sub')->withTimestamps()->withPivot('id', 'is_confirmed');
    }

    public function isRealSub($id)
    {
        return $this->subscribers()->where(['user_id_sub'=>$id,'is_confirmed'=>true])->first()!=null;
    }

    public function scopes()
    {
        return $this->belongsToMany('App\Scope', 'scope_users')->withTimestamps();
    }

    public function desired_scopes()
    {
        return $this->hasMany('App\DesiredScope');
    }

    public static function getPublication($id)
    {
        $publications = Publication::with(['user', 'videos', 'group', 'images'])
            ->where(function ($query) use ($id) {
                $query->where(['is_main'=> true,'is_moderate'=>true])
                    ->orWhere(function ($query) use ($id) {
                        $query->whereExists(function ($query) use ($id) {
                            $query->select(DB::raw('subscribers.user_id'))
                                ->from('subscribers')
                                ->where('subscribers.user_id_sub', $id)
                                ->where('subscribers.is_confirmed', true)
                                ->whereRaw('subscribers.user_id = publications.user_id');
                        });
                    });
            })->orderBy('id', 'desc')->get();
        return $publications;
    }

    public static function getGroup($id)
    {
        $groups = Group::with(['users', 'publications', 'creator'])->orderBy('id', 'desc')->get();
        return $groups;
    }

    public static function getPlace($id)
    {
        $places = Place::with(['users', 'publications', 'creator'])->orderBy('id', 'desc')->get();
        return $places;
    }

    public static function getSubscription($userId)
    {
        $user = User::find($userId);
        $subscription = $user->subscription;
        foreach ($subscription as &$sub) {
            $sub->is_sub = Subscriber::isSub($sub->id, $userId);
        }
        return $subscription;


    }

    public function getSubscribers($userId)
    {
        $user = User::find($userId);
        $subscribers = $user->subscribers;
        foreach ($subscribers as &$sub) {
            $sub->is_sub = Subscriber::isSub($sub->id, $userId);
        }
        return $subscribers;
    }
}
