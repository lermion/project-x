<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class Publication extends Model
{
    protected $fillable = ['in_profile', 'block_message', 'is_block', 'text', 'is_anonym', 'is_main', 'user_id', 'is_block', 'block_message', 'cover', 'original_cover', 'is_moderate'];

    public function images()
    {
        return $this->belongsToMany('App\Image', 'publication_images')->withPivot('is_cover')->withTimestamps();
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
        return $this->belongsToMany('App\Video', 'publication_videos')->withPivot('is_cover')->withTimestamps();
    }

    public function scopes()
    {
        return $this->belongsToMany('App\Scope', 'scope_publications')->withTimestamps();
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($publication) { // before delete() method call this
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

    public static function getMainPublication($offset, $limit, $userId = null)
    {
        $moderate_publication = Option::pluck('moderate_publication');
        if ($moderate_publication[0] == 1) {
            $user = User::find(Auth::id());
            $scopes = $user->scopes()->pluck('scopes.id');
            $all_scope = 0;
            foreach ($scopes as $scope) {
                if ($scope == 1) $all_scope++;
            }
            if ($all_scope == 1) {
                $publications = Publication::with(['user', 'videos', 'images', 'group', 'place'])
                    ->where(['is_topic' => true])
                    ->orWhere(function ($query) use ($userId) {
                        $query->where(function ($q) {
                            $q->where(['is_main' => true]);
                            $q->orWhere(['user_id' => Auth::id(), 'in_profile' => false]);
                        })
                            ->orWhere(function ($query) use ($userId) {
                                $query->whereExists(function ($query) use ($userId) {
                                    $query->select(DB::raw('subscribers.user_id'))
                                        ->from('subscribers')
                                        ->where('subscribers.user_id_sub', $userId)
                                        ->where('subscribers.is_confirmed', true)
                                        ->where('publications.is_main', false)
                                        ->where('publications.is_topic', false)
                                        ->whereRaw('subscribers.user_id = publications.user_id');
                                });
                            });
                    })
                    ->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
            } else {
                $all = [];
                foreach ($scopes as $scope) {
                    $publication = Publication::with(['user', 'videos', 'images', 'group', 'place', 'scopes'])
                        ->where(function ($query) use ($userId) {
                            $query->where(['is_topic' => true])
                                ->orWhere(function ($query) use ($userId) {
                                    $query->where(function ($q) {
                                        $q->where(['is_main' => true]);
                                        $q->orWhere(['user_id' => Auth::id(), 'in_profile' => false]);
                                    })
                                        ->orWhere(function ($query) use ($userId) {
                                            $query->whereExists(function ($query) use ($userId) {
                                                $query->select(DB::raw('subscribers.user_id'))
                                                    ->from('subscribers')
                                                    ->where('subscribers.user_id_sub', $userId)
                                                    ->where('subscribers.is_confirmed', true)
                                                    ->where('publications.is_main', false)
                                                    ->where('publications.is_topic', false)
                                                    ->whereRaw('subscribers.user_id = publications.user_id');
                                            });
                                        });
                                });
                        })->where(function ($query) use ($scope) {
                            $query->whereHas('scopes', function ($query) use ($scope) {
                                $query->where('scopes.id', $scope);
                            })->orWhereHas('scopes', function ($query) use ($scope) {
                                $query->where('scopes.id', 1);
                            });
                        })
                        ->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
                    $all[] = $publication;
                }
                $publications = [];
                foreach ($all as $array) {
                    foreach ($array as $one) {
                        $publications[] = $one;
                    }
                }
                return $publications;
            }
        } else {
            $user = User::find(Auth::id());
            $scopes = $user->scopes()->pluck('scopes.id');
            $all_scope = 0;
            foreach ($scopes as $scope) {
                if ($scope == 1) $all_scope++;
            }
            if ($all_scope == 1) {
                $publications = Publication::with(['user', 'videos', 'images', 'group', 'place'])
                    ->where(['is_topic' => true])
                    ->orWhere(function ($query) use ($userId) {
                        $query->where(function ($q) {
                            $q->where(['is_main' => true]);
                            $q->where(function ($quer) {
                                $quer->where('is_moderate', true);
                                $quer->orWhere(['user_id' => Auth::id(), 'in_profile' => false]);
                            });
                        })
                            ->orWhere(function ($query) use ($userId) {
                                $query->whereExists(function ($query) use ($userId) {
                                    $query->select(DB::raw('subscribers.user_id'))
                                        ->from('subscribers')
                                        ->where('subscribers.user_id_sub', $userId)
                                        ->where('subscribers.is_confirmed', true)
                                        ->where('publications.is_main', false)
                                        ->where('publications.is_topic', false)
                                        ->whereRaw('subscribers.user_id = publications.user_id');
                                });
                            });
                    })
                    ->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
            } else{
                $all = [];
                foreach ($scopes as $scope) {
                    $publication = Publication::with(['user', 'videos', 'images', 'group', 'place','scopes'])
                        ->where(function ($query) use ($userId) {
                            $query->where(['is_topic' => true])
                                ->orWhere(function ($query) use ($userId) {
                                    $query->where(function ($q) {
                                        $q->where(['is_main' => true]);
                                        $q->where(function ($quer) {
                                            $quer->where('is_moderate', true);
                                            $quer->orWhere(['user_id' => Auth::id(), 'in_profile' => false]);
                                        });
                                    })
                                        ->orWhere(function ($query) use ($userId) {
                                            $query->whereExists(function ($query) use ($userId) {
                                                $query->select(DB::raw('subscribers.user_id'))
                                                    ->from('subscribers')
                                                    ->where('subscribers.user_id_sub', $userId)
                                                    ->where('subscribers.is_confirmed', true)
                                                    ->where('publications.is_main', false)
                                                    ->where('publications.is_topic', false)
                                                    ->whereRaw('subscribers.user_id = publications.user_id');
                                            });
                                        });
                                });
                        })->where(function ($query) use ($scope) {
                            $query->whereHas('scopes', function ($query) use ($scope) {
                                $query->where('scopes.id', $scope);
                            })->orWhereHas('scopes', function ($query) use ($scope) {
                                $query->where('scopes.id', 1);
                            });
                        })
                        ->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
                    $all[] = $publication;
                }
                $publications = [];
                foreach ($all as $array) {
                    foreach ($array as $one) {
                        $publications[] = $one;
                    }
                }
            }
        }
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
        foreach ($publications as &$publication) {
            //$publication->comments = $publication->comments()->with(['images', 'videos', 'user'])->orderBy('id', 'desc')->take(3)->toArray();
            $publication_coment = $publication->comments()->with(['images', 'videos', 'user'])->orderBy('id', 'desc')->take(3)->get();
            foreach ($publication_coment as &$comment) {
                $comment->like_count = $comment->likes()->count();
            }
            $publication_coment = $publication_coment->toArray();
            $publication->comments = array_reverse($publication_coment);
            $publication->like_count = $publication->likes()->count();
            if (Auth::check())
                $publication->user_like = $publication->likes()->where('user_id', Auth::id())->first() != null;
            $publication->comment_count = $publication->comments()->count();
            if (!$publication->is_anonym) {
                $publication->user;
            }
        }
        return $publications;
    }

    public static function getUserPublication($offset, $limit, $userId)
    {
        $user = User::find(Auth::id());
        $scopes = $user->scopes()->pluck('scopes.id');
        $all_scope = 0;
        foreach ($scopes as $scope) {
            if ($scope == 1) $all_scope++;
        }
        if ($all_scope == 1) {
            $publications = Publication::with(['videos', 'images', 'user', 'scopes'])
                ->where('publications.user_id', $userId)
                //->where('publications.is_main', false)
                ->where('publications.is_anonym', false)
                ->where(function ($query) {
                    $query->where('publications.is_main', false);
                    $query->orWhere(['publications.user_id' => Auth::id(), 'publications.in_profile' => true]);
                })
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
                })->orderBy('id', 'desc')
                ->skip($offset)->take($limit)->get();
        } else {
            $all = [];
            foreach ($scopes as $scope) {
                $publication = Publication::with(['videos', 'images', 'user', 'scopes'])
                    ->where(function ($query) use ($scope) {
                        $query->whereHas('scopes', function ($query) use ($scope) {
                            $query->where('scopes.id', $scope);
                        })->orWhereHas('scopes', function ($query) use ($scope) {
                            $query->where('scopes.id', 1);
                        });
                    })
                    ->where('publications.user_id', $userId)
                    //->where('publications.is_main', false)
                    ->where('publications.is_anonym', false)
                    ->where(function ($query) {
                        $query->where('publications.is_main', false);
                        $query->orWhere(['publications.user_id' => Auth::id(), 'publications.in_profile' => true]);
                    })
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
                    })->orderBy('id', 'desc')
                    ->skip($offset)->take($limit)->get();
                $all[] = $publication;
            }
            $publications = [];
            foreach ($all as $array) {
                foreach ($array as $one) {
                    $publications[] = $one;
                }
            }
        }
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
            $publication->like_count = $publication->likes()->count();
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