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

    <div class="moderator-content-table groups">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-title">Название места</th>
                    <th class="col-cover">Обложка</th>
                    <th class="col-cover">Аватар</th>
                    <th class="col-author">Создатель</th>
                    <th class="col-count">Количество участников</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($places as $place)
                  <tr>
                    <td><a href="">{{$place->id}}</a></td>
                    <td>{{$place->name}}</td>
                    <td class="img-center">
                        <img src="{{$place->cover}}" alt="{{$place->cover}}">
                    </td>
                    <td class="img-center">
                        <img src="{{$place->avatar}}" alt="{{$place->avatar}}">
                    </td>
                    <td>Елена Новикова</td>
                    </td>
                    <td>100500</td>
                    <td>{{$place->created_at}}</td>
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
    {!! $places->render() !!}
@stop