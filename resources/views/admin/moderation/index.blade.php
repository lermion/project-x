@extends('admin.layout')

@section('content')

    <div class="x_content admin-user-page-content">
        <div class="admin-settings">
            <ul class="row admin-settings-menu">
                <li class="col-md-2 col-md-offset-3 active"><a href="/admin/moderation/">Публикации </a></li>
                <li class="col-md-2"><a href="/admin/moderation/groups">Группы </a></li>
                <li class="col-md-2"><a href="/admin/moderation/places">Места </a></li>
            </ul>
        </div>

        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-3 active"><a href="/admin/moderation/">Новые </a></li>
                <li class="col-md-3"><a href="/admin/moderation/publications_is_topic">Тема дня </a></li>
                <li class="col-md-3"><a href="">На заметке </a></li>
                <li class="col-md-3"><a href="/admin/moderation/publications_is_block">Заблокированные </a></li>
            </ul>
        </div>

        <div class="moderator-content-table publication">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-text">Текст публикации</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($publications as $publication)
                  <tr>
                    <td><a href="">{{$publication->id}}</a></td>
                    <td>{{$publication->text}}</td>
                    <td>{{$publication->user->first_name.' '.$publication->user->last_name}}</td>
                    <td class="mini-image">
                        <img src="{{$publication->images->first()->url}}" alt="{{$publication->images->first()->url}}">
                        <!-- <a href="">Ещё</a> -->
                    </td>
                    <td>Нет видео</td>
                    <td>{{$publication->created_at}}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <a type="button" class="btn btn-primary btn-xs" href="/admin/moderation/publications_topic/{{$publication->id}}">Тема дня</a>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        <button type="button" class="btn btn-info btn-xs">На главную</button>
                    </td>
                  </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    </div>
    {!! $publications->render() !!}
@stop