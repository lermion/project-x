@extends('admin.layout')

@section('content')

	<div class="x_content">
        <div class="complains-menu">
            <ul class="row admin-settings-menu">
                <li class="col-md-3 col-md-offset-3  @if ($url == 'Publication') active @endif"><a href="{{action('Admin\ComplaintsController@index')}}">Публикации</a></li>
                <li class="col-md-3 @if ($url == 'Comments') active @endif"><a href="{{action('Admin\ComplaintsController@comments')}}">Комментарии</a></li>
            </ul>
        </div>
        <div class="moderator-complaints">
            <table class="table table-bordered">
                <thead>
                  <tr>
                    <th class="col-id">id</th>
                    <th class="col-text">Текст</th>
                    <th class="col-author">Автор</th>
                    <th class="col-img">Картинки</th>
                    <th class="col-who">Кто пожаловался</th>
                    <th class="col-complains">Жалобы</th>
                    <th class="col-do">Действия</th>
                  </tr>
                </thead>
                <tbody>
                @foreach($complaints as $complaint)
                  <tr>
                    <td>{{$complaint->id}}</td>
                      @if ($complaint->comment)
                          <td><p>Комментарий:</p>{{$complaint->comment}}</td>
                      @else
                          <td><p>Публикация:</p>{{$complaint->publication}}</td>
                      @endif
                    <td>{{$complaint->user_to_login}}</td>
                    <td class="mini-image">
                        @if ($complaint->comment)
                            <p>Нет картинки</p>
                        @else
                            <img class="js-show-modal-image"
                                 src="{{$complaint->publication_cover}}"
                                 alt="{{$complaint->publication_cover}}">
                        @endif
                    </td>
                    <td>{{$complaint->user_which_login}}</td>
                    <td>{{$complaint->complaint}}</td>
                    <td class="admin-user-contacts-action">
                        @if ($complaint->comment)
                            <a href="/admin/complaints/delete_complaint_comment/{{$complaint->id}}"><button class="btn btn-success btn-xs">Отменить жалобу</button></a>
                            <a href="/admin/complaints/delete_comment/{{$complaint->id}}"><button class="btn btn-danger btn-xs">Удалить комментарий</button></a>
                        @else
                            <a href="/admin/complaints/delete_complaint_publication/{{$complaint->id}}"><button class="btn btn-success btn-xs">Отменить жалобу</button></a>
                            <a href="/admin/complaints/delete_publication/{{$complaint->publication_id}}"><button class="btn btn-danger btn-xs">Блокировать контент</button></a>
                        @endif
                    </td>
                  </tr>

                @endforeach
                </tbody>
            </table>
        </div>
    </div>

<!-- Creates the bootstrap modal where the image will appear -->
<div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title" id="myModalLabel">Image preview</h4>
            </div>
            <div class="modal-body">
                <img src="" id="imagepreview" class="img-responsive">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
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

        $(".js-show-modal-image").on("click", function() {
            $('#imagepreview').attr('src', $(this).attr('src')); // here asign the image to the modal when the user click the enlarge link
            $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
        });

    </script>

    {!! $complaints->render() !!}
@stop
