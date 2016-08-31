@extends('admin.layout')


@section('content')
<form action="">
    <div class="row country">
      <div class="col-md-12"><h3>Добавление населенного пункта</h3></div>
      <div class="col-md-3">
        <span class="line-h"><b>Выберите страну</b></span>
      </div>
      <div class="col-md-3">
          <select class="form-control get-region" name="country_id">
              @foreach($countries as $country)
                  <option value="{{$country->id}}">{{$country->name}}</option>
              @endforeach
          </select>
      </div>
    </div>

    <div class="row country">
      <div class="col-md-3">
        <span class="line-h"><b>Выберите область</b></span>
      </div>
      <div class="col-md-3">
          <select class="form-control get-regions" name="region_id">
              @foreach($regions as $region)
                  <option value="{{$region->id}}">{{$region->name}}</option>
              @endforeach
          </select>
      </div>
    </div>
    <div class="row country">
      <div class="col-md-3">
        <span class="line-h"><b>Выберите район</b></span>
      </div>
      <div class="col-md-3">
          <select class="form-control get-areas" name="area_id">
              @foreach($areas as $area)
                  <option value="{{$area->id}}">{{$area->name}}</option>
              @endforeach
          </select>
      </div>
    </div>
    <div class="row country">
      <div class="col-md-3">
        <span class="line-h"><b>Название населенного пункта</b></span>
      </div>
      <div class="col-md-3">
        <input class="form-control" type="text" placeholder="Введите название..." required>
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
                <th>Район</th>
                <th>Область</th>
                <th>Страна</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
            @foreach($cities as $city)
              <tr>
                <td>{{$city->id}}</td>
                <td>{{$city->name}}</td>
                <td></td>
                <td></td>
                <td>{{$countries->where('id',$city->country_id)->first()->name}}</td>
                <td>
                    {{--{{$area->where('id',$city->area_id)->first()->name}}--}}
                    <p class="text-center">
                        <button class="btn btn-warning btn-xs">Редактировать</button>
                    </p>
                </td>
              </tr>
            </tbody>
            @endforeach
          </table>
    </div>
{!! $cities->render() !!}
@stop