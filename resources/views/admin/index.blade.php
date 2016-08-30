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
		$(document).ready(function(){
			$.get("admin/count_new_users", function(response){
				$("h3.b").text("Сегодня: " + response.day + " чел. За неделю: " + response.week + " чел. За месяц: " + response.month + " чел. За год: " + response.year + " чел.");
			});
			$('#datatable').dataTable();
			$('#datatable-keytable').DataTable({
				keys: true
			});
			$('#datatable-responsive').DataTable();
			function gd(year, month, day){
				return new Date(year, month - 1, day).getTime();
			}
			function updateGraphic(data){
				$("#canvas_dahs").length && $.plot($("#canvas_dahs"), [data], {
					series: {
						lines: {
							show: false,
							fill: true
						},
						splines: {
							show: true,
							tension: 0.4,
							lineWidth: 1,
							fill: 0.4
						},
						points: {
							radius: 0,
							show: true
						},
						shadowSize: 2
					},
					grid: {
						verticalLines: true,
						hoverable: true,
						clickable: true,
						tickColor: "#d5d5d5",
						borderWidth: 1,
						color: '#fff'
					},
					colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
					xaxis: {
						tickColor: "rgba(51, 51, 51, 0.06)",
						mode: "time",
						tickSize: [1, "day"],
						//tickLength: 10,
						axisLabel: "Date",
						axisLabelUseCanvas: true,
						axisLabelFontSizePixels: 12,
						axisLabelFontFamily: 'Verdana, Arial',
						axisLabelPadding: 10
						//mode: "time", timeformat: "%m/%d/%y", minTickSize: [1, "day"]
					},
					yaxis: {
						ticks: 8,
						tickColor: "rgba(51, 51, 51, 0.06)",
					},
					tooltip: false
				});
			}
			function getLastWeek(){
				var today = new Date();
				var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
				return lastWeek;
			}
			function formatDate(date){
				var d = new Date(date),
					month = '' + (d.getMonth() + 1),
					day = '' + d.getDate(),
					year = d.getFullYear();

				if (month.length < 2) month = '0' + month;
				if (day.length < 2) day = '0' + day;

				return [year, month, day].join('-');
			}
			var lastWeek = getLastWeek();
			lastWeek = formatDate(lastWeek);
			var now = new Date();
			now = formatDate(now);
			var url = "admin/statistic/" + lastWeek + "/" + now;
			$.get(url, function(response){
				var data2 = [];
				Object.keys(response).forEach(function(value){
					data2.push([gd(value.split("-")[0], value.split("-")[1], value.split("-")[2]), response[value].scalar]);
				});
				updateGraphic(data2);
			});
			$("input#reservation").daterangepicker({}, function(start, end, label){
				var url = "admin/statistic/" + start.format('YYYY-MM-DD') + "/" + end.format('YYYY-MM-DD');
				$.get(url, function(response){
					var data2 = [];
					Object.keys(response).forEach(function(value){
						data2.push([gd(value.split("-")[0], value.split("-")[1], value.split("-")[2]), response[value].scalar]);
					});
					updateGraphic(data2);
				});
			});
		});
		TableManageButtons.init();
	</script>

	<div class="x_content">
		<!-- <h3>Финансы</h3>
		<h3 class="b">Сегодня: 3000 руб. За неделю: 27 000 руб. За месяц: 170 000 руб. За год: 1000 500 руб.</h3>
		<p><img src="/img/pr/grafik.png" height="240" /> <br>x:Время; y:Пользователи;</p>

		<br><br> -->
		<h3>Пользователи</h3>
		<div class="daosn3">
			<p>Выберите даты</p>
			<form class="form-horizontal">
				<fieldset>
					<div class="control-group">
						<div class="controls">
							<div class="input-prepend input-group">
								<span class="add-on input-group-addon"><i class="glyphicon glyphicon-calendar fa fa-calendar"></i></span>
								<input type="text" style="width: 200px" name="reservation" id="reservation" class="form-control">
							</div>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
		<h3 class="b"></h3>
		<div id="canvas_dahs" class="demo-placeholder" style="width: 100%; height:270px;"></div>
		<!-- <p><img src="/img/pr/grafik.png" height="240" /> <br>x:Время; y:Деньги;</p> -->
	</div>

	<!-- <div class="x_content">
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
	</div> -->
@stop