<?php

namespace App\Http\Controllers\Admin;

use App\Group;
use App\Place;
use App\Publication;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class LockContentController extends Controller
{
    public function getLockPlaces()
    {
        $places = Place::with('users','publications')
            ->where('is_block',true)
            ->get();
        return response()->json(['status' => true, 'places'=>$places]);
    }

    public function unlockPlace($id)
    {
        $place = Place::find($id);
        $place->is_block = false;
        $place->block_message = '';
        $place->save();
        return response()->json(['status' => true]);
    }

    public function destroyPlace($id)
    {
        Place::destroy($id);
        return response()->json(['status' => true]);
    }

    public function getLockGroups()
    {
        $group = Group::with('users','publications')
            ->where('is_block',true)
            ->get();
        return response()->json(['status' => true, 'groups'=>$group]);
    }


    public function unlockGroup($id)
    {
        $group = Group::find($id);
        $group->is_block = false;
        $group->block_message = '';
        $group->save();
        return response()->json(['status' => true]);
    }

    public function destroyGroup($id)
    {
        Group::destroy($id);
        return response()->json(['status' => true]);
    }

    public function getLockPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_block',true)
            ->get();
        return response()->json(['status' => true, 'publications'=>$publications]);
    }

    public function unlockPublication($id)
    {
        $publication = Publication::find($id);
        $publication->is_block = false;
        $publication->block_message = '';
        $publication->save();
        return response()->json(['status' => true]);
    }

    public function destroyPublication($id)
    {
        Publication::destroy($id);
        return response()->json(['status' => true]);
    }
}
