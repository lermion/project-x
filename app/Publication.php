<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Publication extends Model
{
     protected $fillable = ['text', 'is_anonym', 'is_main', 'user_id', 'is_block', 'block_message', 'cover'];

    protected $hidden = ['is_block', 'block_message'];

    public function images()
    {
        return $this->belongsToMany('App\Image', 'publication_images')->withTimestamps();
    }

    public function place()
    {
        return $this->belongsToMany('App\Place', 'place_publications')->withTimestamps();
    }

    public function group()
    {
        return $this->belongsToMany('App\Group', 'group_publications')->withTimestamps();
    }

    public function videos()
    {
        return $this->belongsToMany('App\Video', 'publication_videos')->withTimestamps();
    }
    protected static function boot() {
        parent::boot();

        static::deleting(function($publication) { // before delete() method call this
            $publication->videos()->delete();
            // do the rest of the cleanup...
        });
    }

    public function likes()
    {
        return $this->belongsToMany('App\Like', 'publication_likes')->withTimestamps();
    }

    public function comments()
    {
        return $this->belongsToMany('App\Comment', 'publication_comments')->withTimestamps();
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public static function getMainPublication($offset,$limit,$userId = null)
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
            $publication->comments = $publication->comments()->with(['images', 'videos', 'user'])->orderBy('id', 'asc')->take(3)->get();
            $publication->like_count = $publication->likes()->count();
            if(Auth::check())
                $publication->user_like = $publication->likes()->where('user_id',Auth::id())->first()!=null;
            $publication->comment_count = $publication->comments()->count();
            if (!$publication->is_anonym) {
                $publication->user;
            }
            foreach ($publication->comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
        }
        return $publications;
    }

    public static function getUserPublication($offset,$limit,$userId)
    {
        $publications = Publication::with(['videos', 'images', 'user'])
            ->where('user_id', $userId)
            ->where('is_anonym', false)->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
        foreach ($publications as &$publication) {
            $publication->comments = $publication->comments()->with(['images', 'videos', 'user'])->take(3)->get();
            $publication->like_count = $publication->likes()->count();
            $publication->user_like = $publication->likes()->where('user_id', Auth::id())->first() != null;
            $publication->comment_count = $publication->comments()->count();
            foreach ($publication->comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
        }
        return $publications;
    }

    public static function show($id)
    {
        $publication = Publication::with(['videos', 'group', 'images', 'comments' => function ($query) {
            $query->take(3);
           // $query->orderBy('id', 'desc');
        }, 'comments.images', 'comments.videos', 'comments.user'])
            ->find($id);
        $publication->like_count = $publication->likes()->count();
        $publication->user_like = $publication->likes()->where('user_id',Auth::id())->first()!=null;
        $publication->comment_count = $publication->comments()->count();
        if(!$publication->is_anonym){
            $publication->user;
        }
        foreach ($publication->comments as &$comment) {
            $comment->like_count = $comment->likes()->count();
        }

        return $publication;
    }
}
