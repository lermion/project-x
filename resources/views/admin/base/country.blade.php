@extends('admin.layout')

@section('content')

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
              <tr>
                <td>1</td>
                <td>Украина</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-xs">Редактировать</button>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Россия</td>
                <td>
                    <p class="text-center">
                        <button class="btn btn-warning btn-xs">Редактировать</button>
                    </p>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Польша</td>
                <td>
                    <p class="text-center">
                        <button class="btn btn-warning btn-xs">Редактировать</button>
                    </p>
                </td>
              </tr>
              <tr>
                <td>1</td>
                <td>Беларусь</td>
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