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
    <script src="//cdn.ckeditor.com/4.5.8/standard/ckeditor.js"></script>


    <!-- pace -->
    <script src="js/pace/pace.min.js"></script>

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

    <div class="x_content promo-create">
        <h3>Создание статической страницы</h3>
        <form action="/admin/static_page/store" method="post">
            <label for="description">Название</label><br>
            <input class="form-control" type="text" name="description" placeholder="Название" id="description" required><br>
            <label for="name">Внутреннее название</label><br>
            <input class="form-control" type="text" name="name" placeholder="Внутреннее название" id="name" required><br>
            <label for="text">Содержимое</label><br>
            <textarea name="text" placeholder="Содержимое" id="text" required></textarea><br><br>
            <input type="submit" value="Сохранить" class="btn btn-primary">
            <a href="/admin/static_page" class="btn btn-default">Отменить</a>
        </form>
        <br>

        <br>
<script>
    var txt = $('textarea');

    if (txt) {
        CKEDITOR.replace('text');
    }
</script>
    </div>
@stop