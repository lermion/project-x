@extends('admin.layout')

@section('content')
<form action="{{action('Admin\CountryController@createDistrict')}}" method="post">
    <div class="row country">
      <div class="col-md-12"><h3>Добавление района</h3></div>
      <div class="col-md-2">
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
      <div class="col-md-2">
        <span class="line-h"><b>Выберите область</b></span>
      </div>
      <div class="col-md-3">
        <select class="form-control get-regions" name="region_id">
            @foreach($regions as $region)
                <option @if ($region->country_id == $country->id) selected @endif  value="{{$region->id}}">{{$region->name}}</option>
            @endforeach
        </select>
      </div>
    </div>
    <div class="row country">
      <div class="col-md-2">
        <span class="line-h"><b>Название района</b></span>
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
                        <a class="btn btn-warning btn-xs" href="/admin/base/edit_district/{{$area->id}}">Редактировать</a>
                    </p>
                </td>
              </tr>
              @endforeach
            </tbody>
          </table>
    </div>
{!! $areas->render() !!}
    @stop