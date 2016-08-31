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
                    <th class="col-name">Название группы</th>
                    <th class="col-description">Описание группы</th>
                    <th class="col-img">Обложка</th>
                    <th class="col-author">Создатель</th>                    
                    <th class="col-video">Количество участников</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-action">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($groups as $group)
                  <tr>
                    <td><a href="/group/{{$group->url_name}}">{{$group->id}}</a></td>
                    <td>{{$group->name}}</td>
                    <td>{{$group->description}}</td>
                    <td>
                        <img src="{{$group->avatar}}" alt="{{$group->avatar}}">
                    </td>
                    <td>{{$group->creator->first()->first_name}} {{$group->creator->first()->last_name}}</td>
                    <td>{{$group->users()->count()}}</td>
                    <td>{{$group->created_at}}</td>
                    <td class="text-center">
                        <a class="btn btn-success btn-xs" href="/admin/lock/unlock_group/{{$group->id}}">Восстановить</a>
                        <a class="btn btn-danger btn-xs deleteConfirm-del" href="/admin/lock/destroy_group/{{$group->id}}">Удалить</a>
                    </td>
                  </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="admin-delete-btn">
            <a class="btn btn-danger deleteConfirm-del" href="/admin/lock/delete_groups/">Удалить все</a>
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
        });
        $('.admin-settings-menu li a').each(function () {
            var location = window.location.href;
            var link = this.href;
            location += "/";
            var index = location.indexOf(link);
            console.log(index);
            if(location == link) {
                $(this).addClass('active');
            }
        });
    </script>
    {!! $groups->render() !!}
@stop