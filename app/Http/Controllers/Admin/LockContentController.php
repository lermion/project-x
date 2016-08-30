<?php

namespace App\Http\Controllers\Admin;

use App\BlackList;
use App\Group;
use App\Place;
use App\Publication;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class LockContentController extends Controller
{
    public function index()
    {
        $users = User::where('is_block',true)->paginate(25);
        return view('admin.lock.index')->with('users',$users);
    }

    public function unlockUser($id)
    {
        $place = User::find($id);
        $place->is_block = false;
        $place->save();
        return redirect('/admin/lock/')->with('message', 'Пользователь восстановлен');
    }


    public function getLockPlaces()
    {
        $places = Place::with('users', 'creator')
            ->where('is_block',true)
            ->paginate(25);

        return view('admin.lock.places')->with('places',$places);
    }

    public function unlockPlace($id)
    {
        $place = Place::find($id);
        $place->is_block = false;
        $place->block_message = '';
        $place->save();
        return redirect('/admin/lock/places/')->with('message', 'Место восстановленно');
    }

    public function deletePlaces()
    {
        Place::where('is_block',true)->delete();
        return redirect('/admin/lock/places/')->with('message', 'Все удаленно');
    }

    public function destroyPlace($id)
    {
        Place::destroy($id);
        return redirect('/admin/lock/places/')->with('message', 'Место удаленно');
    }

    public function getLockGroups()
    {
        $groups = Group::with('users', 'creator')
            ->where('is_block',true)
            ->paginate(25);
        return view('admin.lock.groups')->with('groups',$groups);
    }


    public function unlockGroup($id)
    {
        $group = Group::find($id);
        $group->is_block = false;
        $group->block_message = '';
        $group->save();
        return redirect('/admin/lock/groups/')->with('message', 'Группа восстановленна');
    }

    public function destroyGroup($id)
    {
        Group::destroy($id);
        return redirect('/admin/lock/groups/')->with('message', 'Группа удаленна');
    }

    public function deleteGroups()
    {
        Group::where('is_block',true)->delete();
        return redirect('/admin/lock/groups/')->with('message', 'Все удаленно');
    }

    public function getLockPublications()
    {
        $publications = Publication::with('user','images','videos','group')
            ->where('is_block',true)
            ->paginate(25);
        return view('admin.lock.publications')->with('publications',$publications);
    }

    public function unlockPublication($id)
    {
        $publication = Publication::find($id);
        $publication->is_block = false;
        $publication->block_message = '';
        $publication->save();
        return redirect('/admin/lock/publications/')->with('message', 'Публикация восстановленна');
    }

    public function destroyPublication($id)
    {
        Publication::destroy($id);
        return redirect('/admin/lock/publications/')->with('message', 'Публикация удаленна');
    }

    public function deletePublications()
    {
        Publication::where('is_block',true)->delete();
        return redirect('/admin/lock/publications/')->with('message', 'Все удаленно');
    }

    public function destroy($id, $month)
    {
        $user = User::find($id);
        //dd($user);
        $timestamp = strtotime('+' . $month . ' month');
        $date = date('Y:m:d', $timestamp);
        BlackList::create(['phone' => $user->phone, 'date' => $date]);
//        $user->first_name = 'Пользователь';
//        $user->last_name = 'удален';
//        //$user->login = str_random(8);
//        //$user->phone = '';
//        $user->password = str_random(8);
//        $user->avatar_path = '/upload/avatars/no-avatar';
//        $user->status = 'Удален';
//        $user->original_avatar_path = '/upload/avatars/no-avatar';
//        $user->user_quote = '';
//        $user->is_private = true;
        $user->delete();
        return ['status'=>true];
    }
}
