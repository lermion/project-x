@extends('admin.layout')

@section('content')
  <form action="{{action('Admin\CountryController@editCountrySave')}}" method="post">
    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Изменить страну</b></span>
      </div>
      <div class="col-md-3">
          <input type="hidden" name="id" value="{{$country->id}}">
          <input class="form-control" type="text" name="name" value="{{$country->name}}">
          <input class="form-control" type="text" name="code" value="{{$country->code}}">
      </div>
    </div>
      <p>
        <button class="btn btn-primary">Изменить</button>
      </p>
  </form>

@stop