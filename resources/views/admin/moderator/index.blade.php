@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto;">

        <div class="x_content admin-settings">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 active"><a href="">Действующие</a></li>
                <li class="col-md-3"><a href="">Приостановлено</a></li>
            </ul>
            <a href="{{action('Admin\ModeratorController@create')}}" type="button" class="btn btn-primary add-admin-button">Добавить</a>
        </div>

        <table class="table table-bordered admin-moderators">
            <thead>
            <tr>
                <th>id</th>
                <th class="text-center photo">Фото</th>
                <th class="name">Имя</th>
                <th class="time">Время работы</th>
                <th class="process">Процесс</th>
                <th class="do">Действия</th>
            </tr>
            </thead>
            <tbody>
            @foreach($moderators as $moderator)
                <tr>
                    <td>{{$moderator->id}}</td>
                    <td><p align="center" class="m0 cp"><img src="{{$moderator->photo?$moderator->photo:'/img/ava/moderator.png'}}" height="70" /></p></td>
                    <td><a href="#">{{ $moderator->first_name.' '.$moderator->last_name }}</a></td>
                    <td class="moderator-time-to-work">
                        <p>Пн</p>
                        <p>9:00 - 18:00</p>
                        <p>Вт</p>
                        <p>9:00 - 18:00</p>
                        <p>Ср</p>
                        <p>9:00 - 18:00</p>
                        <p>Чт</p>
                        <p>9:00 - 18:00</p>
                        <p>Пт</p>
                        <p>9:00 - 18:00</p>
                        <p><a href="#" style="text-decoration:underline; font-size:12px;">Изменить</a></p>
                    </td>
                    <td>
                        <p>Модераций: <b>173</b></p>
                        <p>Долгое ожидание: <b>45 мин.</b></p>
                        <p>Присутствие: <b>17/19</b></p>
                    </td>
                    <td>
                        <p class="text-center" style="margin-top:10px;"><button type="button" class="btn btn-warning">Остановить</button></p>
                        <p class="text-center" style="margin-top:10px;"><button type="button" class="btn btn-info">Редактировать</button></p>
                    </td>
                </tr>
            @endforeach

            </tbody>
        </table>

        <h4 style="margin-top:30px;">Настройки модерации</h4>
        <p>Проверка активности модератора - каждые <input class="miniText form-control" type="text" placeholder="30"> мин.</p>
        <p><button type="button" class="btn btn-success">Сохранить</button></p>


    </div>
@stop