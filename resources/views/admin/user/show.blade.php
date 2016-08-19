@extends('admin.layout')

@section('content')

<div class="x_content admin-user-page">

    <div id="user-tabs" class="x_content">
        <ul class="row admin-user-menu">
            <li class="col-md-2"><a href="#user-tabs-info">Информация</a></li>
            <li class="col-md-2"><a href="#user-tabs-publ">Публикации </a></li>
            <li class="col-md-2"><a href="#user-tabs-groups">Группы </a></li>
            <li class="col-md-2"><a href="#user-tabs-places">Места </a></li>
            <li class="col-md-2"><a href="#user-tabs-subscr">Подписчики </a></li>
            <li class="col-md-2"><a href="#user-tabs-mysubscr">Подписки </a></li>
        </ul>


        <div id="user-tabs-info" class="row">
            <div class="col-md-4">
                @if ($user->avatar_path)
                    <img class="admin-user-page-ava img-responsive" src="{{$user->avatar_path}}" alt="{{$user->avatar_path}}">
                @else
                    <img class="admin-user-page-ava img-responsive" src="/img/ava/moderator.png" alt="/img/ava/moderator.png">
                @endif
            </div>
            <div class="col-md-6">
                <h2>{{ $user->first_name.' '.$user->last_name }}</h2>
                <p>Пол:
                    <span>
                        @if ($user->gender == true)
                            Мужской
                        @else
                            Женский
                        @endif
                    </span>
                </p>
                <p>Возраст: <span>{{ $user->birthday=='0000-00-00' ? '---' : date_diff(new DateTime($user->birthday), new DateTime())->y }}</span></p>
                <p>Дата регистрации: <span>{{ $user->created_at }}</span></p>
                <p>Статус: <span>{{ $user->user_quote }}</span></p>
            </div>
        </div>


        <div id="user-tabs-publ" class="admin-user-page-content">
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
                      </tr>
                    </thead>
                    <tbody>
                    @foreach($publications as $publication)
                      <tr>
                        <td><a href="">{{$publication->id}}</a></td>
                        <td>{{$publication->text}}</td>
                        <td>{{$publication->user->first_name.' '.$publication->user->last_name}}</td>
                        <td class="mini-image">
                            <img src="{{$publication->images->first()->url}}" alt="{{$publication->images->first()->url}}">
                        </td>
                        <td>Нет видео</td>
                        <td>{{$publication->created_at}}</td>
                      </tr>
                      <tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <div id="user-tabs-groups" class="admin-user-page-content">
            <div class="moderator-content-table user-groups">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="col-id">id</th>
                        <th class="col-title">Название группы</th>
                        <th class="img-center col-cover">Обложка</th>
                        <th class="col-author">Создатель</th>
                        <th class="col-count">Количество участников</th>
                        <th class="col-time">Время создания</th>
                        <!-- <th class="col-do">Действия</th> -->
                      </tr>
                    </thead>
                    <tbody>
                    @foreach($groups as $group)
                      <tr>
                        <td><a href="">{{$group->id}}</a></td>
                        <td>{{$group->name}}</td>
                        <td class="img-center">
                            <img src="{{$group->avatar}}" alt="{{$group->avatar}}">
                        </td>
                        <td>{{$group->creator->first()->first_name}} {{$group->creator->first()->last_name}}</td>
                        <td>{{$group->users()->count()}}</td>
                        <td>{{$group->created_at}}</td>
                      </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>   
        </div>

        <div id="user-tabs-places" class="admin-user-page-content">
            <div class="moderator-content-table user-groups">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="col-id">id</th>
                        <th class="col-title">Название места</th>
                        <th class="img-center col-cover">Обложка</th>
                        <th class="col-author">Создатель</th>
                        <th class="col-count">Количество участников</th>
                        <th class="col-time">Время создания</th>
                        <!-- <th class="col-do">Действия</th> -->
                      </tr>
                    </thead>
                    <tbody>
                    @foreach($places as $place)
                      <tr>
                        <td><a href="">{{$place->id}}</a></td>
                        <td>{{$place->name}}</td>
                        <td class="img-center">
                            <img src="{{$place->cover}}" alt="{{$place->cover}}">
                        </td>
                        {{--<td>{{$place->creator->first()->first_name}} {{$place->creator->first()->last_name}}</td>--}}
                        <td>{{$place->users()->count()}}</td>
                        <td>{{$place->created_at}}</td>
                      </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>   
        </div>
        <div id="user-tabs-subscr" class="admin-user-page-contacts">
            <div class="admin-user-contacts">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="col-id">id</th>
                        <th class="col-ava">Аватар</th>
                        <th class="col-name">Имя</th>
                        <th class="col-gender">Пол</th>
                        <th class="col-age">Возраст</th>
                        <th class="col-registration">Дата регистрации</th>
                      </tr>
                    </thead>
                    <tbody>
                    @foreach($subscriptions as $subscription)
                      <tr>
                        <td>{{$subscription->id}}</td>
                        <td class="text-center">
                            @if ($subscription->avatar_path)
                                <img  src="{{$subscription->avatar_path}}" alt="{{$subscription->avatar_path}}">
                            @else
                                <img  src="/img/ava/moderator.png" alt="/img/ava/moderator.png">
                            @endif
                        </td>
                        <td>{{ $subscription->first_name.' '.$subscription->last_name }}</td>
                        <td>
                            @if ($subscription->gender == true)
                                Мужской
                            @else
                                Женский
                            @endif
                        </td>
                        <td>{{ $subscription->birthday=='0000-00-00' ? '---' : date_diff(new DateTime($user->birthday), new DateTime())->y }}</td>
                        <td>{{ $subscription->created_at }}</td>
                      </tr>
                      @endforeach
                    </tbody>
                </table>
            </div>
        </div>


        <div id="user-tabs-mysubscr" class="admin-user-page-contacts">
            <div class="admin-user-contacts">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th class="col-id">id</th>
                        <th class="col-ava">Аватар</th>
                        <th class="col-name">Имя</th>
                        <th class="col-gender">Пол</th>
                        <th class="col-age">Возраст</th>
                        <th class="col-registration">Дата регистрации</th>
                      </tr>
                    </thead>
                    <tbody>
                    @foreach($subscribers as $subscriber)
                      <tr>
                        <td>{{$subscriber->id}}</td>
                        <td class="text-center">
                            @if ($subscriber->avatar_path)
                                <img  src="{{$subscriber->avatar_path}}" alt="{{$subscriber->avatar_path}}">
                            @else
                                <img  src="/img/ava/moderator.png" alt="/img/ava/moderator.png">
                            @endif
                        </td>
                        <td>{{ $subscriber->first_name.' '.$subscriber->last_name }}</td>
                        <td>
                            @if ($subscriber->gender == true)
                                Мужской
                            @else
                                Женский
                            @endif
                        </td>
                        <td>{{ $subscriber->birthday=='0000-00-00' ? '---' : date_diff(new DateTime($subscriber->birthday), new DateTime())->y }}</td>
                        <td>{{ $subscriber->created_at }}</td>
                      </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>
    <script>
        $( "#user-tabs" ).tabs();
    </script>
@stop