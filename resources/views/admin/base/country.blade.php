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