@extends('admin.layout')

@section('content')
  <form action="{{action('Admin\CountryController@createCountry')}}" method="post">
    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Добавить страну</b></span>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="text" name="name" placeholder="Введите название...">
      </div>
    </div>
      <p>
        <button class="btn btn-primary">Добавить</button>
      </p>
  </form>


    <div class="base country">
        <table class="table table-bordered">
            <thead>
              <tr>
                <th class="col-id">id</th>
                <th class="col-title">Название</th>
                <th class="col-do">Действия</th>
              </tr>
            </thead>
            <tbody>
            @foreach($countries as $country)
              <tr>
                <td>{{$country->id}}</td>
                <td>{{$country->name}}</td>
                <td class="text-center">
                    <a class="btn btn-warning btn-xs" href="/admin/base/edit_сountry/{{$country->id}}">Редактировать</a>
                </td>
              </tr>
            @endforeach
            </tbody>
          </table>
    </div>
  {!! $countries->render() !!}
@stop