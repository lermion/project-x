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

    <div class="x_content">
        <form action="/admin/static_page/update/{{$page->id}}" method="post">
            <label for="description">Название</label><br>
            <input type="text" name="description" placeholder="Название" id="description" value="{{$page->description}}" required><br>
            <label for="name">Внутреннее название</label><br>
            <input type="text" name="name" placeholder="Внутреннее название" id="name" value="{{$page->name}}" required><br>
            <label for="text">Содержимое</label><br>
            <textarea type="text" name="text" placeholder="Содержимое" id="text" required>{{$page->text}}</textarea><br><br>
            <input type="submit" value="Сохранить" class="btn btn-primary">
            <a href="/admin/static_page" class="btn btn-default">Отменить</a>
            <a type="button" class="btn btn-danger deleteConfirm-promo" href="/admin/static_page/destroy/{{$page->id}}">Удалить</a>
        </form>

        <script>
            var txt = $('textarea');

            if (txt) {
                CKEDITOR.replace('text');
            };
            $(".deleteConfirm-promo").click(function(event) {
                var c = confirm("Вы действительно хотите удалить?");
                console.log(c);
                if(!c) {
                    event.preventDefault();
                    return false;
                }
            })


        </script>

    </div>
@stop