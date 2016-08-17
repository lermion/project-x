<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Comment;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class CommentsController extends Controller
{
    public function index()
    {
        $comments = Comment::select('publications.id as publication_id', 'publications.text as publications','comments.text as text','users.login as login','comments.id','users.id as user_id')
            ->join('publication_comments','publication_comments.comment_id','=', 'comments.id')
            ->join('users','comments.user_id','=','users.id')
            ->join('publications','publication_comments.publication_id','=','publications.id')
            ->where('comments.text','!=','Comment delete')
            ->paginate(25);
        return view('admin.comments.index')->with('comments', $comments);
    }

    public function delete_comment($id)
    {
        $comment = Comment::find($id);
        $comment->text = 'Comment delete';
        $comment->save();
        return redirect('admin/comments/');
    }
}
