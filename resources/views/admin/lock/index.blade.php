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

        <div class="admin-user-contacts to-delete">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-ava">Аватар</th>
                    <th class="col-name">Имя</th>
                    <th class="col-gender">Пол</th>
                    <th class="col-age">Дата рождения</th>
                    <th class="col-registration">Дата регистрации</th>
                    <th class="col-action">Действие</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($users as $user)
                  <tr>
                    <td>{{$user->id}}</td>
                    <td class="text-center">
                        @if ($user->avatar_path)
                            <img src="{{$user->avatar_path}}" alt="{{$user->avatar_path}}">
                        @else
                            <img src="/img/ava/moderator.png" alt="/img/ava/moderator.png">
                        @endif
                    </td>
                    <td><a href="/admin/user/show/{{$user->user_id}}">{{ $user->first_name.' '.$user->last_name }}</a></td>
                    <td>@if ($user->gender == true)
                            Мужской
                        @else
                            Женский
                        @endif
                    </td>
                    <td>{{$user->birthday}}</td>
                    <td>{{$user->created_at}}</td>
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
    {!! $users->render() !!}
@stop