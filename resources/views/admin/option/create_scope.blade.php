@extends('admin.layout')

@section('content')

<form action="{{ action('Admin\OptionController@create_scope_save') }}" method="post" enctype="multipart/form-data">
	<div class="row">
		<div class="col-md-2">
			<span class="line-h"><b>Название</b></span>
		</div>
		<div class="col-md-3">
			<input class="form-control" type="text" name="name" placeholder="Введите название..." required>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2">
			<span class="line-h"><b>Иконка</b></span>
		</div>
		<div class="col-md-3">
			<label style="cursor: pointer;" class="line-h" for="addIcon"><img style="margin-top: 5px;" class="previewIcon" src="/images/name.png"></label>
			<input id="addIcon" onchange="readURL(this);" style="display: none;" type="file" name="img" required>
		</div>
	</div>
	<div class="row">
		<div class="col-md-2">
			<span class="line-h"><b>Порядок</b></span>
		</div>
		<div class="col-md-3">
			<input class="form-control" type="number" name="order" placeholder="Выберите порядок..." required>
		</div>
	</div>
	<p>
		<button type="submit" class="btn btn-primary">Создать область</button>
	</p>
</form>

@stop