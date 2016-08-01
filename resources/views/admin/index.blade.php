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


    <div style="width:100%; height:auto; margin-bottom:20px;">
        <table cellpadding="0" cellspacing="0" align="center" width="100%" border="0">
            <tbody>
            <tr>
                <td><div class="daosn2 jsSet daosn4" id="setObshee" param="csetObshee">Общие настройки</div></td>
                <!-- <td><div class="daosn2 jsSet" id="setOp" param="csetOp">Оповещения</div></td> -->
                <td><div class="daosn2 jsSet" id="setOgr" param="csetOgr" style="border-right:1px #999 solid;">Ограничения</div></td>
                <td width="100%"></td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="x_content">
        <div class="jscSet" id="csetObshee" style="display: block;">
        
        <h3>Сквозные данные</h3>
        
        <p>Контакты:
        <textarea style="width:400px;" rows="5">ООО "Интерфинити"
+7 (495) 120-33-78
interfiniti.ltd@gmail.com</textarea></p>

        <br>
        <p>Copyright
        <input type="text" value="interfiniti"></p>
        
        <br>
        <p>Письмо админу
        <input type="text" value="xmugutdin@gmail.com"></p>
        
        <br><br>
        <p><button type="button" class="btn btn-primary">Сохранить</button></p>
    </div>
    </div>



    <div class="x_content">
        <h3>Финансы</h3>
        <h3 class="b">Сегодня: 3000 руб. За неделю: 27 000 руб. За месяц: 170 000 руб. За год: 1000 500 руб.</h3>
        <p><img src="/img/pr/grafik.png" height="240" /> <br>x:Время; y:Пользователи;</p>

        <br><br>
        <h3>Пользователи</h3>
        <h3 class="b">Сегодня: 48 чел. За неделю: 756 чел. За месяц: 7 569 чел. За год: 250 783 чел.</h3>
        <p><img src="/img/pr/grafik.png" height="240" /> <br>x:Время; y:Деньги;</p>
    </div>
@stop