@extends('admin.layout')

@section('content')

	<div class="admin-mail">
		<div class="complains-menu">
            <ul class="row admin-settings-menu">
                <li class="col-md-2 col-md-offset-3 active"><a href="/admin/mail/">Новые </a></li>
                <li class="col-md-2"><a href="/admin/mail/get_closed/">Закрытые </a></li>
                <li class="col-md-2"><a href="/admin/mail/get_review/">На заметке </a></li>
            </ul>
        </div>
        <div class="admin-mail-to">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-ava">Аватар</th>
                    <th class="col-name">Имя</th>
                    <th class="col-mail">E-mail</th>
                    <th class="col-message">Сообщение</th>
                    <th class="col-registration">Дата</th>
                    <th class="col-type">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($mails as $mail)
                  <tr>
                    <td>{{$mail->id}}</td>
                    <td class="text-center">
                        @if ($mail->avatar)
                            <a href="/admin/user/show/{{$mail->user_id}}"><img src="{{$mail->avatar}}" alt="{{$mail->avatar}}"></a>
                        @else
                            <img src="/img/ava/moderator.png" alt="/img/ava/moderator.png">
                        @endif
                    </td>
                    <td>{{$mail->name}}</td>
                    <td>{{$mail->email}}</td>
                    <td>{{$mail->text}}</td>
                    <td>{{$mail->date}}</td>
                    <td class="admin-user-contacts-action">
                        @if ($mail->status !== 'Closed')
                        <a href="/admin/mail/status_closed/{{$mail->id}}"><button class="btn btn-primary btn-xs">Закрыть</button></a>
                        @endif
                        @if ($mail->status !== 'Review' and $mail->status !== 'Closed')
                            <a href="/admin/mail/status_review/{{$mail->id}}"><button class="btn btn-warning btn-xs">На заметку</button></a>
                        @endif
                        <a href="/admin/mail/destroy/{{$mail->id}}"><button class="btn btn-danger btn-xs">Удалить</button></a>
                    </td>
                  </tr>
                @endforeach
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
    {!! $mails->render() !!}
@stop