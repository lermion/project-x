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
            ->where(['is_block'=>false,'is_topic'=>false,'is_moderate'=>false,'to_note'=>false])
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.index',['publications'=>$publications, 'url'=>'New']);
    }

    public function getIsTopicPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_topic',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.index',['publications'=>$publications, 'url'=>'Topic']);
    }

    public function getIsBlockPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_block',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.index',['publications'=>$publications, 'url'=>'Block']);
    }

    public function getIsMainPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where(['is_main'=>true,'is_moderate'=>true])
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.index',['publications'=>$publications, 'url'=>'Main']);
    }

    public function getIsModeratePublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_moderate',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.index',['publications'=>$publications, 'url'=>'Moderate']);
    }

    public function getToNotePublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('to_note',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.index',['publications'=>$publications, 'url'=>'Note']);
    }

    public function mainPublications($id)
    {
        $publication = Publication::find($id);
        $publication->is_main = true;
        $publication->is_moderate = true;
        $publication->save();
        return redirect('/admin/moderation/')->with('message', 'Публикация на главной');
    }

    public function topic($id){
        $publications = Publication::where('is_topic',true)->get();
        if ($publications) {
            foreach ($publications as &$publicat){
                $publicat->is_topic = false;
                $publicat->save();
            }
        }
        $publication = Publication::find($id);
        $publication->is_topic = true;
        $publication->is_moderate = true;
        $publication->save();
        return redirect('/admin/moderation/')->with('message', 'Публикация в топе');
    }

    public function blockPublication($id)
    {
        $publication = Publication::find($id);
        $publication->is_block = true;
        //$publication->block_message = $request->input('message');
        $publication->save();
        return redirect('/admin/moderation/')->with('message', 'Публикация заблокированна');
    }

    public function confirmPublication($id){
        $publication = Publication::find($id);
        $publication->is_moderate = true;
        $publication->save();
        return redirect('/admin/moderation/')->with('message', 'Публикация подтвержденна');
    }

    public function notePublication($id){
        $publication = Publication::find($id);
        $publication->to_note = true;
        $publication->save();
        return redirect('/admin/moderation/')->with('message', 'Публикация на заметке');
    }

    public function groups()
    {
        $groups = Group::with('users','creator')
            ->where(['is_block'=>false,'is_moderate'=>false,'to_note'=>false])
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.groups',['groups'=>$groups, 'url'=>'New']);
    }

    public function getIsBlockGroups()
    {
        $groups = Group::with('users','creator')
            ->where('is_block',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.groups',['groups'=>$groups, 'url'=>'Block']);
    }

    public function getToNoteGroups()
    {
        $groups = Group::with('users','creator')
            ->where('to_note',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.groups',['groups'=>$groups, 'url'=>'Note']);
    }

    public function blockGroup($id)
    {
        $group = Group::find($id);
        $group->is_block = true;
        //$group->block_message = $request->input('message');
        $group->save();
        return redirect('/admin/moderation/groups')->with('message', 'Группа заблокированна');
    }

    public function confirmGroup($id){
        $group = Group::find($id);
        $group->is_moderate = true;
        $group->save();
        return redirect('/admin/moderation/groups')->with('message', 'Группа подтвержденна');
    }

    public function noteGroup($id){
        $group = Group::find($id);
        $group->to_note = true;
        $group->save();
        return redirect('/admin/moderation/groups')->with('message', 'Группа на заметке');
    }

    public function places()
    {
        $places = Place::with('users','creator')
            ->where(['is_block'=>false,'is_moderate'=>false,'to_note'=>false])
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.places',['places'=>$places,'url'=>'New']);
    }

    public function getIsBlockPlaces()
    {
        $places = Place::with('users','creator')
            ->where('is_block',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.places',['places'=>$places,'url'=>'Block']);
    }

    public function getToNotePlaces()
    {
        $places = Place::with('users','creator')
            ->where('to_note',true)
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        return view('admin.moderation.places',['places'=>$places,'url'=>'Note']);
    }

    public function blockPlace($id)
    {
        $place = Place::find($id);
        $place->is_block = true;
        //$group->block_message = $request->input('message');
        $place->save();
        return redirect('/admin/moderation/places')->with('message', 'Место заблокированна');
    }

    public function confirmPlace($id){
        $place = Place::find($id);
        $place->is_moderate = true;
        $place->save();
        return redirect('/admin/moderation/places')->with('message', 'Место подтвержденна');
    }

    public function notePlace($id){
        $place = Place::find($id);
        $place->to_note = true;
        $place->save();
        return redirect('/admin/moderation/places')->with('message', 'Место на заметке');
    }
}
