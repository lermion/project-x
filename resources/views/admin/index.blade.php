@extends('admin.layout')
@section('content')
    <script src="js/datatables/jquery.dataTables.min.js"></script>
    <script src="js/datatables/dataTables.bootstrap.js"></script>
    <script src="js/datatables/dataTables.buttons.min.js"></script>
    <script src="js/datatables/buttons.bootstrap.min.js"></script>
    <script src="js/datatables/jszip.min.js"></script>
    <script src="js/datatables/pdfmake.min.js"></script>
    <script src="js/datatables/vfs_fonts.js"></script>
    <script src="js/datatables/buttons.html5.min.js"></script>
    <script src="js/datatables/buttons.print.min.js"></script>
    <script src="js/datatables/dataTables.fixedHeader.min.js"></script>
    <script src="js/datatables/dataTables.keyTable.min.js"></script>
    <script src="js/datatables/dataTables.responsive.min.js"></script>
    <script src="js/datatables/responsive.bootstrap.min.js"></script>
    <script src="js/datatables/dataTables.scroller.min.js"></script>


    <!-- pace -->
    <script src="js/pace/pace.min.js"></script>

    <script type="text/javascript">
        $(document).ready(function() {
            $('#datatable').dataTable();
            $('#datatable-keytable').DataTable({
                keys: true
            });
            $('#datatable-responsive').DataTable();
        });
        TableManageButtons.init();
    </script>

    <div class="x_content">
        <h3>Финансы</h3>
        <h3 class="b">Сегодня: 3000 руб. За неделю: 27 000 руб. За месяц: 170 000 руб. За год: 1000 500 руб.</h3>
        <p><img src="/img/pr/grafik.png" height="240" /> <br>x:Время; y:Пользователи;</p>

        <br><br>
        <h3>Пользователи</h3>
        <h3 class="b">Сегодня: 48 чел. За неделю: 756 чел. За месяц: 7 569 чел. За год: 250 783 чел.</h3>
        <p><img src="/img/pr/grafik.png" height="240" /> <br>x:Время; y:Деньги;</p>
    </div>

    <div class="row">
        <h1>Страница конкретного пользователя</h1>
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
    <div class="row">
        <h1>Контент пользователя</h1>
    </div>
    <div class="row admin-user-content-table">
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
                <td>1</td>
                <td>Публикация1</td>
                <td>Описание публикации Описание публикации Описание публикации Описание публикации Описание публикации Описание публикации Описание публикации Описание публикации </td>
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
                <td>2</td>
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
                <td>2</td>
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





    <br><br><br><br><br><br><br><br><br><br>





@stop