@extends('admin.layout')


@section('content')

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
              <tr>
                <td>1</td>
                <td>Днепродзержинск</td>
                <td>Днепровский район</td>
                <td>Днепропетровская область</td>
                <td>Украина</td>
                <td>
                    <p class="text-center">
                        <button class="btn btn-warning btn-xs">Редактировать</button>
                    </p>
                </td>
              </tr>
            </tbody>
          </table>
    </div>

@stop