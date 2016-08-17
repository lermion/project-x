@extends('admin.layout')



@section('content')


	<div class="x_content">
        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-3 active"><a href="">Пользователи (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Публикации (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Группы (<span>10</span>)</a></li>
                <li class="col-md-3"><a href="">Места (<span>10</span>)</a></li>
            </ul>
        </div>

        <div class="admin-user-contacts to-delete">
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
                    <td class="text-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-xs">Восстановить</button>
                        <button class="btn btn-danger btn-xs deleteConfirm-del">Удалить</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td class="text-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-xs">Восстановить</button>
                        <button class="btn btn-danger btn-xs deleteConfirm-del">Удалить</button>
                    </td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td class="text-center">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td><a href="">Елена Новикова</a></td>
                    <td>Женский</td>
                    <td>35 лет</td>
                    <td>02.08.2016</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-xs">Восстановить</button>
                        <button class="btn btn-danger btn-xs deleteConfirm-del">Удалить</button>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>
        
        <div class="admin-delete-btn">
            <button class="btn btn-danger  deleteConfirm-del">Удалить все</button>
        </div>
    </div>

    <script>
        $(".deleteConfirm-del").click(function(event) {
            var c = confirm("Вы действительно хотите удалить?");
            console.log(c);
            if(!c) {
                event.preventDefault();
                return false;
            }
        })
    </script>
@stop