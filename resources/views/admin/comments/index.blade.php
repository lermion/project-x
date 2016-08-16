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
	    </tbody>
	  </table>
	</div>

@stop
