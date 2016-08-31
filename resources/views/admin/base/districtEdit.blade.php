@extends('admin.layout')

@section('content')
    <form action="{{action('Admin\CountryController@editDistrictSave')}}" method="post">
        <div class="row country">
            <div class="col-md-12"><h3>Изменить район</h3></div>
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
                        <option @if ($region->id == $district->region_id) selected @endif value="{{$region->id}}">{{$region->name}}</option>
                    @endforeach
                </select>
            </div>
        </div>
        <div class="row country">
            <div class="col-md-2">
                <span class="line-h"><b>Название района</b></span>
            </div>
            <div class="col-md-3">
                <input class="form-control" type="text" name="name" placeholder="Введите название..." value="{{$district->name}}">
                <input type="hidden" name="id" value="{{$district->id}}">
            </div>
        </div>

        <p>
            <button class="btn btn-primary">Изменить</button>
        </p>
    </form>
@stop