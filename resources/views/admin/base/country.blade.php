@extends('admin.layout')

@section('content')
  <form action="">
    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Добавить страну</b></span>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="text" placeholder="Введите название...">
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
                    <button class="btn btn-warning btn-xs">Редактировать</button>
                </td>
              </tr>
            @endforeach
            </tbody>
          </table>
    </div>
  {!! $countries->render() !!}
@stop