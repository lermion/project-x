@extends('admin.layout')

@section('content')
    <script src="/js/datatables/jquery.dataTables.min.js"></script>
    <script src="/js/datatables/dataTables.bootstrap.js"></script>
    <script src="/js/datatables/dataTables.buttons.min.js"></script>
    <script src="/js/datatables/buttons.bootstrap.min.js"></script>
    <script src="/js/datatables/jszip.min.js"></script>
    <script src="/js/datatables/pdfmake.min.js"></script>
    <script src="/js/datatables/vfs_fonts.js"></script>
    <script src="/js/datatables/buttons.html5.min.js"></script>
    <script src="/js/datatables/buttons.print.min.js"></script>
    <script src="/js/datatables/dataTables.fixedHeader.min.js"></script>
    <script src="/js/datatables/dataTables.keyTable.min.js"></script>
    <script src="/js/datatables/dataTables.responsive.min.js"></script>
    <script src="/js/datatables/responsive.bootstrap.min.js"></script>
    <script src="/js/datatables/dataTables.scroller.min.js"></script>


    <!-- pace -->
    <script src="/js/pace/pace.min.js"></script>

    <script type="text/javascript">
        $(document).ready(function () {
            $('#datatable').dataTable();
            $('#datatable-keytable').DataTable({
                keys: true
            });
            $('#datatable-responsive').DataTable();
        });
        TableManageButtons.init();
    </script>


    <div class="remodal" id="deleteModal">
        <button data-remodal-action="close" class="remodal-close"></button>
        <form class="form delete_user" method='get' action="/admin/user/delete/">
            <p class="form__title">Срок блокировки номера:</p>
            <button period="0" class="btn btn-danger btn-xs deletePeriodBnt">Не блокировать</button>
            <button period="1" class="btn btn-danger btn-xs deletePeriodBnt">Месяц</button>
            <button period="6" class="btn btn-danger btn-xs deletePeriodBnt">Полгода</button>
            <button period="12" class="btn btn-danger btn-xs deletePeriodBnt">Год</button>
        </form>
    </div>


    <div class="x_content">
        <div class="complains-menu">
            <ul class="row admin-settings-menu">
                @if ($moderator['is_admin'] == false)
                <li class="col-md-3 col-md-offset-3 @if ($url == 'New') active @endif"><a href="/admin/user">Новые</a></li>
                @else
                <li class="col-md-3 col-md-offset-3 @if ($url == 'All') active @endif"><a href="/admin/user/get_all">Все</a></li>
                    @endif
                <li class="col-md-3 @if ($url == 'Confirm') active @endif"><a href="/admin/user/get_confirm">На заметке </a></li>
            </ul>
        </div>
       <div class="admin-info" style="width:100%; height:auto; margin-bottom:5px;">
                    <div class="daosn3 gender">
                        <select class="form-control gender">
                            <option>Пол</option>
                            <option value="1">Мужской</option>
                            <option value="0">Женский</option>
                        </select>
                    </div>
                    <div class="daosn3">
                        <p>Регистрация</p>
                        <form class="form-horizontal">
                            <fieldset>
                                <div class="control-group">
                                    <div class="controls">
                                        <div class="input-prepend input-group">
                                            <span class="add-on input-group-addon"><i
                                                        class="glyphicon glyphicon-calendar fa fa-calendar"></i></span>
                                            <input type="text" style="width: 200px" name="reservation" id="reservation"
                                                   class="form-control" value="03/18/2013 - 03/23/2013"/>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div class="daosn3 age">
                        <input type="number" class="form-control" placeholder="Возраст от">
                    </div>
                    <div class="daosn3 age">
                        <input type="number" class="form-control" placeholder="Возраст до">
                    </div>
                    <div class="daosn3 avatar">
                        <input id="avatar" type="checkbox" checked>
                        <label for="avatar"><span>&nbsp; с аватаром</span></label>
                    </div>
                    <div class="daosn3 key"><input type="text" class="form-control" placeholder="Поиск..."></div>
        </div>
    </div>


    <div class="x_content">

        <table id="datatable" class="table table-bordered admin-users">
            <thead>
            <tr>
                <th class="col-id">id</th>
                <th class="col-ava">Аватар</th>
                <th class="col-name">Имя</th>
                <th class="col-gender">Пол</th>
                <th class="col-age">Возраст</th>
                <th class="col-date">Дата регистрации</th>
                <th class="col-status">Статус</th>
                <th class="col-do">Действие</th>
            </tr>
            </thead>


            <tbody>
            @foreach($users as $user)
            <tr>
            <td>{{ $user->id }}</td>
            <td class="text-center"><a href="{{action('Admin\UserController@show', ['id'=>$user->id])}}" ><img src="/images/user.png"></a></td>
            <td><a href="{{action('Admin\UserController@show', ['id'=>$user->id])}}" >{{ $user->first_name }} {{ $user->last_name }}</a></td>
            <td>{{ $user->gender }}</td>
            <td>{{ $user->birthday=='0000-00-00' ? '---' : date_diff(new DateTime($user->birthday), new DateTime())->y }}</td>
            <td>{{ $user->created_at }}</td>
            <td>{{ $user->user_quote }}</td>
            <td class="text-center">
                    <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                    <button type="button" class="btn btn-primary btn-xs">На заметку</button>
                <!-- <p align="center" class="m0">
                    <button type="button" class="btn btn-warning btn-xs">Подозрительный</button>
                </p> -->
                    <a userId='{{$user->id}}' class="btn btn-danger btn-xs deleteBnt">Удалить</a>
            </td>
            </tr>
            @endforeach
            </tbody>
        </table>
    </div>
    <script>
        var deleteBtn = $('.deleteBnt');
        var deletePeriodBnt = $('.deletePeriodBnt');
        var deleteModal = $('#deleteModal').remodal();
        deleteBtn.on('click',function () {
            deleteModal.open();
            var form = $('#deleteModal').find('form');
            form.attr('action',form.attr('action')+$(this).attr('userId'));
        });
        deletePeriodBnt.on('click',function (e) {
            e.preventDefault();
            var form = $('#deleteModal').find('form');

            form.attr('action',form.attr('action')+'/'+$(this).attr('period'));
            console.log($(this).attr('period'));
            form.submit();
            return false;
        });

        $('.admin-settings-menu li a').each(function () {
            var location = window.location.href;
            var link = this.href;
            location += "/";
            var index = location.indexOf(link);
            console.log(index);
            if(location == link) {
                $(this).addClass('active');
            }
        });
    </script>
    {!! $users->render() !!}
@stop