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
                  <tr>
                    <td>1</td>
                    <td>Публикация 123</td>
                    <td>Елена Новикова</td>
                    <td class="mini-image">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>John Doe</td>
                    <td>Спам</td>
                    <td class="admin-user-contacts-action">
                        <button class="btn btn-success btn-xs">Отменить жалобу</button>
                        <button class="btn btn-danger btn-xs">Блокировать контент</button>
                    </td>
                  </tr>
                <!--  @foreach($complaints as $complaint)
                  <tr>
                    <td>{{$complaint->id}}</td>
                    <td>{{$complaint->comment}}</td>
                    <td>{{$complaint->user_to_login}}</td>
                    <td>{{$complaint->user_which_login}}</td>
                    <td>{{$complaint->complaint}}</td>
                    <td class="admin-user-contacts-action">
                        <p>
                            <a href="/admin/complaints/delete_complaint_comment/{{$complaint->id}}"><button class="btn btn-success btn-xs">Отменить жалобу</button></a>
                        </p>
                        <p>
                            <a href="/admin/complaints/delete_comment/{{$complaint->id}}"><button class="btn btn-danger btn-xs">Блокировать контент</button></a>
                        </p>
                        </td>
                  </tr>
                @endforeach -->
                </tbody>
            </table>
        </div>
    </div>

@stop
