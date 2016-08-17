@extends('admin.layout')

@section('content')

	<div class="x_content">
        <div class="complains-menu">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 col-md-offset-3 active"><a href="{{action('Admin\ComplaintsController@index')}}">Публикации</a></li>
                <li class="col-md-3"><a href="{{action('Admin\ComplaintsController@comments')}}">Комментарии</a></li>
            </ul>
        </div>
        <div class="moderator-complaints">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-text">Текст</th>
                    <th class="col-author">Автор</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-who">Кто пожаловался</th>
                    <th class="col-complains">Жалобы</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($complaints as $complaint)
                  <tr>
                    <td>{{$complaint->id}}</td>
                      @if ($complaint->comment)
                          <td><p>Комментарий:</p>{{$complaint->comment}}</td>
                      @else
                          <td><p>Публикация:</p>{{$complaint->publication}}</td>
                      @endif
                    <td>{{$complaint->user_to_login}}</td>
                    <td class="mini-image">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>{{$complaint->user_which_login}}</td>
                    <td>{{$complaint->complaint}}</td>
                    <td class="admin-user-contacts-action">
                        @if ($complaint->comment)
                            <a href="/admin/complaints/delete_complaint_comment/{{$complaint->id}}"><button class="btn btn-success btn-xs">Отменить жалобу</button></a>
                            <a href="/admin/complaints/delete_comment/{{$complaint->id}}"><button class="btn btn-danger btn-xs">Удалить комментарий</button></a>
                        @else
                            <a href="/admin/complaints/delete_complaint_publication/{{$complaint->id}}"><button class="btn btn-success btn-xs">Отменить жалобу</button></a>
                            <a href="#"><button class="btn btn-danger btn-xs">Блокировать контент</button></a>
                        @endif
                    </td>
                  </tr>

                @endforeach
                </tbody>
            </table>
        </div>
    </div>
    {!! $complaints->render() !!}
@stop
