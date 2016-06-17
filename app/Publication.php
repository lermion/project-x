<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Publication extends Model
{
    protected $fillable = ['text', 'is_anonym', 'is_main', 'user_id'];

    public function images()
    {
        return $this->belongsToMany('App\Image', 'publication_images')->withTimestamps();
    }

    public function videos()
    {
        return $this->belongsToMany('App\Video', 'publication_videos')->withTimestamps();
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

    public static function getMainPublication($userId = null)
    {
        $publications = Publication::with(['videos', 'images', 'comments' => function ($query) {
            $query->take(3);
        }, 'comments.images', 'comments.videos', 'comments.user'])
            ->where(function ($query) use ($userId) {
                $query->where('is_main', true)
                    ->orWhere(function ($query) use ($userId) {
                        $query->whereExists(function ($query) use ($userId) {
                            $query->select(DB::raw('subscribers.user_id'))
                                ->from('subscribers')
                                ->where('subscribers.user_id_sub', $userId)
                                ->whereRaw('subscribers.user_id = publications.user_id');
                        });
                    });
            })->get();
        foreach ($publications as &$publication) {
            $publication->like_count = $publication->likes()->count();
            $publication->comment_count = $publication->comments()->count();
            if(!$publication->is_anonym){
                $publication->user;
            }
            foreach ($publication->comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
        }
        return $publications;
    }

    public static function getUserPublication($userId)
    {
        $publications = Publication::with(['videos', 'images', 'user', 'comments' => function ($query) {
            $query->take(3);
        }, 'comments.images', 'comments.videos', 'comments.user'])
            ->where('user_id', $userId)
            ->where('is_anonym', false)->get();
        foreach ($publications as &$publication) {
            $publication->like_count = $publication->likes()->count();
            $publication->comment_count = $publication->comments()->count();
            foreach ($publication->comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
        }
        return $publications;
    }

    public static function show($id)
    {
        $publication = Publication::with(['videos', 'images', 'user', 'comments' => function ($query) {
            $query->take(3);
        }, 'comments.images', 'comments.videos', 'comments.user'])
            ->find($id);
        $publication->like_count = $publication->likes()->count();
        $publication->comment_count = $publication->comments()->count();
        foreach ($publication->comments as &$comment) {
            $comment->like_count = $comment->likes()->count();
        }

        return $publication;
    }
}
