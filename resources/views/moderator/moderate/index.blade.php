@extends('moderator.layout')
@section('content')
    <style>
        .images img{
            width: 70px;
        }
    </style>
    <div class="row">
        <div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Text</th>
                        <th>User Name</th>
                        <th>Group Name</th>
                        <th>Images</th>
                        <th>Videos</th>
                        <th>Create Time</th>
                        <th>Topic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($publications as $publication)
                        <tr>
                            <td>{{ $publication->id }}</td>
                            <td>{{ $publication->text }}</td>
                            <td>{{ $publication->user->first_name.' '.$publication->user->last_name }}</td>
                            <td>{{ count($publication->group)>0 ? $publication->group[0]->name : '---' }}</td>
                            <td class="images">
                                @foreach($publication->images as $image)
                                    <img src="{{ $image->url }}">
                                @endforeach
                            </td>
                            <td>
                                @foreach($publication->videos as $video)
                                    <img src="{{ $video->url }}">
                                @endforeach
                            </td>
                            <td>{{ $publication->created_at }}</td>
                            <td>{{ $publication->is_topic? 'yes':'no' }}</td>
                            <td>
                                <a class="btn btn-danger btn-xs block-btn">Блокировать</a><br>
                                <form style="display: none" method="post" action="{{ action('Moderator\ModerateController@block',['id'=>$publication->id]) }}">
                                    <input type="text" name="message" placeholder="Причина блокировки:"><br>
                                    <input type="submit" class="btn btn-danger btn-xs">
                                </form>
                                <a href="{{ action('Moderator\ModerateController@confirm',['id'=>$publication->id]) }}" class="btn btn-success btn-xs">Подтвердить</a>
                                <a href="{{ action('Moderator\ModerateController@topic',['id'=>$publication->id]) }}" class="btn btn-success btn-xs">Тема дня</a>
                            </td>
                        </tr>
                    @endforeach
                <script>
                    var blockBtn = $('.block-btn');
                    blockBtn.on('click',function (e) {
                        var form = $(this).parents('td').find('form');
                        if(form.css('display')==='block') {
                            form.css('display','none');
                        }else {
                            form.css('display','block');
                        }
                        return false;
                    });
                </script>
                </tbody>
            </table>
        </div>
    </div>
@stop