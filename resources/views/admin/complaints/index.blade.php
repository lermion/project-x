@extends('admin.layout')

@section('content')

	<div class="x_content">
        <div class="complains-menu">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 col-md-offset-3 active"><a href="#">Публикации (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="#">Комментарии (<span>10</span>)</a></li>
            </ul>
        </div>
        <div class="moderator-complaints">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Текст</th>
                    <th>Автор</th>
                    <th>Картинки</th>
                    <th>Кто пожаловался</th>
                    <th>Жалобы</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($complaints as $complaint)
                  <tr>
                    <td>{{$complaint->id}}</td>
                    <td>{{$complaint->comment}}</td>
                    <td>{{$complaint->user_to_login}}</td>
                    <td>{{$complaint->user_which_login}}</td>
                    <td>{{$complaint->complaint}}</td>
                    <td class="admin-user-contacts-action">
                        <p><a href="/admin/complaints/delete_complaint_comment/{{$complaint->id}}"><button class="btn btn-success btn-xs">Отменить жалобу</button></p>
                        <p><a href="/admin/complaints/delete_comment/{{$complaint->id}}"><button class="btn btn-danger btn-xs">Блокировать контент</button></p>
                    </td>
                  </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>

@stop
