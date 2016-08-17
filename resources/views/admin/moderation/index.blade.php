@extends('admin.layout')

@section('content')

    <div class="x_content admin-user-page-content">
        <div class="admin-settings">
            <ul class="row admin-settings-menu">
                <li class="col-md-2 col-md-offset-3 active"><a href="">Публикации (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Группы (<span>10</span>)</a></li>
                <li class="col-md-2"><a href="">Места (<span>10</span>)</a></li>
            </ul>
        </div>

        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-3 active"><a href="">Новые (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Тема дня (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">На заметке (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Заблокированные (<span>10</span>)</a></li>
            </ul>
        </div>

        <div class="moderator-content-table publication">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-text">Текст публикации</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст </td>
                    <td>Елена Новикова</td>
                    <td class="mini-image">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <!-- <a href="">Ещё</a> -->
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-primary btn-xs">Тема дня</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        <button type="button" class="btn btn-info btn-xs">На главную</button>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст </td>
                    <td>Елена Новикова</td>
                    <td class="mini-image">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <!-- <a href="">Ещё</a> -->
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-primary btn-xs">Тема дня</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        <button type="button" class="btn btn-info btn-xs">На главную</button>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>



        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-3 col-md-offset-1 active"><a href="">Новые (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">На заметке (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Заблокированные (<span>10</span>)</a></li>
            </ul>
        </div>

        <div class="moderator-content-table groups">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-title">Название группы</th>
                    <th class="img-center col-cover">Обложка</th>
                    <th class="col-author">Создатель</th>
                    <th class="col-count">Количество участников</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Группа 123</td>
                    <td class="img-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>100500</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Группа 123</td>
                    <td class="img-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    <td>100500</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>

        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-3 col-md-offset-1 active"><a href="">Новые (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">На заметке (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Заблокированные (<span>10</span>)</a></li>
            </ul>
        </div>


        <div class="moderator-content-table groups">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-title">Название места</th>
                    <th class="col-cover">Обложка</th>
                    <th class="col-cover">Аватар</th>
                    <th class="col-author">Создатель</th>
                    <th class="col-count">Количество участников</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Место 123</td>
                    <td class="img-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td class="img-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    </td>
                    <td>100500</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                    </td>
                  </tr>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Место 123</td>
                    <td class="img-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td class="img-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>Елена Новикова</td>
                    </td>
                    <td>100500</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                        <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>

@stop