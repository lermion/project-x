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

        <table id="datatable" class="table table-striped table-bordered">
            <thead>
            <tr>
                <th>id</th>
                <th>Аватар</th>
                <th>Имя</th>
                <th>Логин</th>
                <th>Телефон</th>
                <th>Пол</th>
                <th>Возраст</th>
                <th>Дата регистрации</th>
                <th>Статус</th>
                <th>Действия</th>
            </tr>
            </thead>


            <tbody>
                <tr>
                    <td>{{ $user->id }}</td>
                    <td><a href="{{action('Admin\UserController@show', ['id'=>$user->id])}}" ><img style="height: 70px" src="/images/user.png"></a></td>
                    <td><a href="{{action('Admin\UserController@show', ['id'=>$user->id])}}" >{{ $user->first_name }} {{ $user->last_name }}</a></td>
                    <td>{{ $user->login }}</td>
                    <td>{{ $user->phone }}</td>
                    <td>{{ $user->gender }}</td>
                    <td>{{ $user->birthday=='0000-00-00' ? '---' : date_diff(new DateTime($user->birthday), new DateTime())->y }}</td>
                    <td>{{ $user->created_at }}</td>
                    <td>{{ $user->status }}</td>
                    <td>
                        <p align="center" class="m0">
                            <button type="button" class="btn btn-success btn-xs">Подтвердить</button>
                        </p>
                        <p align="center" class="m0">
                            <button type="button" class="btn btn-primary btn-xs">На заметку</button>
                        </p>
                        <p align="center" class="m0">
                            <button type="button" class="btn btn-warning btn-xs">Подозрительный</button>
                        </p>
                        <p align="center" class="m0">
                            <a userId='{{$user->id}}' class="btn btn-danger btn-xs deleteBnt">Удалить</a>
                    </td>
                </tr>
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
    </script>
@stop