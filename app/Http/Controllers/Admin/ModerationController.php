<?php

namespace App\Http\Controllers\Admin;

use App\Group;
use App\Place;
use App\Publication;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ModerationController extends Controller
{
    public function index()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where(['is_block'=>false,'is_topic'=>false,'is_moderate'=>false])
            ->paginate(25);
        return view('admin.moderation.index')->with('publications',$publications);
    }

    public function getIsTopicPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_topic',true)
            ->paginate(25);
        return view('admin.moderation.index')->with('publications',$publications);
    }

    public function getIsBlockPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_block',true)
            ->paginate(25);
        return view('admin.moderation.index')->with('publications',$publications);
    }

    public function topic($id){
        $publications = Publication::where('is_topic',true)->get();
        if ($publications) {
            foreach ($publications as &$p){
                $p->is_topic = false;
                $p->save();
            }
        }
        $publication = Publication::find($id);
        $publication->is_topic = true;
        $publication->save();
        return redirect('/admin/moderation/')->with('message', 'Публикация на главной');
    }

    public function groups()
    {
        $groups = Group::with('users','creator')
            ->where(['is_block'=>false,'is_moderate'=>false])
            ->paginate(25);
        return view('admin.moderation.groups')->with('groups',$groups);
    }

    public function getIsBlockGroups()
    {
        $groups = Group::with('users','creator')
            ->where('is_block',true)
            ->paginate(25);
        return view('admin.moderation.groups')->with('groups',$groups);
    }

    public function places()
    {
        $places = Place::with('users','creator')
            ->where(['is_block'=>false,'is_moderate'=>false])
            ->paginate(25);
        return view('admin.moderation.places')->with('places',$places);
    }

    public function getIsBlockPlaces()
    {
        $places = Place::with('users','creator')
            ->where('is_block',true)
            ->paginate(25);
        return view('admin.moderation.places')->with('places',$places);
    }
}
