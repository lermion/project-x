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
                <li class="col-md-3 col-md-offset-1 active"><a href="/admin/moderation/places">Новые </a></li>
                <li class="col-md-3"><a href="/admin/moderation/places_to_note">На заметке </a></li>
                <li class="col-md-3"><a href="/admin/moderation/places_is_block">Заблокированные</a></li>
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
                    <td>{{$place->creator->first()->first_name.' '.$place->creator->first()->last_name}}</td>
                    </td>
                      <td>{{$place->users()->count()}}</td>
                    <td>{{$place->created_at}}</td>

                    <td class="text-center">
                        @if ($place->is_block == false)
                            <a type="button" class="btn btn-danger btn-xs" href="/admin/moderation/block_place/{{$place->id}}">Блокировать</a>
                        @endif
                        @if ($place->is_moderate == false)
                            <a type="button" class="btn btn-success btn-xs" href="/admin/moderation/confirm_place/{{$place->id}}">Подтвердить</a>
                        @endif
                        @if ($place->to_note == false)
                            <a type="button" class="btn btn-warning btn-xs" href="/admin/moderation/note_place/{{$place->id}}">На заметку</a>
                        @endif
                    </td>
                  </tr>
                  @endforeach
                </tbody>
            </table>
        </div>
    </div>
    {!! $places->render() !!}
@stop