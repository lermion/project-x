@extends('admin.layout')

@section('content')

	<div class="admin-mail">
		<div class="complains-menu">
            <ul class="row admin-settings-menu">
                <li class="col-md-2 col-md-offset-3 active"><a href="#">Новые (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="#">Закрытые (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="#">На заметке (<span>10</span>)</a></li>
            </ul>
        </div>
        <div class="admin-mail-to">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-ava">Аватар</th>
                    <th class="col-name">Имя</th>
                    <th class="col-mail">E-mail</th>
                    <th class="col-message">Сообщение</th>
                    <th class="col-registration">Дата</th>
                    <th class="col-type">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td class="text-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Новикова@email.com</td>
                    <td>Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу </td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                    	<button class="btn btn-primary btn-xs">Закрыть</button>
                        <button class="btn btn-warning btn-xs">На заметку</button>
                        <button class="btn btn-danger btn-xs">Удалить</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td class="text-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Новикова@email.com</td>
                    <td>Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения </td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <button class="btn btn-primary btn-xs">Закрыть</button>
                        <button class="btn btn-warning btn-xs">На заметку</button>
                        <button class="btn btn-danger btn-xs">Удалить</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td class="text-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Новикова@email.com</td>
                    <td>Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу Текст сообщения админу </td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <button class="btn btn-primary btn-xs">Закрыть</button>
                        <button class="btn btn-warning btn-xs">На заметку</button>
                        <button class="btn btn-danger btn-xs">Удалить</button>
                    </td>
                  </tr>
                 
                </tbody>
            </table>
        </div>
    </div>

@stop