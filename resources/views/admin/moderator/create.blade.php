@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto;">

        <h3>Добавление модератора</h3>
        @if(isset($error))
            {{ $error }}
        @endif
        <form action="{{ action('Admin\ModeratorController@store') }}" method="post" enctype="multipart/form-data">
            <div class="row">
                <div class="col-md-3 admin-moderator-avatar">
                    <div>
                        <img src="/img/ava/moderator.png" alt="/img/ava/moderator.png">
                    </div>
                    <div>
                        <input type="file" name="photo" id="photo">
                    </div>
                </div>
                <div class="col-md-3">
                    <label for="email">Email</label><br>
                    <input class="form-control" type="email" name="email" id="email" required><br>
                    <label for="password">Пароль</label><br>
                    <input class="form-control"  type="password" name="password" id="password" required><br>
                    <label for="first_name">Имя</label><br>
                    <input class="form-control"  type="text" name="first_name" id="first_name" required><br>
                    <label for="last_name">Фамилия</label><br>
                    <input class="form-control"  type="text" name="last_name" id="last_name" required><br>
                </div>
                <div class="col-md-4 col-md-offset-1">
                    <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th></th>
                            <th>День недели</th>
                            <th>С</th>
                            <th>До</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><input type="checkbox" name="weekday[1]" id="weekday[1]"></td>
                            <td><label for="weekday[1]">Понедельник</label></td>
                            <td class="text-center"><input type="time" name="from_time[1]" id="from_time[1]"></td>
                            <td class="text-center"><input type="time" name="to_time[1]" id="to_time[1]"></td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" name="weekday[2]" id="weekday[2]"></td>
                            <td><label for="weekday[2]">Вторник</label></td>
                            <td class="text-center"><input type="time" name="from_time[2]" id="from_time[2]"></td>
                            <td class="text-center"><input type="time" name="to_time[2]" id="to_time[2]"></td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" name="weekday[3]" id="weekday[3]"></td>
                            <td><label for="weekday[3]">Среда</label></td>
                            <td class="text-center"><input type="time" name="from_time[3]" id="from_time[3]"></td>
                            <td class="text-center"><input type="time" name="to_time[3]" id="to_time[3]"></td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" name="weekday[4]" id="weekday[4]"></td>
                            <td><label for="weekday[4]">Четверг</label></td>
                            <td class="text-center"><input type="time" name="from_time[4]" id="from_time[4]"></td>
                            <td class="text-center"><input type="time" name="to_time[4]" id="to_time[4]"></td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" name="weekday[5]" id="weekday[5]"></td>
                            <td><label for="weekday[5]">Пятница</label></td>
                            <td class="text-center"><input type="time" name="from_time[5]" id="from_time[5]"></td>
                            <td class="text-center"><input type="time" name="to_time[5]" id="to_time[5]"></td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" name="weekday[6]" id="weekday[6]"></td>
                            <td><label for="weekday[6]">Суббота</label></td>
                            <td class="text-center"><input type="time" name="from_time[6]" id="from_time[6]"></td>
                            <td class="text-center"><input type="time" name="to_time[6]" id="to_time[6]"></td>
                          </tr>
                          <tr>
                            <td><input type="checkbox" name="weekday[7]" id="weekday[7]"></td>
                            <td><label for="weekday[7]">Воскресенье</label></td>
                            <td class="text-center"><input type="time" name="from_time[7]" id="from_time[7]"></td>
                            <td class="text-center"><input type="time" name="to_time[7]" id="to_time[7]"></td>
                          </tr>
                        </tbody>
                      </table>
                </div>
            </div>
            <input class="btn btn-primary" type="submit" value="Добавить">
            <a href="/admin/moderator" class="btn btn-default">Отменить</a>
            <a href="#" class="btn btn-danger">Удалить</a>
        </form>
    </div>
@stop