@extends('admin.layout')

@section('content')

	    <div class="x_content admin-settings">
	        <div class="row admin-settings-menu">
	            <div class="col-md-3 active">Общие настройки</div>
	            <div class="col-md-3">Ограничения</div>
	        </div>
	    </div>
    
    <div class="x_content admin-settings-data">
        <div class="row">
            <div class="col-md-6">
                <h2>Сквозные данные</h2>
                <div class="row">
                    <div class="col-md-2">Контакты: </div>
                    <div class="col-md-8">
                        <textarea name="" id="" cols="30" rows="5">ООО "Интерфинити"
    +7 (495) 120-33-78
    interfiniti.ltd@gmail.com</textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-2">Copyright: </div>
                    <div class="col-md-8">
                        <input type="text" value="interfiniti">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">Письмо админу: </div>
                    <div class="col-md-8">
                        <input type="text" value="xmugutdin@gmail.com">
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
            <p>Пользователь за <input type="text" class="miniText" value="60"> мин. может написать не более <input type="text" class="miniText" value="50"> новым юзерам.</p>
            <div class="admin-settings-limit-toggle-btn"><span>Пользователь не загрузивший свое фото не может просматривать фото других пользователей</span>
                <div class="switch">
                  <input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox">
                  <label for="cmn-toggle-1"></label>
                </div>
            </div>
            
            <p><button type="button" class="btn btn-primary">Сохранить</button></p>
        </div>
    </div>

@stop