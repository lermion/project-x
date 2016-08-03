@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto;">

        <h3>Добавление модератора</h3>
        @if(isset($error))
            {{ $error }}
        @endif
        <form action="{{ action('Admin\ModeratorController@store') }}" method="post" enctype="multipart/form-data">
            <label for="email">Email</label><br>
            <input type="email" name="email" id="email" required><br>
            <label for="password">Пароль</label><br>
            <input type="password" name="password" id="password" required><br>
            <label for="first_name">Имя</label><br>
            <input type="text" name="first_name" id="first_name" required><br>
            <label for="last_name">Фамилия</label><br>
            <input type="text" name="last_name" id="last_name" required><br><br>
            <label for="photo">Аватар</label><br>
            <input type="file" name="photo" id="photo" required><br><br>
            <div class="row row-margin-none">
                <label for="photo">Дни работы</label><br>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday1" id="weekday1" value="1">Пон.<br>
                    <input type="time" name="from_time1" id="from_time1">От<br>
                    <input type="time" name="to_time1" id="to_time1">До
                </div>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday2" id="weekday2" value="2">Вт.<br>
                    <input type="time" name="from_time2" id="from_time2">От<br>
                    <input type="time" name="to_time2" id="to_time2">До<br><br>
                </div>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday3" id="weekday3" value="3">Ср.<br>
                    <input type="time" name="from_time3" id="from_time3">От<br>
                    <input type="time" name="to_time3" id="to_time3">До<br><br>
                </div>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday4" id="weekday4" value="4">Чт.<br>
                    <input type="time" name="from_time4" id="from_time4">От<br>
                    <input type="time" name="to_time4" id="to_time4">До<br><br>
                </div>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday5" id="weekday5" value="5">Пят.<br>
                    <input type="time" name="from_time5" id="from_time5">От<br>
                    <input type="time" name="to_time5" id="to_time5">До<br><br>
                </div>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday6" id="weekday6" value="6">Сб.<br>
                    <input type="time" name="from_time6" id="from_time6">От<br>
                    <input type="time" name="to_time6" id="to_time6">До<br><br>
                </div>
                <div class="col-md-3">
                    <input type="checkbox" name="weekday7" id="weekday7" value="7">Вс.<br>
                    <input type="time" name="from_time7" id="from_time7">От<br>
                    <input type="time" name="to_time7" id="to_time7">До<br><br>
                </div>
            </div>
            <input class="btn btn-primary" type="submit" value="Добавить">
        </form>



    </div>
@stop