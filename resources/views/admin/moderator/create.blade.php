@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto;">

        <h3>ДОбавление модератора</h3>
        @if(isset($error))
            {{ $error }}
        @endif
        <form action="{{ action('Admin\ModeratorController@store') }}" method="post">
            <label for="email">Email</label><br>
            <input type="email" name="email" id="email" required><br>
            <label for="password">Пароль</label><br>
            <input type="password" name="password" id="password" required><br>
            <label for="first_name">Имя</label><br>
            <input type="text" name="first_name" id="first_name" required><br>
            <label for="last_name">Фамилия</label><br>
            <input type="text" name="last_name" id="last_name" required><br><br>
            <input type="submit">
        </form>



    </div>
@stop