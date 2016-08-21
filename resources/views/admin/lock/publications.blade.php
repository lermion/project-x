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
                    <td>{{$publication->user->first_name.' '.$publication->user->last_name}}</td>
                    <td>
                        <img src="{{$publication->images->first()->url}}" alt="{{$publication->images->first()->url}}">
                    </td>
                    <td>
                            Нет видео
                    </td>
                    <td>{{$publication->created_at}}</td>
                    <td class="text-center">
                        <a class="btn btn-success btn-xs" href="/admin/lock/unlock_publication/{{$publication->id}}">Восстановить</a>
                        <a class="btn btn-danger btn-xs deleteConfirm-del" href="/admin/lock/destroy_publication/{{$publication->id}}">Удалить</a>
                    </td>
                  </tr>
                  @endforeach
                </tbody>
            </table>
        </div>


        <div class="admin-delete-btn">
            <a class="btn btn-danger deleteConfirm-del" href="/admin/lock/delete_publications/">Удалить все</a>
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
    {!! $publications->render() !!}
@stop