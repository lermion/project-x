@extends('admin.layout')

@section('content')

	    <div id="settings-tab" class="admin-settings">
	        <ul class="row admin-settings-menu">
	            <li class="col-md-3 col-md-offset-3"><a href="#settings-tab-common">Общие настройки</a></li>
	            <li class="col-md-3"><a href="#settings-tab-limit">Ограничения</a></li>
	        </ul>
            <form action="{{action('Admin\OptionController@create')}}" method="post">
                <div id="settings-tab-common" class="admin-settings-data">
                    <div class="row settings-tab-common-inner">
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-4">
                                    <label for="contacts">Контакты:</label>
                                </div>
                                <div class="col-md-7">
                                    <textarea class="form-control" rows="5" name="contacts" id="contacts">{{$option->contacts}}
                                    </textarea>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <label for="сopyright">Copyright:</label>
                                </div>
                                <div class="col-md-7">
                                    <input class="form-control" id="сopyright" name="copyright" type="text" value="{{$option->copyright}}">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <label for="message-to-admin">Письмо админу:</label>
                                </div>
                                <div class="col-md-7">
                                    <input class="form-control" id="message-to-admin" name="mail" type="text" value="{{$option->mail}}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="settings-tab-limit" class="admin-settings-limit">
                    <div class="row">
                        <p>Пользователь за <input type="number" class="miniText form-control" name="time_chat_message" value="{{$option->time_chat_message}}"> мин. может написать не более <input type="number" class="miniText form-control" name="users_chat_message" value="{{$option->users_chat_message}}"> новым юзерам.</p>
                        <div class="admin-settings-limit-toggle-btn"><span>Пользователь, не загрузивший свое фото, не может просматривать фото других пользователей</span>
                            <div class="switch">
                              <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox" @if ($option->user_foto_bloc == true)checked @endif  name="user_foto_bloc">
                              <label for="cmn-toggle-1"></label>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
            </form>

            <form action="{{action('Admin\OptionController@mainPicture')}}" method="post" enctype="multipart/form-data">
	            <div class="row admin-promo-main-img">
	                <div class="col-md-3 lh">
	                    Изображение на главной: 
	                </div>
	                <form action="{{action('Admin\OptionController@mainPicture')}}" method="post" enctype="multipart/form-data">
	                <div class="col-md-3 col-sm-3 col-xs-6">
	                    <img src="/images/bc.png" class="img-responsive" alt="/images/bc.png">
	                </div>
	                <div class="col-md-3">
	                    <input type="file" name="picture">
	                </div>     	
	            </div>
	            <div class="row">
	                	<p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
	                </div>
            </form>
	    </div>


    <script>
            $( "#settings-tab" ).tabs();
    </script>
        
@stop