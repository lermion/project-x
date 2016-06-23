@extends('moderator.layout')
@section('content')
    <div class="row">
        <div class="">
            <h3>Редактирование профиля</h3>
            <form action="{{ action('Moderator\IndexController@update') }}" method="post" enctype="multipart/form-data">
                <label for="first_name">Имя</label><br>
                <input type="text" name="first_name" id="first_name" value="{{ $moderator->first_name }}" required><br>
                <label for="last_name">Фамилия</label><br>
                <input type="text" name="last_name" id="last_name" value="{{ $moderator->last_name }}" required><br>
                <label for="password">Пароль</label><br>
                <input type="password" name="password" id="password" required><br><br>
                @if($moderator->photo)
                    <img src="{{ $moderator->photo }}" style="width: 150px"><br><br>
                @endif
                <input type="file" name="photo"><br>
                <input type="submit" class="btn btn-success btn-xs">
            </form>
        </div>
    </div>
@stop