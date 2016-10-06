@extends('admin.layout')

@section('content')
	<div class="x_content">
		<h3>Выберете область видимости в которую перенести пользователей</h3>
		<div class="daosn3">
<form action="{{ action('Admin\OptionController@delete_scope_save') }}" method="get">
	<div id="settings-tab-areas">
		<table id="datatable" class="table table-bordered admin-users">
			<thead>
				<tr>
					<th class="col-id">Порядок</th>
					<th class="col-ava">Иконка</th>
					<th class="col-ava">Название</th>
					<th class="col-ava">Количество участников</th>
					<th class="col-ava">Действие</th>
				</tr>
			</thead>
			<tbody>
			@foreach($scopes as $scope)
				<tr>
					<td>{{$scope->order}}</td>

					<td class="text-center"><label for="updateIcon"><img src="{{$scope->img}}" alt="{{$scope->img}}" for="updateIcon"><input style="display: none;" id="updateIcon" type="file"></label></td>
					<td>{{$scope->name}}</td>
					<td class="text-center">{{$counters[$scope->id]}}</td>
					<td class="text-center">
						<input type="radio" name="radiobutton" value="{{$scope->id}}">
						<input type="hidden" name="delete_id" value="{{$delete_id}}">
					</td>
				</tr>
			@endforeach
			</tbody>
		</table>
	</div>
	<input class="btn btn-success deleteConfirm-mod" type="submit" value="Сохранить">
	<a href="/admin/option" class="btn btn-default">Отменить</a>
</form>
@stop