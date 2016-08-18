@extends('admin.layout')


@section('content')


	<div class="x_content">
        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-3 active"><a href="/admin/lock/">Пользователи </a></li>
                <li class="col-md-3"><a href="/admin/lock/publications/">Публикации </a></li>
                <li class="col-md-3"><a href="/admin/lock/groups/">Группы </a></li>
                <li class="col-md-3"><a href="/admin/lock/places/">Места </a></li>
            </ul>
        </div>

        <div class="to-delete-groups">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-description">Описание группы</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-name">Название группы</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-action">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($groups as $group)
                  <tr>
                    <td><a href="">{{$group->id}}</a></td>
                    <td>{{$group->description}}</td>
                    <td>{{$group->user_id}}</td>
                    <td>{{$group->name}}</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>{{$group->created_at}}</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-xs">Восстановить</button>
                        <button class="btn btn-danger btn-xs deleteConfirm-del">Удалить</button>
                    </td>
                  </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="admin-delete-btn">
            <button class="btn btn-danger  deleteConfirm-del">Удалить все</button>
        </div>
    </div>

    <script>
        $(".deleteConfirm-del").click(function(event) {
            var c = confirm("Вы действительно хотите удалить?");
            console.log(c);
            if(!c) {
                event.preventDefault();
                return false;
            }
        })
    </script>
    {!! $groups->render() !!}
@stop