@extends('admin.layout')

@section('content')

	<div class="x_content">
        <div class="complains-menu">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 col-md-offset-3 active"><a href="#">Публикации (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="#">Комментарии (<span>10</span>)</a></li>
            </ul>
        </div>
        <div class="moderator-complaints">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Текст</th>
                    <th>Автор</th>
                    <th>Картинки</th>
                    <th>Кто пожаловался</th>
                    <th>Жалобы</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Публикация</td>
                    <td>Елена Новикова</td>
                    <td>John Doe</td>
                    <td>Спам</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Отменить жалобу</button></p>
                        <p><button class="btn btn-danger btn-xs">Блокировать контент</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Коментарий</td>
                    <td>Елена Новикова</td>
                    <td>John Doe</td>
                    <td>Оскорбление</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Отменить жалобу</button></p>
                        <p><button class="btn btn-danger btn-xs">Блокировать контент</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>Публикация</td>
                    <td>Елена Новикова</td>
                    <td>John Doe</td>
                    <td>Материал для взрослых</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Отменить жалобу</button></p>
                        <p><button class="btn btn-danger btn-xs">Блокировать контент</button></p>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>

@stop
