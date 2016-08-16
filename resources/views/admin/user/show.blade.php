@extends('admin.layout')

@section('content')

	<div class="x_content admin-user-page">

        <div>
            <ul class="row admin-user-menu">
                <li class="col-md-2 active"><a href="">Информация (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Публикации (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Группы (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Места (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Подписчики (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Подписки (<span>10</span>)</a></li>
            </ul>
            <a href="{{action('Admin\ModeratorController@create')}}" type="button" class="btn btn-primary add-admin-button">Добавить</a>
        </div>
        <div class="row">
            <div class="col-md-4">
                <img class="admin-user-page-ava img-responsive" src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
            </div>
            <div class="col-md-6">
                <h2>Елена Новикова</h2>
                <p>Пол: <span>Женский</span></p>
                <p>Возраст: <span>20 лет</span></p>
                <p>Дата регистрации: <span>02.08.2016</span></p>
                <p>Статус: <span>Солнце, море и вода </span></p>
            </div>
        </div>
    </div>

    <div class="x_content admin-user-page-content">
<!--         <div class="row">
            <h1>Контент пользователя</h1>
        </div> -->
        <div class="admin-user-content-table">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Сущность</th>
                    <th>Текст публикации, описание группы/места</th>
                    <th>Название группы/места</th>
                    <th>Картинки</th>
                    <th>Видео</th>
                    <th>Время создания</th>
                    <!-- <th>Действия</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Публикация</td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td></td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <!-- <td>USA</td> -->
                  </tr>
                  <tr>
                    <td><a href="">2</a></td>
                    <td>Место</td>
                    <td>Описание нового места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места </td>
                    <td>Название нового места</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <!-- <td>USA</td> -->
                  </tr>
                  <tr>
                    <td><a href="">3</a></td>
                    <td>Группа</td>
                    <td>Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы </td>
                    <td>Название новой группы</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <!-- <td>USA</td> -->
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
<br>
    <div class="x_content admin-user-page-contacts">
<!--         <div class="row">
            <h1>Контакты пользователя</h1>
        </div> -->
        <div class="row">
            <div class="col-md-6 admin-users-select">
                <select name="" id="">
                    <option value="">Контакты</option>
                    <option value="">Подписки</option>
                    <option value="">Подписчики</option>
                </select>
            </div>
        </div>
        <div class="admin-user-contacts">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-ava">Аватар</th>
                    <th class="col-name">Имя</th>
                    <th class="col-gender">Пол</th>
                    <th class="col-age">Возраст</th>
                    <th class="col-registration">Дата регистрации</th>
                    <th class="col-type">Тип контакта</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Контакт</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписчик</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписан</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписан</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписчик</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписан</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Контакт</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписчик</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Подписан</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td>Контакт</td>
                  </tr>
                </tbody>
            </table>
        </div>
        <!-- <div class="row admin-user-contacts-pagination">
            <ul class="pagination">
              <li class="disabled"><a href="">&laquo;</a></li>
              <li class="active"><a href="">1</a></li>
              <li><a href="">2</a></li>
              <li><a href="">3</a></li>
              <li><a href="">4</a></li>
              <li><a href="">5</a></li>
              <li><a href="">&raquo;</a></li>
            </ul>
        </div> -->


@stop