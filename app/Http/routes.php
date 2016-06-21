<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::group(['middleware' => ['web']], function () {
    Route::get('/', function () {
        return view('welcome');
    });

    Route::group(['prefix' => 'admin'], function () {
        Route::get('/', 'Admin\HomeController@index');
        Route::group(['prefix' => 'user'], function () {
            Route::get('/', 'Admin\UserController@index');
            Route::get('delete/{id}/{month}', 'Admin\UserController@destroy');
            Route::get('show/{id}', 'Admin\UserController@show');
        });
        Route::group(['prefix' => 'static_page'], function () {
            Route::get('/', 'Admin\StaticPageController@index');
            Route::get('show/{id}', 'Admin\StaticPageController@show');
            Route::get('create', 'Admin\StaticPageController@create');
            Route::post('store', 'Admin\StaticPageController@store');
            Route::get('destroy/{id}', 'Admin\StaticPageController@destroy');
            Route::get('edit/{id}', 'Admin\StaticPageController@edit');
            Route::post('update/{id}', 'Admin\StaticPageController@update');
        });

    });
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/', 'AuthController@auth');
        Route::post('create', 'AuthController@store');
        Route::post('check_sms', 'AuthController@checkSMSCode');
        Route::get('log_out', 'AuthController@logOut');
    });
    Route::group(['prefix' => 'user'], function () {
        Route::post('update', 'UserController@update')->middleware(['auth']);
        Route::post('add_first_info', 'UserController@addFirstInfo');
        Route::get('show/{id}', 'UserController@show');
        Route::post('subscribe/store', 'SubscriberController@store');
        Route::get('{id}/publication', 'PublicationController@userPublication');
    });
    Route::get('country', 'CountryController@index');
    Route::get('static_page/{name}', 'StaticPageController@show');
    Route::get('static_page/get/name', 'StaticPageController@getNames');

    Route::group(['prefix' => 'password'], function () {
        Route::post('update', 'PasswordController@update')->middleware(['auth']);
        Route::post('amend', 'PasswordController@amendPassword');
        Route::post('restore', 'PasswordController@restore');
        Route::post('validate_code', 'PasswordController@validateCode');
    });

    Route::group(['prefix' => 'group', 'middleware' => 'auth'], function () {

        Route::get('/', 'GroupController@index');
        Route::post('store', 'GroupController@store')->middleware(['auth']);;
        Route::get('show/{name}', 'GroupController@show');
        Route::post('update/{id}', 'GroupController@update');
        Route::get('destroy/{id}', 'GroupController@destroy');
        Route::get('subscription/{id}', 'GroupController@subscription');
        Route::get('invite/{group_id}/{user_id}', 'GroupController@invite');
        Route::get('set_user_admin/{group_id}/{user_id}', 'GroupController@setUserAdmin');
        Route::group(['prefix' => '{id}/publication'], function () {
            Route::get('/', 'GroupPublicationController@index');
        });
    });

    Route::group(['prefix' => 'publication'], function () {
        Route::get('/', 'PublicationController@index');
        Route::post('store', 'PublicationController@store')->middleware(['auth']);
        Route::post('update/{id}', 'PublicationController@update')->middleware(['auth']);
        Route::get('show/{id}', 'PublicationController@show')->middleware(['auth']);
        Route::get('like/{id}', 'PublicationController@like')->middleware(['auth']);
        Route::get('destroy/{id}', 'PublicationController@destroy')->middleware(['auth']);
        Route::group(['prefix' => 'comment'], function () {
            Route::get('/{id}', 'PublicationCommentController@index');
            Route::post('store/{id}', 'PublicationCommentController@store')->middleware(['auth']);
            Route::get('destroy/{id}', 'PublicationCommentController@destroy')->middleware(['auth']);
            Route::get('like/{id}', 'PublicationCommentController@like')->middleware(['auth']);
        });
    });


    Route::get('test', function () {
        echo "<form action=\"http://pp.dev/publication/update/5\" method=\"post\" enctype=\"multipart/form-data\">
            <input type='text' name='text'><br>
            <input type=\"submit\">
        </form>";
    });
});
