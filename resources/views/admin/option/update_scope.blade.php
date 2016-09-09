@extends('admin.layout')

@section('content')
<form action="{{ action('Admin\OptionController@update_scope_save') }}" method="post" enctype="multipart/form-data">
	<div id="settings-tab-areas">
		<table id="datatable" class="table table-bordered admin-users">
			<thead>
				<tr>
					<th class="col-id">Порядок</th>
					<th class="col-ava">Иконка</th>
					<th class="col-ava">Название</th>
					<th class="col-ava">Количество участников</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<input type="hidden" name="id" value="{{$scopes->id}}">
					<td><input class="form-control" type="number" name="order" value="{{$scopes->order}}"></td>
					<td class="text-center"><label for="updateIcon"><img class="previewIcon" src="{{$scopes->img}}" alt="{{$scopes->img}}" for="updateIcon"><input name="img" style="display: none;" id="updateIcon" onchange="readURL(this);" type="file"></label></td>
					<td><input class="form-control" type="text" name="name" value="{{$scopes->name}}"></td>
					<td class="text-center">{{$scopes->counter}}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
</form>
		
@stop