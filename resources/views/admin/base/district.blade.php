@extends('admin.layout')

@section('content')
<form action="">
    <div class="row country">
      <div class="col-md-12"><h3>Добавление района</h3></div>
      <div class="col-md-2">
        <span class="line-h"><b>Выберите страну</b></span>
      </div>
      <div class="col-md-3">
        <select class="form-control">
          <option>Украина</option>
          <option>Россия</option>
        </select>
      </div>
    </div>

    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Выберите область</b></span>
      </div>
      <div class="col-md-3">
        <select class="form-control">
          <option>Киевская</option>
          <option>Днепропетровская</option>
        </select>
      </div>
    </div>
    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Название района</b></span>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="text" placeholder="Введите название...">
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
                <th>Область</th>
                <th>Страна</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
            @foreach($areas as $area)
              <tr>
                <td>{{$area->id}}</td>
                <td>{{$area->name}}</td>
                <td>{{$regions->where('id',$area->region_id)->first()->name}}</td>
                <td>{{$countries->where('id',$regions->where('id',$area->region_id)->first()->country_id)->first()->name}}</td>
                <td>
                    <p class="text-center">
                        <button class="btn btn-warning btn-xs">Редактировать</button>
                    </p>
                </td>
              </tr>
              @endforeach
            </tbody>
          </table>
    </div>
{!! $areas->render() !!}
    @stop