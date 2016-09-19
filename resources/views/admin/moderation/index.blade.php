@extends('admin.layout')

@section('content')

    <div class="x_content admin-user-page-content">
        <div class="admin-settings">
            <ul class="row admin-settings-menu">
                <li class="col-md-2 col-md-offset-3 active"><a href="/admin/moderation/">Публикации </a></li>
                <li class="col-md-2"><a href="/admin/moderation/groups">Группы </a></li>
                <li class="col-md-2"><a href="/admin/moderation/places">Места </a></li>
            </ul>
        </div>

        <div class="admin-settings">
            <ul class="col-md-12 admin-settings-menu">
                <li class="col-md-2 @if ($url == 'New') active @endif"><a href="/admin/moderation/">Новые </a></li>
                <li class="col-md-2 @if ($url == 'Topic') active @endif"><a href="/admin/moderation/publications_is_topic">Тема дня </a></li>
                <li class="col-md-2 @if ($url == 'Note') active @endif"><a href="/admin/moderation/publications_to_note">На заметке </a></li>
                <li class="col-md-2 @if ($url == 'Block') active @endif"><a href="/admin/moderation/publications_is_block">Заблокированные </a></li>
                <li class="col-md-2 @if ($url == 'Moderate') active @endif"><a href="/admin/moderation/publications_is_moderate">Подтвержденные </a></li>
                <li class="col-md-2 @if ($url == 'Main') active @endif"><a href="/admin/moderation/publications_is_main">На главной </a></li>
            </ul>
        </div>

        <div class="moderator-content-table publication">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-text">Текст публикации</th>
                    <th class="col-author">Имя автора</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-video">Видео</th>
                    <th class="col-time">Время создания</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($publications as $publication)
                  <tr>
                    <td><a target="_blank" href="/p/{{$publication->id}}/{{md5($publication->id)}}">{{$publication->id}}</a></td>
                    <td>{{$publication->text}}</td>
                    <td>{{$publication->user->first_name.' '.$publication->user->last_name}}</td>
                    <td class="mini-image">
                        @if ($publication->images->first() != null)
                            <img src="{{$publication->images->first()->url}}" alt="{{$publication->images->first()->url}}">
                        @else
                            Нет картинки
                        @endif
                    </td>
                    <td class="mini-image">
                        @if ($publication->videos->first() != null)
                            <img src="/{{$publication->videos->first()->img_url}}" alt="{{$publication->videos->first()->img_url}}">
                        @else
                            Нет видео
                        @endif
                    </td>
                    <td>{{$publication->created_at}}</td>
                    <td class="text-center">
                            @if ($publication->is_block == false)
                            <a type="button" class="btn btn-danger btn-xs" href="/admin/moderation/block_publication/{{$publication->id}}">Блокировать</a>
                            @endif
                            @if ($publication->is_moderate == false)
                                    <a type="button" class="btn btn-success btn-xs" href="/admin/moderation/confirm_publication/{{$publication->id}}">Подтвердить</a>
                            @endif
                            @if ($publication->is_topic == false)
                                    <a type="button" class="btn btn-primary btn-xs" href="/admin/moderation/publications_topic/{{$publication->id}}">Тема дня</a>
                            @endif
                                @if ($publication->to_note == false)
                                    <a type="button" class="btn btn-warning btn-xs" href="/admin/moderation/note_publication/{{$publication->id}}">На заметку</a>
                                @endif
                            @if ($publication->is_main == false)
                                    <a type="button" class="btn btn-info btn-xs" href="/admin/moderation/publications_main/{{$publication->id}}">На главную</a>
                            @endif
                    </td>
                  </tr>
                @endforeach
                {{--{{dd($publication)}}--}}
                </tbody>
            </table>
        </div>
    </div>
    <script>
        $('.admin-settings-menu li a').each(function () {
            var location = window.location.href;
            var link = this.href;
            location += "/";
            var index = location.indexOf(link);
            console.log(index);
            if(location == link) {
                $(this).addClass('active');
            }
        });
    </script>
    {!! $publications->render() !!}
@stop