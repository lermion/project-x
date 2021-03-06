@extends('admin.layout')


@section('content')
<form action="{{action('Admin\CountryController@editRegionSave')}}" method="post">
    <div class="row country">
      <div class="col-md-12"><h3>изменение области</h3></div>
      <div class="col-md-2">
        <span class="line-h"><b>Выберите страну</b></span>
      </div>
      <div class="col-md-3">
          <select class="form-control get-regions" name="country_id">
              @foreach($countries as $country)
                  <option @if ($country->id == $country_id) selected @endif value="{{$country->id}}">{{$country->name}}</option>
              @endforeach
          </select>
      </div>
    </div>

    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Название области</b></span>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="text" name="name" placeholder="Введите название..." value="{{$region->name}}">
          <input type="hidden" name="id" value="{{$region->id}}">
      </div>
    </div>

      <p>
        <button class="btn btn-primary">Изменить</button>
      </p>
</form>

@stop