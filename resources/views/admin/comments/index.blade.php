@extends('admin.layout')

@section('content')

	<div class="x_content moderator-comments">
		<table class="table table-bordered">
	    <thead>
	      <tr>
	        <th class="col-comments-place">Где оставлен?</th>
	        <th class="col-comments-text">Текст комментария</th>
	        <th class="col-comments-author">Автор</th>
	        <th class="col-comments-action">Действия</th>
	      </tr>
	    </thead>
	    <tbody>
        @foreach($comments as $comment)
	      <tr>
	        <td>{{$comment->publications}}</td>
	        <td>{{$comment->text}} </td>
	        <td>{{$comment->login}}</td>
	        <td>
                <p><a href="/admin/comments/delete_comment/{{$comment->id}}"><button class="btn btn-danger">Удалить</button></p>
	        </td>
	      </tr>
        @endforeach
	    </tbody>
	  </table>
	</div>

@stop
