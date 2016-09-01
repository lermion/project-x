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
            <td><p><a href="/p/{{$comment->publication_id}}/{{md5($comment->publication_id)}}">Публикация:</a></p>{{$comment->publications}}</td>
            <td>{{$comment->text}}</td>
            <td><a href="/admin/user/show/{{$comment->user_id}}">{{$comment->login}}</a></td>
            <td class="text-center">
                <p><a href="/admin/comments/delete_comment/{{$comment->id}}"><button class="btn btn-danger btn-xs deleteConfirm">Удалить</button></p>
            </td>
          </tr>
        @endforeach
	    </tbody>
	  </table>
	</div>
	{!! $comments->render() !!}
	<script>
		$(".deleteConfirm").click(function(event) {
			var c = confirm("Вы действительно хотите удалить комментарий?");
			console.log(c);
			if(!c) {
				event.preventDefault();
				return false;
			}
		})
	</script>
@stop
