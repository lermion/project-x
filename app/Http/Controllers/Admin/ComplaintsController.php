<?php

namespace App\Http\Controllers\Admin;

use App\ComplaintComment;
use App\Comment;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class ComplaintsController extends Controller
{
    public function index()
    {
        $complaints = ComplaintComment::select('users.login as user_to_login','u.login as user_which_login','comments.text as comment','complaint_categories.name as complaint', 'complaint_comments.id as id')
            ->join('comments','comments.id','=', 'complaint_comments.comment_id')
            ->join('users','complaint_comments.user_to_id','=','users.id')
            ->join('users as u','complaint_comments.user_which_id','=','u.id')
            ->join('complaint_categories','complaint_comments.complaint_category_id','=','complaint_categories.id')
            ->get();
        return view('admin.complaints.index')->with('complaints', $complaints);
    }

    public function delete_complaint_comment($id)
    {
        ComplaintComment::find($id)->delete();
        return redirect('admin/complaints/');
    }

    public function delete_comment($id)
    {
        $id_comment = ComplaintComment::where('id',$id)->pluck('comment_id');
        $comment = Comment::find($id_comment);
        $comment->text = 'Comment delete';
        $comment->save();
        ComplaintComment::find($id)->delete();
        return redirect('admin/complaints/');
    }
}
