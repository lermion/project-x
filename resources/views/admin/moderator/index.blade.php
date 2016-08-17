@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto; margin-bottom: 20px;">

        <div class="x_content admin-settings">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 col-md-offset-2 active"><a href="{{action('Admin\ModeratorController@index')}}">Действующие</a></li>
                <li class="col-md-3"><a href="{{action('Admin\ModeratorController@stopped')}}">Приостановлено</a></li>
            </ul>
            <a href="{{action('Admin\ModeratorController@create')}}" type="button" class="btn btn-primary add-admin-button">Добавить</a>
        </div>

        <table class="table table-bordered admin-moderators">
            <thead>
            <tr>
                <th class="id">id</th>
                <th class="text-center photo">Фото</th>
                <th class="name">Имя</th>
                <th class="time">Время работы</th>
                <th class="process">Процесс</th>
                <th class="do">Действия</th>
            </tr>
            </thead>
            <tbody>
            @foreach($moderators as $mod)
                <tr>
                    <td>{{$mod->id}}</td>
                    <td><p align="center" class="m0 cp"><img src="{{$mod->photo?$mod->photo:'/img/ava/moderator.png'}}" height="70" /></p></td>
                    <td><a href="/admin/moderator/update/{{$mod->id}}">{{ $mod->first_name.' '.$mod->last_name }}</a></td>
                    <td class="moderator-time-to-work">
                        <div class="row text-center">
                            <div class="col-md-2 col-md-offset-1">
                                <p>Пн</p>
                                <p>9:00</p>
                                <p>18:00</p>
                            </div>
                            <div class="col-md-2">
                                <p>Вт</p>
                                <p>9:00</p>
                                <p>18:00</p>
                            </div>
                            <div class="col-md-2">
                                <p>Ср</p>
                                <p>9:00</p>
                                <p>18:00</p>
                            </div>
                            <div class="col-md-2">
                                <p>Чт</p>
                                <p>9:00</p>
                                <p>18:00</p>
                            </div>
                            <div class="col-md-2">
                                <p>Пт</p>
                                <p>9:00</p>
                                <p>18:00</p>
                            </div>
                        </div>
                    </td>
                    <td class="moderators-process">
                        <p>Модераций: <b>173</b></p>
                        <p>Долгое ожидание: <b>45 мин.</b></p>
                        <p>Присутствие: <b>17/19</b></p>
                    </td>
                    <td>
                        <p class="text-center" style="margin-top:10px;">
                            <a href="/admin/moderator/stop/{{$mod->id}}">
                                <button type="button" class="btn btn-warning btn-xs"> @if ($mod->is_stop == false) Остановить  @else   Восстановить @endif </button>
                            </a>
                            <a class="btn btn-info btn-xs" href="/admin/moderator/update/{{$mod->id}}">Изменить</a>
                            <a class="btn btn-danger btn-xs deleteConfirm-mod" href="">Удалить</a>
                        </p>
                    </td>
                </tr>
            @endforeach

            </tbody>
        </table>

        <h4 style="margin-top:30px;">Настройки модерации</h4>
        <p>Проверка активности модератора - каждые <input class="miniText form-control" type="text" placeholder="30"> мин.</p>
        <p><button type="button" class="btn btn-success save">Сохранить</button></p>


    </div>

    <script>
        $(".deleteConfirm-mod").click(function(event) {
            var c = confirm("Вы действительно хотите удалить?");
            console.log(c);
            if(!c) {
                event.preventDefault();
                return false;
            }
        })
    </script>
@stop