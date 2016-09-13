@extends('admin.layout')

@section('content')

		<div id="settings-tab" class="admin-settings">
			<ul class="row admin-settings-menu">
				<li class="col-md-3"><a href="#settings-tab-common">Общие настройки</a></li>
				<li class="col-md-3"><a href="#settings-tab-limit">Ограничения</a></li>
				<li class="col-md-3"><a href="#settings-tab-areas">Области видимости</a></li>
				<li class="col-md-3"><a href="#settings-tab-code">Регистрационные коды</a></li>
			</ul>
			<form action="{{action('Admin\OptionController@create')}}" method="post">
				<div id="settings-tab-common" class="admin-settings-data">
					<div class="row settings-tab-common-inner">
						<div class="col-md-6">
							<div class="row">
								<div class="col-md-4">
									<label for="contacts">Контакты:</label>
								</div>
								<div class="col-md-7">
									<textarea class="form-control" rows="5" name="contacts" id="contacts">{{$option->contacts}}
									</textarea>
								</div>
							</div>

							<div class="row">
								<div class="col-md-4">
									<label for="сopyright">Copyright:</label>
								</div>
								<div class="col-md-7">
									<input class="form-control" id="сopyright" name="copyright" type="text" value="{{$option->copyright}}">
								</div>
							</div>

							<div class="row">
								<div class="col-md-4">
									<label for="message-to-admin">Письмо админу:</label>
								</div>
								<div class="col-md-7">
									<input class="form-control" id="message-to-admin" name="mail" type="text" value="{{$option->mail}}">
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="settings-tab-limit" class="admin-settings-limit">
					<div class="row">
						<p>Пользователь за <input type="number" class="miniText form-control" name="time_chat_message" value="{{$option->time_chat_message}}"> мин. может написать не более <input type="number" class="miniText form-control" name="users_chat_message" value="{{$option->users_chat_message}}"> новым юзерам.</p>
						<div class="admin-settings-limit-toggle-btn"><span>Пользователь, не загрузивший свое фото, не может просматривать фото других пользователей</span>
							<div class="switch">
							  <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox" @if ($option->user_foto_bloc == true)checked @endif  name="user_foto_bloc">
							  <label for="cmn-toggle-1"></label>
							</div>
						</div>
						<div class="admin-settings-limit-toggle-btn"><span>Показывать не модерированные публикации на главной</span>
							<div class="switch">
								<input id="cmn-toggle-2" class="cmn-toggle cmn-toggle-round" type="checkbox" @if ($option->moderate_publication == true)checked @endif  name="moderate_publication">
								<label for="cmn-toggle-2"></label>
							</div>
						</div>
						<div class="admin-settings-limit-toggle-btn"><span>Закрытая регистрация</span>
							<div class="switch">
								<input id="cmn-toggle-3" class="cmn-toggle cmn-toggle-round" type="checkbox" @if ($option->closed_registration == true)checked @endif  name="closed_registration">
								<label for="cmn-toggle-3"></label>
							</div>
						</div>
					</div>
				</div>
				<div id="settings-tab-areas">
					<table id="datatable" class="table table-bordered admin-users">
						<thead>
							<tr>
								<th class="col-id">Порядок</th>
								<th class="col-ava">Иконка</th>
								<th class="col-ava">Название</th>
								<th class="col-ava">Количество участников</th>
								<th class="col-ava">Действия</th>
							</tr>
						</thead>
						<tbody>
						@foreach($scopes as $scope)
							<tr>
								<td>{{$scope->order}}</td>
								<td class="text-center">
									<img src="{{$scope->img}}" alt="{{$scope->img}}">
								</td>
								<td>{{$scope->name}}</td>
								<td>{{$counters[$scope->id]}}</td>
								<td class="text-center">
									<a type="button" class="btn btn-success btn-xs" href="/admin/option/update_scope/{{$scope->id}}">Редактировать</a>
									@if ($scope->is_protected != true)
									<a type="button" class="btn btn-danger btn-xs" href="/admin/option/delete_scope/{{$scope->id}}">Удалить</a>
									@endif
								</td>
							</tr>
						@endforeach
						</tbody>
					</table>
					<a style="float: left;" class="mg-l btn btn-primary" href="/admin/option/create_scope">Добавить область</a>
				</div>
				<div id="settings-tab-code">
					<table class="table table-bordered table-code">
					    <thead>
					      <tr>
					        <th>Код</th>
					        <th>Статус</th>
					      </tr>
					    </thead>
					    <tbody>
						@foreach($codes as $code)
					      <tr>
					        <td>{{$code->code}}</td>
					        <td>
								@if ($code->invited_user_id != null)
									Использован
									@else
									Не использован
									@endif
							</td>
					      </tr>
						@endforeach
					    </tbody>
					  </table>
				</div>
				<p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
			</form>
			<form action="{{action('Admin\OptionController@mainPicture')}}" method="post" enctype="multipart/form-data">
				<div class="row admin-promo-main-img">
					<div class="col-md-3 lh">
						Изображение на главной:
					</div>
					<form action="{{action('Admin\OptionController@mainPicture')}}" method="post" enctype="multipart/form-data">
					<div class="col-md-3 col-sm-3 col-xs-6">
						<img src="/images/bc.jpeg" class="img-responsive" alt="/images/bc.jpeg">
					</div>
					<div class="col-md-3">
						<input type="file" name="picture">
					</div>
				</div>
				<div class="row">
						<p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
					</div>
			</form>
		</div>


	<script>
			$( "#settings-tab" ).tabs();
	</script>
		
@stop