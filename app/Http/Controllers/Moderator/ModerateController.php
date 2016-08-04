<?php

namespace App\Http\Controllers\Moderator;

use App\Comment;
use App\ComplaintPublication;
use App\ComplaintComment;
use App\Group;
use App\Place;
use App\Publication;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ModerateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPublication()
    {
        $publications = Publication::with('user','images','videos','group')
//            ->where(['is_moderate'=>false,'is_main'=>false, 'is_block'=>false])
            ->where('is_block',false)
            ->get();
        $data = [];
        foreach ($publications as $publication){
            if(count($publication->group)==0){
                $data[] = $publication;
            }elseif ($publication->group[0]->is_open){
                $data[] = $publication;
            }
        }
        //return view('moderator.moderate.index',['publications'=>$data]);
        return response()->json(['status' => true, 'publications'=>$data]);
    }

    public function blockPublication(Request $request,$id)
    {
        $publication = Publication::find($id);
        $publication->is_block = true;
        $publication->block_message = $request->input('message');
        $publication->save();
        //return redirect()->action('Moderator\ModerateController@getPublication');
        return response()->json(['status' => true]);
    }

    public function confirmPublication($id){
        $publication = Publication::find($id);
        $publication->is_moderate = true;
        $publication->save();
        //return redirect()->action('Moderator\ModerateController@getPublication');
        return response()->json(['status' => true]);
    }

    public function getGroups()
    {
        $groups = Group::with('users','publications')
            ->where(['is_moderate'=>false, 'is_block'=>false])
            ->get();
        return response()->json(['status' => true, 'groups'=>$groups]);
    }

    public function blockGroup(Request $request,$id)
    {
        $group = Group::find($id);
        $group->is_block = true;
        $group->block_message = $request->input('message');
        $group->save();
        return response()->json(['status' => true]);
    }

    public function confirmGroup($id){
        $group = Group::find($id);
        $group->is_moderate = true;
        $group->save();
        return response()->json(['status' => true]);
    }

    public function getPlaces()
    {
        $places = Place::with('users','publications')
            ->where(['is_moderate'=>false, 'is_block'=>false])
            ->get();
        return response()->json(['status' => true, 'groups'=>$places]);
    }

    public function blockPlace(Request $request,$id)
    {
        $place = Place::find($id);
        $place->is_block = true;
        $place->block_message = $request->input('message');
        $place->save();
        return response()->json(['status' => true]);
    }

    public function confirmPlace($id){
        $place = Place::find($id);
        $place->is_moderate = true;
        $place->save();
        return response()->json(['status' => true]);
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
        //return redirect()->action('Moderator\ModerateController@getPublication');
        return response()->json(['status' => true]);
    }

    public function comments(){
        $comments = Comment::select('publications.text as publications_text','comments.text','users.login')
            ->join('publication_comments','publication_comments.comment_id','=', 'comments.id')
            ->join('users','comments.user_id','=','users.id')
            ->join('publications','publication_comments.publication_id','=','publications.id')
            ->get();
        return response()->json(['status' => true, 'comments' => $comments]);
    }

    public function delete_comment($id){
        $comment = Comment::where('id',$id)->first();
        $comment->text = 'Comment delete';
        $comment->save();
        return response()->json(['status' => true]);
    }

    public function comment_complaints(){
        $complaints = ComplaintComment::select('users.login as user_to_login','u.login as user_which_login','comments.text as comment','complaint_categories.name as complaint')
            ->join('comments','comments.id','=', 'complaint_comments.comment_id')
            ->join('users','complaint_comments.user_to_id','=','users.id')
            ->join('users as u','complaint_comments.user_which_id','=','u.id')
            ->join('complaint_categories','complaint_comments.complaint_category_id','=','complaint_categories.id')
            ->get();
            return response()->json(['status' => true, 'complaints' => $complaints]);
    }

    public function publication_complaints(){
        $complaints = ComplaintPublication::select('users.login as user_to_login','u.login as user_which_login','publications.text as publication','complaint_categories.name as complaint')
            ->join('publications','publications.id','=', 'complaint_publications.publication_id')
            ->join('users','complaint_publications.user_to_id','=','users.id')
            ->join('users as u','complaint_publications.user_which_id','=','u.id')
            ->join('complaint_categories','complaint_publications.complaint_category_id','=','complaint_categories.id')
            ->get();
            return response()->json(['status' => true, 'complaints' => $complaints]);
    }

    public function delete_complaint_comment($id){
        ComplaintComment::first($id)->delete();
        return response()->json(['status' => true]);
    }

    public function delete_complaint_publication($id){
        ComplaintPublication::first($id)->delete();
        return response()->json(['status' => true]);
    }

}
