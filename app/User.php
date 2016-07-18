<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'login', 'phone', 'password', 'country_id', 'first_name', 'last_name', 'gender', 'status', 'is_avatar',
        'is_visible', 'is_private'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token'
    ];

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

    public static function getPublication($offset,$limit,$userId = null)
    {
        $publications = Publication::with(['user', 'videos', 'group', 'images'])
            ->where(function ($query) use ($userId) {
                $query->where(['is_main'=> true,'is_moderate'=>true])
                    ->orWhere(function ($query) use ($userId) {
                        $query->whereExists(function ($query) use ($userId) {
                            $query->select(DB::raw('subscribers.user_id'))
                                ->from('subscribers')
                                ->where('subscribers.user_id_sub', $userId)
                                ->where('subscribers.is_confirmed', true)
                                ->whereRaw('subscribers.user_id = publications.user_id');
                        });
                    });
            })->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
        foreach ($publications as &$publication) {
            //$publication->comments = $publication->comments()->with(['images', 'videos', 'user'])->orderBy('id', 'desc')->take(3)->toArray();
            $publication_coment = $publication->comments()->with(['images', 'videos', 'user'])->orderBy('id', 'desc')->take(3)->get();
            foreach ($publication_coment as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
            $publication_coment = $publication_coment->toArray();
            $publication->comments = array_reverse($publication_coment);
            $publication->like_count = $publication->likes()->count();
            if(Auth::check())
                $publication->user_like = $publication->likes()->where('user_id',Auth::id())->first()!=null;
            $publication->comment_count = $publication->comments()->count();
            if (!$publication->is_anonym) {
                $publication->user;
            }
        }
        return $publications;
    }
}
