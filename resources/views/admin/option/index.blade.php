@extends('admin.layout')

@section('content')

	    <div class="x_content admin-settings">
	        <ul class="row admin-settings-menu">
	            <li class="col-md-3 active"><a href="">Общие настройки</a></li>
	            <li class="col-md-3"><a href="">Ограничения</a></li>
	        </ul>
	    </div>
    
    <div class="x_content admin-settings-data">
        <div class="row">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-md-3">
                        <label for="contacts">Контакты:</label>
                    </div>
                    <div class="col-md-7">
                        <textarea class="form-control" rows="5" id="contacts">ООО "Интерфинити"
+7 (495) 120-33-78
interfiniti.ltd@gmail.com
                        </textarea>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-3">
                        <label for="сopyright">Copyright:</label>
                    </div>
                    <div class="col-md-7">
                        <input class="form-control" id="сopyright" type="text" value="interfiniti">
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-3">
                        <label for="message-to-admin">Письмо админу:</label>
                    </div>
                    <div class="col-md-7">
                        <input class="form-control" id="message-to-admin" type="text" value="xmugutdin@gmail.com">
                    </div>
                </div>

                <p>
                    <button class="btn btn-primary">
                        Сохранить
                    </button>
                </p>
            </div>
        </div>
    </div>

<br>

    <div class="x_content admin-settings-limit">
        <div class="row">
            <p>Пользователь за <input type="text" class="miniText form-control" value="60"> мин. может написать не более <input type="text" class="miniText form-control" value="50"> новым юзерам.</p>
            <div class="admin-settings-limit-toggle-btn"><span>Пользователь, не загрузивший свое фото, не может просматривать фото других пользователей</span>
                <div class="switch">
                  <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox">
                  <label for="cmn-toggle-1"></label>
                </div>
            </div>
            
            <p><button type="button" class="btn btn-primary">Сохранить</button></p>
        </div>
    </div>

@stop