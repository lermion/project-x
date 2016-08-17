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

        <div class="admin-user-content-publication to-del-publ">
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
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td>Елена Новикова</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">

                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-xs">Восстановить</button>
                        <button class="btn btn-danger btn-xs">Удалить</button>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">123</a></td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td>Елена Новикова</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">

                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-xs">Восстановить</button>
                        <button class="btn btn-danger btn-xs">Удалить</button>
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