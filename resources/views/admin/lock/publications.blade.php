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

        <div class="admin-user-content-publication to-del-publ">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-text">Текст публикации</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-action">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($publications as $publication)
                  <tr>
                    <td><a href="">{{$publication->id}}</a></td>
                    <td>{{$publication->text}}</td>
                    <td>{{$publication->user_id}}</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">

                    </td>
                    <td>видео</td>
                    <td>{{$publication->created_at}}</td>
                    <td class="text-center">
                        <a href="/admin/lock/unlock_publication/{{$publication->id}}"><button class="btn btn-success btn-xs">Восстановить</button></a>
                        <a href="/admin/lock/destroy_publication/{{$publication->id}}"><button class="btn btn-danger btn-xs deleteConfirm-del">Удалить</button></a>
                    </td>
                  </tr>
                  @endforeach
                </tbody>
            </table>
        </div>


        <div class="admin-delete-btn">
            <button class="btn btn-danger deleteConfirm-del">Удалить все</button>
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
    {!! $publications->render() !!}
@stop