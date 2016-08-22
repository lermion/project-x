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
                <li class="col-md-3 col-md-offset-1 active"><a href="/admin/moderation/groups">Новые </a></li>
                <li class="col-md-3"><a href="">На заметке </a></li>
                <li class="col-md-3"><a href="/admin/moderation/groups_is_block">Заблокированные </a></li>
            </ul>
        </div>

        <div class="moderator-content-table groups">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-title">Название группы</th>
                    <th class="img-center col-cover">Обложка</th>
                    <th class="col-author">Создатель</th>
                    <th class="col-count">Количество участников</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($groups as $group)
                  <tr>
                    <td><a href="">{{$group->id}}</a></td>
                    <td>{{$group->name}}</td>
                    <td class="img-center">
                        <img src="{{$group->avatar}}" alt="{{$group->avatar}}">
                    </td>
                    <td>{{$group->creator->first()->first_name}} {{$group->creator->first()->last_name}}</td>
                    <td>{{$group->users()->count()}}</td>
                    <td>{{$group->created_at}}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                    </td>
                  </tr>
                  @endforeach
                </tbody>
            </table>
        </div>
    </div>
    {!! $groups->render() !!}
@stop