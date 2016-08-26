@extends('admin.layout')


@section('content')
<form action="{{action('Admin\CountryController@createRegion')}}" method="post">
	<div class="row country">
	  <div class="col-md-12"><h3>Добавление области</h3></div>
	  <div class="col-md-2">
		<span class="line-h"><b>Выберите страну</b></span>
	  </div>
	  <div class="col-md-3">
		<select class="form-control" name="country_id">
			@foreach($countries as $country)
		  <option value="{{$country->id}}">{{$country->name}} </option>
			@endforeach
		</select>
	  </div>
	</div>

	<div class="row country">
	  <div class="col-md-2">
		<span class="line-h"><b>Название области</b></span>
	  </div>
	  <div class="col-md-3">
		<input class="form-control" type="text" name="name" placeholder="Введите название..." required>
	  </div>
	</div>

	  <p>
		<button class="btn btn-primary">Добавить</button>
	  </p>
</form>

	<div class="base">
		<table class="table table-bordered">
			<thead>
			  <tr>
				<th>id</th>
				<th>Название</th>
				<th>Страна</th>
				<th>Действия</th>
			  </tr>
			</thead>
			<tbody class="regions">
			@foreach($regions as $region)
			  <tr>
				<td>{{$region->id}}</td>
				<td>{{$region->name}}</td>
				<td>{{$countries->where('id',$region->country_id)->first()->name}}</td>
				<td>
					<p class="text-center">
						<a class="btn btn-warning btn-xs" href="/admin/base/edit_region/{{$region->id}}">Редактировать</a>
					</p>
				</td>
			  </tr>
			@endforeach
			</tbody>
		  </table>
	</div>
{!! $regions->render() !!}
@stop