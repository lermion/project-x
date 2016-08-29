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
        <h3>Промо страницы {{session()->get('message')}}</h3>
        <div class="row admin-promo-main-img">
            <div class="col-md-3 lh">
                Текст на главной: 
            </div>
            <div class="col-md-3">
                <input class="form-control" type="text" placeholder="Ведите текст...">
            </div>
        </div>
        <div class="row admin-promo-main-img">
            <div class="col-md-3 lh">
                Изображение на главной: 
            </div>
            <div class="col-md-3 col-sm-3">
                <img src="http://1.bp.blogspot.com/-FlpE6jqIzQg/UmAq6fFgejI/AAAAAAAADko/ulj3pT0dIlg/s1600/best-nature-desktop-hd-wallpaper.jpg" class="img-responsive" alt="">
            </div>
            <div class="col-md-3">
            	<input type="file">
            </div>
        </div>
        <ul class="promo">
            @foreach($pages as $page)
                <li><a href="{{action('Admin\StaticPageController@edit', ['id'=>$page->id])}}">{{$page->description}}</a></li>
            @endforeach
        </ul>
        <p>
            <a type="button" href="/admin/static_page/create" class="btn btn-primary">Добавить страницу</a>
        </p>

    </div>
@stop