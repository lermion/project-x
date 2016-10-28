@extends('admin.layout')
@section('content')
    <div style="width:100%; height:auto;">

        <h3>Редактирование модератора
            @if (session()->has('message'))
                <br><h3 style="color: red;"> {{session()->pull('message')}}</h3>
            @endif</h3>

        <form action="{{ action('Admin\ModeratorController@updateSave') }}" method="post" enctype="multipart/form-data">
            <div class="row">
                <div class="col-md-3 admin-moderator-avatar">
                    <div>
                        <img src="{{$moderators->photo}}" alt="{{$moderators->photo}}">
                    </div>
                    <div>
                        <input type="file" name="photo" id="photo">
                    </div>
                </div>
                <div class="col-md-3">
                    <input type="hidden" name="id" value="{{$moderators->id}}">
                    <label for="email" >Email</label><br>
                    <input class="form-control" type="email" name="email" id="email" value="{{$moderators->email}}" required><br>
                    <label for="password">Пароль</label><br>
                    <input class="form-control"  type="password" name="password" id="password"><br>
                    <label for="first_name">Имя</label><br>
                    <input class="form-control"  type="text" name="first_name" id="first_name" value="{{$moderators->first_name}}" required><br>
                    <label for="last_name">Фамилия</label><br>
                    <input class="form-control"  type="text" name="last_name" id="last_name" value="{{$moderators->last_name}}" required><br>
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
                            <td><input type="checkbox" name="weekday[1]" id="weekday[1]"
                                @foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 1)
                                        checked
                                            @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[1]">Понедельник</label></td>
                            <td class="text-center"><input id="fgewgewghewge" class="timepicker" type="time" name="from_time[1]" id="from_time[1]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 1)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[1]" id="to_time[1]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 1)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" name="weekday[2]" id="weekday[2]"
                                       @foreach($moderators['working_hours'] as $working_hour)
                                       @if ($working_hour->weekday == 2)
                                       checked
                                        @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[2]">Вторник</label></td>
                            <td class="text-center"><input class="timepicker" type="time" name="from_time[2]" id="from_time[2]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 2)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[2]" id="to_time[2]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 2)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" name="weekday[3]" id="weekday[3]"
                                       @foreach($moderators['working_hours'] as $working_hour)
                                       @if ($working_hour->weekday == 3)
                                       checked
                                        @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[3]">Среда</label></td>
                            <td class="text-center"><input class="timepicker" type="time" name="from_time[3]" id="from_time[3]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 3)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[3]" id="to_time[3]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 3)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" name="weekday[4]" id="weekday[4]"
                                       @foreach($moderators['working_hours'] as $working_hour)
                                       @if ($working_hour->weekday == 4)
                                       checked
                                        @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[4]">Четверг</label></td>
                            <td class="text-center"><input class="timepicker" type="time" name="from_time[4]" id="from_time[4]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 4)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[4]" id="to_time[4]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 4)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" name="weekday[5]" id="weekday[5]"
                                       @foreach($moderators['working_hours'] as $working_hour)
                                       @if ($working_hour->weekday == 5)
                                       checked
                                        @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[5]">Пятница</label></td>
                            <td class="text-center"><input class="timepicker" type="time" name="from_time[5]" id="from_time[5]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 5)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[5]" id="to_time[5]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 5)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" name="weekday[6]" id="weekday[6]"
                                       @foreach($moderators['working_hours'] as $working_hour)
                                       @if ($working_hour->weekday == 6)
                                       checked
                                        @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[6]">Суббота</label></td>
                            <td class="text-center"><input class="timepicker" type="time" name="from_time[6]" id="from_time[6]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 6)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[6]" id="to_time[6]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 6)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        <tr>
                            <td><input type="checkbox" name="weekday[0]" id="weekday[0]"
                                       @foreach($moderators['working_hours'] as $working_hour)
                                       @if ($working_hour->weekday == 0)
                                       checked
                                        @endif
                                        @endforeach>
                            </td>
                            <td><label for="weekday[0]">Воскресенье</label></td>
                            <td class="text-center"><input class="timepicker" type="time" name="from_time[0]" id="from_time[0]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 0)
                                        {{$working_hour->from_time}}
                                            @endif
                                        @endforeach>
                            </td>
                            <td class="text-center"><input class="timepicker" type="time" name="to_time[0]" id="to_time[0]"
                            value=@foreach($moderators['working_hours'] as $working_hour)
                                    @if ($working_hour->weekday == 0)
                                        {{$working_hour->to_time}}
                                            @endif
                                        @endforeach>
                            </td>
                        </tr>
                        </tbody>

                    </table>
                </div>
            </div>
            <input type="hidden" name="id" value="{{$moderators->id}}">
            <input class="btn btn-primary" type="submit" value="Изменить">
            <a href="/admin/moderator" class="btn btn-default">Отменить</a>
            <a href="/admin/moderator/destroy/{{$moderators->id}}" class="btn btn-danger deleteConfirm-mod">Удалить</a>
        </form>
    </div>

    <script>
        $(document).ready(function(){
            $("input[type='submit']").on("click", function () {
                $("input[type='checkbox']").removeAttr("disabled");
            })
            $("input[name^='to_time'], input[name^='weekday']").attr("disabled","disabled");

            $.each($("input[name^='from_time']"), function(index,val){
                if($(val).val() != "") {
                    $(val).parent().next().find('input').removeAttr("disabled");
                }
            });

            $.each($("input[name^='to_time']"), function(index,val){
                if($(val).val() != "") {
                    $(val).parent().prev().prev().prev().find('input').prop("checked",true);
                }
            });

            $("input[name^='from_time']").on("change", function(){
                if($(this).val() != "") {
                    $(this).parent().next().find('input').removeAttr("disabled")
                } else {
                    $(this).parent().next().find('input').attr("disabled","disabled").val("")
                    $(this).parent().prev().prev().find('input').prop("checked",false);
                }
            })
            $("input[name^='to_time']").on("change", function(){
                if($(this).val() != "") {
                    $(this).parent().prev().prev().prev().find('input').prop("checked",true);
                } else {$(this).parent().prev().prev().prev().find('input').prop("checked",false);}
            })

        });
        $("input.timepicker").timepicker({
            'timeFormat': 'H:i'
        });
        $(".deleteConfirm-mod").click(function(event) {
            var c = confirm("Вы действительно хотите удалить?");
            console.log(c);
            if(!c) {
                event.preventDefault();
                return false;
            }
        })
    </script>
@stop