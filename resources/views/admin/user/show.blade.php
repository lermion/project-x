@extends('admin.layout')

@section('content')

<div class="x_content admin-user-page">

    <div id="user-tabs" class="x_content">
        <ul class="row admin-user-menu">
            <li class="col-md-2 active"><a href="#user-tabs-info">Информация (<span>10</span>)</a></li>
            <li class="col-md-2"><a href="#user-tabs-publ">Публикации (<span>10</span>)</a></li>
            <li class="col-md-2"><a href="#user-tabs-groups">Группы (<span>10</span>)</a></li>
            <li class="col-md-2"><a href="#user-tabs-places">Места (<span>10</span>)</a></li>
            <li class="col-md-2"><a href="#user-tabs-subscr">Подписчики (<span>10</span>)</a></li>
            <li class="col-md-2"><a href="#user-tabs-mysubscr">Подписки (<span>10</span>)</a></li>
        </ul>


        <div id="user-tabs-info" class="row">
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


        <div id="user-tabs-publ" class="admin-user-page-content">
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><a href="">1</a></td>
                        <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                        <td>Елена Новикова</td>
                        <td class="mini-image">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>видео</td>
                        <td>02.08.2016</td>
                      </tr>
                      <tr>
                        <td><a href="">1</a></td>
                        <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                        <td>Елена Новикова</td>
                        <td class="mini-image">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>видео</td>
                        <td>02.08.2016</td>
                      </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="user-tabs-groups" class="admin-user-page-content">
            <div class="moderator-content-table user-groups">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="col-id">id</th>
                        <th class="col-title">Название группы</th>
                        <th class="img-center col-cover">Обложка</th>
                        <th class="col-author">Создатель</th>
                        <th class="col-count">Количество участников</th>
                        <th class="col-time">Время создания</th>
                        <!-- <th class="col-do">Действия</th> -->
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
    <!--                     <td>
                            <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                            <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                            <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        </td> -->
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
    <!--                     <td>
                            <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                            <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                            <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        </td> -->
                      </tr>
                    </tbody>
                </table>
            </div>   
        </div>

        <div id="user-tabs-places" class="admin-user-page-content">
            <div class="moderator-content-table user-groups">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="col-id">id</th>
                        <th class="col-title">Название места</th>
                        <th class="img-center col-cover">Обложка</th>
                        <th class="col-author">Создатель</th>
                        <th class="col-count">Количество участников</th>
                        <th class="col-time">Время создания</th>
                        <!-- <th class="col-do">Действия</th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><a href="">1</a></td>
                        <td>Место 123</td>
                        <td class="img-center">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>Елена Новикова</td>
                        <td>100500</td>
                        <td>02.08.2016</td>
    <!--                     <td>
                            <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                            <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                            <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        </td> -->
                      </tr>
                      <tr>
                        <td><a href="">1</a></td>
                        <td>Место 123</td>
                        <td class="img-center">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>Елена Новикова</td>
                        <td>100500</td>
                        <td>02.08.2016</td>
    <!--                     <td>
                            <button type="button" class="btn btn-danger btn-xs">Блокировать</button>
                            <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                            <button type="button" class="btn btn-warning btn-xs">На заметку</button>
                        </td> -->
                      </tr>
                    </tbody>
                </table>
            </div>   
        </div>
        <div id="user-tabs-subscr" class="admin-user-page-contacts">
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td class="text-center">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>Елена Новикова</td>
                        <td>Женский</td>
                        <td>35 лет</td>
                        <td>02.08.2016</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td class="text-center">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>Елена Новикова</td>
                        <td>Женский</td>
                        <td>35 лет</td>
                        <td>02.08.2016</td>
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
        </div>


        <div id="user-tabs-mysubscr" class="admin-user-page-contacts">
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td class="text-center">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>Елена Новикова</td>
                        <td>Женский</td>
                        <td>35 лет</td>
                        <td>02.08.2016</td>
                      </tr>
                      <tr>
                        <td>1</td>
                        <td class="text-center">
                            <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        </td>
                        <td>Елена Новикова</td>
                        <td>Женский</td>
                        <td>35 лет</td>
                        <td>02.08.2016</td>
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
        </div>
    </div>

</div>
    <script>
        $( "#user-tabs" ).tabs();
    </script>
@stop