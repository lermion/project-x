@extends('admin.layout')

@section('content')

	<div class="x_content">
        <div class="moderator-complaints">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Сущность</th>
                    <th>Автор</th>
                    <th>Кто пожаловался</th>
                    <th>Тип жалобы</th>
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
