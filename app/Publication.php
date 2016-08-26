<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class Publication extends Model
{
    protected $fillable = ['block_message','is_block', 'text', 'is_anonym', 'is_main', 'user_id', 'is_block', 'block_message', 'cover', 'original_cover', 'is_moderate'];

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
        $publications = Publication::with(['user', 'videos', 'images', 'group', 'place'])
            ->where(['is_topic'=> true])
            ->orWhere(function ($query) use ($userId) {
                $query->where(function($q){
                    $q->where(['is_main'=> true]);
                    $q->where(function($quer){
                        $quer->where('is_moderate',true);
                        $quer->orWhere('user_id',Auth::id());
                    });
                })
                    ->orWhere(function ($query) use ($userId) {
                        $query->whereExists(function ($query) use ($userId) {
                            $query->select(DB::raw('subscribers.user_id'))
                                ->from('subscribers')
                                ->where('subscribers.user_id_sub', $userId)
                                ->where('subscribers.is_confirmed', true)
                                ->where('publications.is_main',false)
                                ->where('publications.is_topic',false)
                                ->whereRaw('subscribers.user_id = publications.user_id');
                        });
                    });
            })
//            ->where(function($query){
//                $query->whereNotExists(function($query)
//                {
//                    $query->select(DB::raw('id'))
//                        ->from('place_publications')
//                        ->whereRaw('place_publications.publication_id = publications.id');
//                });
//            })
//            ->where(function($query){
//                $query->whereNotExists(function($query)
//                {
//                    $query->select(DB::raw('id'))
//                        ->from('group_publications')
//                        ->whereRaw('group_publications.publication_id = publications.id');
//                });
//            })
            ->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
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

    public static function getUserPublication($offset,$limit,$userId)
    {
        $publications = Publication::with(['videos', 'images', 'user'])
            ->where('publications.user_id', $userId)
            ->where('publications.is_main', false)
            ->where('publications.is_anonym', false)
            ->where(function($query){
                $query->whereNotExists(function($query)
                {
                    $query->select(DB::raw('id'))
                        ->from('place_publications')
                        ->whereRaw('place_publications.publication_id = publications.id');
                });
            })
            ->where(function($query){
                $query->whereNotExists(function($query)
                {
                    $query->select(DB::raw('id'))
                        ->from('group_publications')
                        ->whereRaw('group_publications.publication_id = publications.id');
                });
            })->orderBy('id', 'desc')
            ->skip($offset)->take($limit)->get();
        foreach ($publications as &$publication) {
            $publication_comments = $publication->comments()
                ->with(['images', 'videos', 'user'])
                ->orderBy('id', 'desc')
                ->take(3)
                ->get();

            foreach ($publication_comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
            $publication_comments = $publication_comments->toArray();
            $publication->comments = array_reverse($publication_comments);
            $publication->user_like = $publication->likes()->where('user_id', Auth::id())->first() != null;
            $publication->comment_count = $publication->comments()->count();
        }
        return $publications;
    }

    public static function show($id)
    {
        if ($publication = Publication::with(['videos', 'group', 'images', 'place'])->find($id)) {
            $publication->user_like = $publication->likes()->where('user_id', Auth::id())->first() != null;
            $publication->comment_count = $publication->comments()->count();
            $publication->like_count = $publication->likes()->count();
            $group = $publication->group->toArray();
            $user = $publication->user->toArray();
            $publication->is_blick_parent = false;
            if (!$group == []) {
                $grou = $group[0];
                if ($grou['is_open'] == false) {
                    $publication->is_blick_parent = true;
                }
            }
            if (!$user == []) {
                if ($user['is_private'] == true) {
                    $publication->is_blick_parent = true;
                }
            }
            if (!$publication->is_anonym) {
                $publication->user;
            }

            $publication_comments = $publication->comments()
                ->with(['images', 'videos', 'user'])
                ->orderBy('id', 'desc')
                ->take(3)
                ->get();

            foreach ($publication_comments as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }

            $publication_comments = $publication_comments->toArray();
            $publication->comments = array_reverse($publication_comments);
            return $publication;
        } else {
            $Data = [
                "status" => false,
                "error" => [
                    'message' => 'Incorrect id',
                    'code' => '1'
                ]
            ];
            return response()->json($Data);
        }
    }

    public static function getCountUserPublication($userId)
    {
        $publications_count = Publication::where('publications.user_id', $userId)
            ->where('publications.is_anonym', false)
            ->where(function ($query) {
                $query->whereNotExists(function ($query) {
                    $query->select(DB::raw('id'))
                        ->from('place_publications')
                        ->whereRaw('place_publications.publication_id = publications.id');
                });
            })
            ->where(function ($query) {
                $query->whereNotExists(function ($query) {
                    $query->select(DB::raw('id'))
                        ->from('group_publications')
                        ->whereRaw('group_publications.publication_id = publications.id');
                });
            })->count();
        return $publications_count;
    }
}