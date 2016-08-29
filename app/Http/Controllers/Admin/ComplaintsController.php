<?php

namespace App\Http\Controllers\Admin;

use App\ComplaintComment;
use App\Comment;
use App\ComplaintPublication;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ComplaintsController extends Controller
{
    public function index()
    {
        $complaints = ComplaintPublication::select('users.login as user_to_login','u.login as user_which_login','publications.text as publication','complaint_categories.name as complaint', 'complaint_publications.id as id')
            ->join('publications','publications.id','=', 'complaint_publications.publication_id')
            ->join('users','complaint_publications.user_to_id','=','users.id')
            ->join('users as u','complaint_publications.user_which_id','=','u.id')
            ->join('complaint_categories','complaint_publications.complaint_category_id','=','complaint_categories.id')
            ->paginate(25);
        return view('admin.complaints.index',['complaints'=>$complaints,'url'=>'Publication']);
    }

    public function delete_complaint_comment($id)
    {
        ComplaintComment::find($id)->delete();
        return redirect('admin/complaints/comments')->with('message', 'Жалоба отменена');
    }

    public function delete_comment($id)
    {
        $id_comment = ComplaintComment::where('id',$id)->pluck('comment_id');
        $comment = Comment::find($id_comment);
        $comment->text = 'Comment delete';
        $comment->save();
        ComplaintComment::find($id)->delete();
        return redirect('admin/complaints/comments')->with('message', 'Комментарий удален');
    }

    public function comments()
    {
        $complaints = ComplaintComment::select('users.login as user_to_login','u.login as user_which_login','comments.text as comment','complaint_categories.name as complaint', 'complaint_comments.id as id')
            ->join('comments','comments.id','=', 'complaint_comments.comment_id')
            ->join('users','complaint_comments.user_to_id','=','users.id')
            ->join('users as u','complaint_comments.user_which_id','=','u.id')
            ->join('complaint_categories','complaint_comments.complaint_category_id','=','complaint_categories.id')
            ->paginate(25);
        return view('admin.complaints.index',['complaints'=>$complaints,'url'=>'Comments']);
    }

    public function delete_complaint_publication($id)
    {
        ComplaintPublication::find($id)->delete();
        return redirect('admin/complaints/')->with('message', 'Жалоба отменена');
    }

    public function delete_publication($id)
    {

    }

    public function count_complaint_comment(){
        $complaint_comment = ComplaintComment::count();
        return response()->json(['status' => true, 'complaint_comment' => $complaint_comment]);
    }

    public function count_complaint_publication(){
        $complaint_publication = ComplaintPublication::count();
        return response()->json(['status' => true, 'complaint_publication' => $complaint_publication]);
    }
}
