@extends('admin.layout')


@section('content')


	<div class="x_content">
        <div class="admin-delete-menu">
            <div class="admin-delete-menu-inner">
                <div class="item active">Пользователи</div>
                <div class="item">Публикации</div>
                <div class="item">Группы</div>
                <div class="item">Места</div>
            </div>
        </div>
        <h2>Пользователи</h2>
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
                    <th class="col-action">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>

    <h2>Публикации</h2>
        <div class="admin-user-content-publication">
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
                  <tr>
                    <td><a href="">123</a></td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td>Елена Новикова</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td>Елена Новикова</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td>Елена Новикова</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>

        <h2>Группы</h2>
        <div class="admin-user-content-table">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-description">Описание группы</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-name">Название группы</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-action">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы </td>
                    <td>Елена Новикова</td>
                    <td>Название группы</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы </td>
                    <td>Елена Новикова</td>
                    <td>Название группы</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы Описание группы </td>
                    <td>Елена Новикова</td>
                    <td>Название группы</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>

        <h2>Места</h2>
        <div class="admin-user-content-table">
            <table class="table table-bordered ">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-description">Описание места</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-name">Название места</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-action">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места </td>
                    <td>Елена Новикова</td>
                    <td>Название места</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места </td>
                    <td>Елена Новикова</td>
                    <td>Название места</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="admin-user-contacts-action">
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места </td>
                    <td>Елена Новикова</td>
                    <td>Название места</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td>
                        <p><button class="btn btn-success btn-xs">Восстановить</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>

        <div class="admin-delete-btn">
            <button class="btn btn-danger">Удалить все</button>
        </div>
    </div>

@stop