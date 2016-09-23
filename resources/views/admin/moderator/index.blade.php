@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto; margin-bottom: 20px;">

        <div class="x_content admin-settings">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 col-md-offset-2 @if ($url == 'New') active @endif"><a href="{{action('Admin\ModeratorController@index')}}">Действующие</a></li>
                <li class="col-md-3 @if ($url == 'Stopped') active @endif"><a href="{{action('Admin\ModeratorController@stopped')}}">Приостановлено</a></li>
            </ul>
            <a href="{{action('Admin\ModeratorController@create')}}" type="button" class="btn btn-primary add-admin-button">Добавить</a>
        </div>
        @if (session()->has('message'))
            @foreach(session()->pull('message') as $message)
            <br><h5 style="color: red;"> {!!$message !!}</h5>
            @endforeach
        @endif
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
                            <div class="moderator-time">
                                <p>Вс</p>
                                <p>
                                    @foreach($working_hours as $working_hour)
                                        @if ($working_hour->weekday == 0 and $working_hour->moderator_id == $mod->id)
                                            {{$working_hour->from_time}}
                                        @endif
                                    @endforeach
                                </p>
                                <p>
                                    @foreach($working_hours as $working_hour)
                                        @if ($working_hour->weekday == 0 and $working_hour->moderator_id == $mod->id)
                                            {{$working_hour->to_time}}
                                        @endif
                                    @endforeach
                                </p>
                            </div>
                        <div class="moderator-time">
                            <p>Сб</p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 6 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->from_time}}
                                    @endif
                                @endforeach
                            </p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 6 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->to_time}}
                                    @endif
                                @endforeach
                            </p>
                        </div>
                        <div class="moderator-time">
                            <p>Пт</p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 5 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->from_time}}
                                    @endif
                                @endforeach
                            </p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 5 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->to_time}}
                                    @endif
                                @endforeach
                            </p>
                        </div>
                            <div class="moderator-time">
                                <p>Чт</p>
                                <p>
                                    @foreach($working_hours as $working_hour)
                                        @if ($working_hour->weekday == 4 and $working_hour->moderator_id == $mod->id)
                                            {{$working_hour->from_time}}
                                        @endif
                                    @endforeach
                                </p>
                                <p>
                                    @foreach($working_hours as $working_hour)
                                        @if ($working_hour->weekday == 4 and $working_hour->moderator_id == $mod->id)
                                            {{$working_hour->to_time}}
                                        @endif
                                    @endforeach
                                </p>
                            </div>
                            <div class="moderator-time">
                                <p>Ср</p>
                                <p>
                                    @foreach($working_hours as $working_hour)
                                        @if ($working_hour->weekday == 3 and $working_hour->moderator_id == $mod->id)
                                            {{$working_hour->from_time}}
                                        @endif
                                    @endforeach
                                </p>
                                <p>
                                    @foreach($working_hours as $working_hour)
                                        @if ($working_hour->weekday == 3 and $working_hour->moderator_id == $mod->id)
                                            {{$working_hour->to_time}}
                                        @endif
                                    @endforeach
                                </p>
                            </div>
                        <div class="moderator-time">
                            <p>Вт</p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 2 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->from_time}}
                                    @endif
                                @endforeach
                            </p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 2 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->to_time}}
                                    @endif
                                @endforeach
                            </p>
                        </div>
                        <div class="moderator-time">
                            <p>Пн</p>
                            <p>@foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 1 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->from_time}}
                                    @endif
                                @endforeach
                            </p>
                            <p>
                                @foreach($working_hours as $working_hour)
                                    @if ($working_hour->weekday == 1 and $working_hour->moderator_id == $mod->id)
                                        {{$working_hour->to_time}}
                                    @endif
                                @endforeach
                            </p>
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
                            <a class="btn btn-danger btn-xs deleteConfirm-mod" href="/admin/moderator/destroy/{{$mod->id}}">Удалить</a>
                        </p>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>

        <form action="{{ action('Admin\ModeratorController@update_inspection') }}" method="post">
        <h4 style="margin-top:30px;">Настройки модерации</h4>
        <p>Проверка активности модератора - каждые <input class="miniText form-control" type="number" name="inspection_moderator" value="{{$option->inspection_moderator}}"> мин.</p>
        <p><input class="btn btn-success save" type="submit" value="Сохранить"></p>
        </form>

    </div>

    <script>
        $(".deleteConfirm-mod").click(function(event) {
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
@stop