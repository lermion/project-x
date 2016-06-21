<?php

namespace App\Http\Controllers;

use App\Group;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\Auth;

class GroupPublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $group = Group::with(['publications','publications.group','publications.user','publications.videos', 'publications.images', 'publications.comments' => function ($query) {
            $query->take(3);
        }, 'publications.comments.images', 'publications.comments.videos', 'publications.comments.user'])
            ->find($id);
        //return $group;
        $publications = $group->publications;
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
        //
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
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
