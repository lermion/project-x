@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto;">

        <h3>Модераторы</h3>

        <div style="width:100%; height:auto; margin-bottom:20px;">
            <table cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                <tr>
                    <td width="100%">
                        <table cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
                            <tr>
                                <td><div class="daosn2" style="background-color:#f1f1f1;">Действующие <b>3</b></div></td>
                                <td><div class="daosn2" style="border-right:1px #999 solid;">Приостановлено <b>2</b></div></td>
                                <td width="100%"></td>
                            </tr>
                        </table>
                    </td>
                    <td><p><a href="{{action('Admin\ModeratorController@create')}}" type="button" class="btn btn-primary">Добавить</a></p></td>
                </tr>
            </table>
        </div>

        <table class="table table-striped">
            <thead>
            <tr>
                <th>id</th>
                <th>Фото</th>
                <th>Имя</th>
                <th>Время работы</th>
                <th>Процесс</th>
                <th>Действия</th>
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
                        <p style="margin-top:20px;"><button type="button" class="btn btn-warning">Остановить</button></p>
                    </td>
                </tr>
            @endforeach

            </tbody>
        </table>

        <hr />

        <h4 style="margin-top:30px;">Настройки модерации:</h4>
        <p>Укажите значение для проверки присутствия модераторов: <input class="form-control input-sm" type="text" placeholder="30" style="width:50px;margin-left:10px; display: inline-block;"> мин. </p>
        <p style="margin-top:30px;"><button type="button" class="btn btn-success">Сохранить</button></p>


    </div>
@stop