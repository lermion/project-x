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
		$(document).ready(function(){
			$('.admin-settings-menu li a').on("click", function(){
				if($(this).parent().attr("id") === "all-users"){
					getUsers("user/get_users?");
				}else if($(this).parent().attr("id") === "on-a-note"){
					getUsers("user/get_confirm?");
				}
			    $('.admin-settings-menu li a').removeClass("active");
			    $(this).addClass("active");
			});
			function createUrl(filters){
				if(filters){
					var url = "user/get_users?";
					for(var i = 0; i < filters.length; i++){
						if(filters[i] !== undefined){
							url += filters[i];
						}
					}
					getUsers(url);
				}
			}
			var deleteModal = $('#deleteModal').remodal();
			function getUsers(url){
				var table = $('#datatable').dataTable({
					"language": {
						"url": "//cdn.datatables.net/plug-ins/1.10.12/i18n/Russian.json"
					},
					"bDestroy": true,
					"dom": '<"top"i>rt<"bottom"flp><"clear">',
					"ajax": {
						"url": url ? url : "user/get_users",
						"type": "GET",
						"dataSrc": ""
					},
					"columns": [
						{"data": "id"},
						{
							"data": "avatar_path",
							"render" : function(data, type, row){
								return data ? '<img src="' + data + '" />' : '<img src="/images/user.png" />';
							}
						},
						{
							"data": "first_name",
							"render" : function(data, type, full, meta){
								return "<a href='user/show/" + full.id + "'>" + full.first_name + " " + full.last_name + "</a>";
							}
						},
						{
							"data": "gender",
							"render" : function(data, type, row){
								return parseInt(data) ? "Мужской" : "Женский";
							}
						},
						{"data": "birthday"},
						{"data": "created_at"},
						{"data": "user_quote"},
						{
							"data": "status",
							"render" : function(data, type, row){
								if(url === "user/get_confirm?"){
									return "<button id='confirmBnt' type='button' class='btn btn-success btn-xs'>Подтвердить</button><a href='javascript:void(0);' id='deleteBnt' class='btn btn-danger btn-xs'>Удалить</a>";
								}else{
									if(data === "Подтвержден"){
										return "<a href='javascript:void(0);' id='deleteBnt' class='btn btn-danger btn-xs'>Удалить</a><button id='onANote' type='button' class='btn btn-primary btn-xs'>На заметку</button>";
									}else{

									}
									return "<button id='confirmBnt' type='button' class='btn btn-success btn-xs'>Подтвердить</button><a href='javascript:void(0);' id='deleteBnt' class='btn btn-danger btn-xs'>Удалить</a><button id='onANote' type='button' class='btn btn-primary btn-xs'>На заметку</button>";
								}
								
							}
						}
					]
				});
				$('#datatable tbody').on('click', 'button#confirmBnt', function(){
					var data = table.api().row($(this).parents('tr')).data();
					$.get("user/confirm/" + data.id, function(response){
						if(response.status){
							getUsers(null);
						}
					});
				});
				$('#datatable tbody').on('click', 'a#deleteBnt', function(){
					var data = table.api().row($(this).parents('tr')).data();
					$('#deleteModal').find("input").attr("value", data.id);
					deleteModal.open();
				});
				$('#datatable tbody').on('click', 'button#onANote', function(){
					var data = table.api().row($(this).parents('tr')).data();
					$.get("user/review/" + data.id, function(response){
						if(response.status){
							getUsers(null);
						}
					});
				});
			}
			getUsers(null);

			var filters = [];

			//handlers

			$("select.gender").change(function(event){
				if(this.value !== "none"){
					filters[0] = "&gender=" + (this.value);
				}else{
					filters[0] = "";
				}
				createUrl(filters);
			});

			$('#input-search').keyup(function(e){
				if(e.keyCode == 13){
					if(this.value !== ""){
						filters[6] = "&keywords=" + this.value;
					}else{
						filters[6] = "";
					}
					createUrl(filters);
				}
			});

			$("input#avatar").change(function(event){
				var checkbox = $("input#avatar");
				checkbox.val( checkbox[0].checked ? 1 : 0);
				filters[1] = "&is_avatar=" + checkbox.val();
				createUrl(filters);
			});

			$("input#age_range_from").on("change paste keyup", function(event){
				filters[2] = "&age_range_from=" + (this.value);
				createUrl(filters);
			});

			$("input#age_range_to").on("change paste keyup", function(event){
				filters[3] = "&age_range_to=" + (this.value);
				createUrl(filters);
			});

			$("input#reservation").daterangepicker({}, function(start, end, label){
				filters[4] = "&reg_range_from=" + start.format('YYYY-MM-DD');
				filters[5] = "&reg_range_to=" + end.format('YYYY-MM-DD');
				createUrl(filters);
			});

			$('#datatable-keytable').DataTable({
				keys: true
			});
			$('#datatable-responsive').DataTable();
			var deletePeriodBnt = $('.deletePeriodBnt');
			deletePeriodBnt.on('click',function(e){
				e.preventDefault();
				var userId = $('#deleteModal').find("input").attr("value");
				if(parseInt($(this).attr('period')) === 0){
					deleteModal.close();
				}else{
					getUsers(null);
					deleteModal.close();
					$.get("lock/delete_user/" + userId + "/" + $(this).attr('period'), function(response){
						if(response.status){
							getUsers(null);
						}
					});
				}
			});
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
			<input type="hidden" value="" name="">
		</form>
	</div>


	<div class="x_content">
		<div class="complains-menu">
			<ul class="row admin-settings-menu">
				@if ($moderator['is_admin'] == false)
				<li class="col-md-3 col-md-offset-3 @if ($url == 'New') active @endif"><a href="/admin/user">Новые</a></li>
				@else
				<li id="all-users" class="col-md-3 col-md-offset-3"><a href="javascript:void(0);">Все</a></li>
					@endif
				<li id="on-a-note" class="col-md-3"><a href="javascript:void(0);">На заметке</a></li>
			</ul>
		</div>
	   <div class="admin-info" style="width:100%; height:auto; margin-bottom:5px;">
					<div class="daosn3 gender">
						<select class="form-control gender">
							<option value="none">Пол</option>
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
											<input type="text" style="width: 200px" name="reservation" id="reservation" class="form-control">
										</div>
									</div>
								</div>
							</fieldset>
						</form>
					</div>
					<div class="daosn3 age">
						<input type="number" id="age_range_from" class="form-control" placeholder="Возраст от">
					</div>
					<div class="daosn3 age">
						<input type="number" id="age_range_to" class="form-control" placeholder="Возраст до">
					</div>
					<div class="daosn3 avatar">
						<input id="avatar" type="checkbox" checked>
						<label for="avatar"><span>&nbsp; с аватаром</span></label>
					</div>
					<div class="daosn3 key"><input type="text" id="input-search" class="form-control" placeholder="Поиск..."></div>
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
			<!-- @foreach($users as $user)
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
				<p align="center" class="m0">
					<button type="button" class="btn btn-warning btn-xs">Подозрительный</button>
				</p>
					<a userId='{{$user->id}}' class="btn btn-danger btn-xs deleteBnt">Удалить</a>
			</td>
			</tr>
			@endforeach -->
			</tbody>
		</table>
	</div>
	<script>
		var deleteBtn = $('.deleteBnt');
		deleteBtn.on('click',function () {
			deleteModal.open();
			var form = $('#deleteModal').find('form');
			form.attr('action',form.attr('action')+$(this).attr('userId'));
		});
		// $('.admin-settings-menu li a').each(function () {
		// 	var location = window.location.href;
		// 	var link = this.href;
		// 	location += "/";
		// 	var index = location.indexOf(link);
		// 	if(location == link) {
		// 		$(this).addClass('active');
		// 	}
		// });
	</script>
	{!! $users->render() !!}
@stop