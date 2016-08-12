@extends('admin.layout')

@section('content')

	<div class="admin-mail">
		<div class="admin-delete-menu">
            <div class="admin-delete-menu-inner">
                <div class="item active">Новые</div>
                <div class="item">Закрытые</div>
                <div class="item">На заметке</div>
            </div>
        </div>

            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-ava">Аватар</th>
                    <th class="col-name">Имя</th>
                    <th class="col-gender">E-mail</th>
                    <th class="col-age">Сообщение</th>
                    <th class="col-registration">Дата</th>
                    <th class="col-type">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Новикова@email.com</td>
                    <td>Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу </td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                    	<p><button class="btn btn-primary btn-xs">Закрыть</button></p>
                        <p><button class="btn btn-warning btn-xs">На заметку</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Новикова@email.com</td>
                    <td>Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу </td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                    	<p><button class="btn btn-primary btn-xs">Закрыть</button></p>
                        <p><button class="btn btn-warning btn-xs">На заметку</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Новикова@email.com</td>
                    <td>Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу </td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                    	<p><button class="btn btn-primary btn-xs">Закрыть</button></p>
                        <p><button class="btn btn-warning btn-xs">На заметку</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                 
                </tbody>
            </table>
        </div>

@stop