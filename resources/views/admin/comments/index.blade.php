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
<<<<<<< HEAD
	        <td>{{$comment->publications}}</td>
	        <td>{{$comment->text}} </td>
	        <td>{{$comment->login}}</td>
	        <td>
                <p><a href="/admin/comments/delete_comment/{{$comment->id}}"><button class="btn btn-danger">Удалить</button></p>
	        </td>
	      </tr>
        @endforeach
=======
	        <td><a href="">Название</a></td>
	        <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
	        <td><a href="">Елена Новикова</a></td>
	        <td class="text-center">
	        	<button class="btn btn-danger btn-xs">Удалить</button>
	        </td>
	      </tr>
          <tr>
            <td><a href="">Название</a></td>
            <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
            <td><a href="">Елена Новикова</a></td>
            <td class="text-center">
                <button class="btn btn-danger btn-xs">Удалить</button>
            </td>
          </tr>
          <tr>
            <td><a href="">Название</a></td>
            <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
            <td><a href="">Елена Новикова</a></td>
            <td class="text-center">
                <button class="btn btn-danger btn-xs">Удалить</button>
            </td>
          </tr>
          <tr>
            <td>Название</td>
            <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
            <td>Елена Новикова</td>
            <td class="text-center">
                <button class="btn btn-danger btn-xs">Удалить</button>
            </td>
          </tr>
>>>>>>> a33b68350c3f23497d2a469ed001f87d7acc58d9
	    </tbody>
	  </table>
	</div>

@stop
