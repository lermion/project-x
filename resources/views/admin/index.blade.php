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
    <br><br><br><br><br><br>
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
                <th class="admin-user-content-table-col-img">Картинки</th>
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
                <td class="admin-user-content-table-col-img">
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
                <td class="admin-user-content-table-col-img">
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
                <td class="admin-user-content-table-col-img">
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

       <br><br><br><br><br>

    <div class="row">
        <h1>Контакты пользователя</h1>
    </div>
    <div class="row">
        <div class="col-md-6 admin-users-select">
            <select name="" id="">
                <option value="">Контакты</option>
                <option value="">Подписки</option>
                <option value="">Подписчики</option>
            </select>
        </div>
    </div>
    <div class="row">
        <table class="table table-bordered">
            <thead>
              <tr>
                <th>id</th>
                <th>Аватар</th>
                <th>Имя</th>
                <th>Пол</th>
                <th>Возраст</th>
                <th>Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
                    <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                </td>
                <td>Елена Новикова</td>
                <td>Женский</td>
                <td>35 лет</td>
                <td>02.08.2016</td>
              </tr>
              <tr>
                <td>1</td>
                <td class="admin-user-contacts-ava">
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
    <div class="row admin-user-contacts-pagination">
        <ul class="pagination">
          <li class="disabled"><a href="">&laquo;</a></li>
          <li class="active"><a href="">1</a></li>
          <li><a href="">2</a></li>
          <li><a href="">3</a></li>
          <li><a href="">4</a></li>
          <li><a href="">5</a></li>
          <li><a href="">&raquo;</a></li>
        </ul>
    </div>

    <br><br><br><br>

    <div class="row">
        <h1>Админ панель - Настройки общие - Внешний вид</h1>
    </div>
    <br><br>
    <div class="row admin-settings-menu">
        <div class="col-md-3 active">Общие настройки</div>
        <div class="col-md-3">Ограничения</div>
    </div>

    <div class="row admin-settings-data">
        <div class="col-md-6">
            <h2>Сквозные данные</h2>
            <div class="row">
                <div class="col-md-2">Контакты: </div>
                <div class="col-md-8">
                    <textarea name="" id="" cols="30" rows="5">ООО "Интерфинити"
+7 (495) 120-33-78
interfiniti.ltd@gmail.com</textarea>
                </div>
            </div>
            <div class="row">
                <div class="col-md-2">Copyright: </div>
                <div class="col-md-8">
                    <input type="text" value="interfiniti">
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">Письмо админу: </div>
                <div class="col-md-8">
                    <input type="text" value="xmugutdin@gmail.com">
                </div>
            </div>
            <p>
                <button class="btn btn-primary">
                    Сохранить
                </button>
            </p>
        </div>
    </div>
<br><br><br>
    <div class="row admin-settings-restrictions">
        <p>Пользователь за <input type="text" class="miniText" value="60"> мин. может написать не более <input type="text" class="miniText" value="50"> новым юзерам.</p>
        <div class="admin-settings-restrictions-toggle-btn"><span>Пользователь не загрузивший свое фото не может просматривать фото других пользователей</span>
            <div class="switch">
              <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox">
              <label for="cmn-toggle-1"></label>
            </div>
        </div>
        
        <p><button type="button" class="btn btn-primary">Сохранить</button></p>
    </div>




<br><br><br><br>



@stop