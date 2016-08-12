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


	<div class="x_content">
		<h1>Панель модератора - комментарии</h1>
	</div>
	<div class="x_content moderator-comments">
		<table class="table table-bordered">
	    <thead>
	      <tr>
	        <th class="col-comments-place">Где оставлен?</th>
	        <th class="col-comments-text">Текст комментария</th>
	        <th class="col-comments-author">Автор</th>
	        <th class="col-comments-action">Действия</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr>
	        <td>Название</td>
	        <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
	        <td>Елена Новикова</td>
	        <td>
	        	<p>
	        		<button class="btn btn-danger">Удалить</button>
	        	</p>
	        </td>
	      </tr>
          <tr>
            <td>Название</td>
            <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
            <td>Елена Новикова</td>
            <td>
                <p>
                    <button class="btn btn-danger">Удалить</button>
                </p>
            </td>
          </tr>
          <tr>
            <td>Название</td>
            <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
            <td>Елена Новикова</td>
            <td>
                <p>
                    <button class="btn btn-danger">Удалить</button>
                </p>
            </td>
          </tr>
          <tr>
            <td>Название</td>
            <td>Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария Текст комментария текст комментария </td>
            <td>Елена Новикова</td>
            <td>
                <p>
                    <button class="btn btn-danger">Удалить</button>
                </p>
            </td>
          </tr>
	    </tbody>
	  </table>
	</div>
    <br><br><br><br>

    <div class="x_content admin-user-page-content">
        <div class="row">
            <h1>Панель модератора - модерация. Внешний вид</h1>
        </div>
        <div class="moderator-content-table">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Сущность</th>
                    <th>Текст публикации, описание группы/места</th>
                    <th>Имя автора</th>
                    <th>Название группы/места</th>
                    <th>Картинки</th>
                    <th>Видео</th>
                    <th>Время создания</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><a href="">1</a></td>
                    <td>Публикация</td>
                    <td>Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации Текст публикации </td>
                    <td>Елена Новикова</td>
                    <td></td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td>USA</td>
                  </tr>
                  <tr>
                    <td><a href="">2</a></td>
                    <td>Место</td>
                    <td>Описание нового места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места Описание места </td>
                    <td>Елена Новикова</td>
                    <td>Название нового места</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td>USA</td>
                  </tr>
                  <tr>
                    <td><a href="">3</a></td>
                    <td>Группа</td>
                    <td>Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы Описание новой группы </td>
                    <td>Елена Новикова</td>
                    <td>Название новой группы</td>
                    <td>
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                        <img src="https://static.pexels.com/photos/20974/pexels-photo.jpg" alt="">
                    </td>
                    <td>видео</td>
                    <td>02.08.2016</td>
                    <td>USA</td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
<br><br><br>
    <div class="x_content">
        <h1>Панель модератора - новые пользователи</h1>
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
                        <p><button class="btn btn-primary btn-xs">Подтвердить</button></p>
                        <p><button class="btn btn-success btn-xs">На заметку</button></p>
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
                        <p><button class="btn btn-primary btn-xs">Подтвердить</button></p>
                        <p><button class="btn btn-success btn-xs">На заметку</button></p>
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
                        <p><button class="btn btn-primary btn-xs">Подтвердить</button></p>
                        <p><button class="btn btn-success btn-xs">На заметку</button></p>
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
                        <p><button class="btn btn-primary btn-xs">Подтвердить</button></p>
                        <p><button class="btn btn-success btn-xs">На заметку</button></p>
                        <p><button class="btn btn-danger btn-xs">Удалить</button></p>
                    </td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
@stop