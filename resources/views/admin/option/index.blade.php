@extends('admin.layout')

@section('content')

	    <div id="settings-tab" class="admin-settings">
	        <ul class="row admin-settings-menu">
	            <li class="col-md-3"><a href="#settings-tab-common">Общие настройки</a></li>
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
                                    <textarea class="form-control" rows="5" id="contacts">Контакты
                                    </textarea>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <label for="сopyright">Copyright:</label>
                                </div>
                                <div class="col-md-7">
                                    <input class="form-control" id="сopyright" type="text" value="interfinity">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4">
                                    <label for="message-to-admin">Письмо админу:</label>
                                </div>
                                <div class="col-md-7">
                                    <input class="form-control" id="message-to-admin" type="text" value="xmugutdin@gmail.com">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="settings-tab-limit" class="admin-settings-limit">
                    <div class="row">
                        <p>Пользователь за <input type="text" class="miniText form-control" value=""> мин. может написать не более <input type="text" class="miniText form-control" value=""> новым юзерам.</p>
                        <div class="admin-settings-limit-toggle-btn"><span>Пользователь, не загрузивший свое фото, не может просматривать фото других пользователей</span>
                            <div class="switch">
                              <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox">
                              <label for="cmn-toggle-1"></label>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <p class="mg-l"><input class="btn btn-primary" type="submit" value="Сохранить"></p>
            </form>
	    </div>


    <script>
            $( "#settings-tab" ).tabs();
    </script>
        
@stop