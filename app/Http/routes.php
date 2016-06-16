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

    Route::group(['prefix' => 'admin'], function()
    {
        Route::get('/', 'Admin\HomeController@index');
        Route::group(['prefix' => 'user'], function()
        {
            Route::get('/', 'Admin\UserController@index');
            Route::get('delete/{id}/{month}', 'Admin\UserController@destroy');
            Route::get('show/{id}', 'Admin\UserController@show');
        });
        Route::group(['prefix' => 'static_page'], function()
        {
            Route::get('/', 'Admin\StaticPageController@index');
            Route::get('show/{id}', 'Admin\StaticPageController@show');
            Route::get('create', 'Admin\StaticPageController@create');
            Route::post('store', 'Admin\StaticPageController@store');
            Route::get('destroy/{id}', 'Admin\StaticPageController@destroy');
            Route::get('edit/{id}', 'Admin\StaticPageController@edit');
            Route::post('update/{id}', 'Admin\StaticPageController@update');
        });

    });
    Route::group(['prefix' => 'auth'], function()
    {
        Route::post('/', 'AuthController@auth');
        Route::post('create', 'AuthController@store');
        Route::post('check_sms', 'AuthController@checkSMSCode');
        Route::get('log_out', 'AuthController@logOut');
    });
    Route::group(['prefix' => 'user'], function()
    {
        Route::post('update/{id}', 'UserController@update');
        Route::get('show/{id}', 'UserController@show');
        Route::post('subscribe/store', 'SubscriberController@store');
    });
    Route::get('country', 'CountryController@index');
    Route::get('static_page/{name}', 'StaticPageController@show');
    Route::get('static_page/get/name', 'StaticPageController@getNames');

    Route::group(['prefix' => 'password'], function()
    {
        Route::post('update', 'PasswordController@update');
        Route::post('restore', 'PasswordController@restore');
        Route::post('validate_code', 'PasswordController@validateCode');
    });


    Route::get('test', function(){
        echo "<form action=\"http://pp.hqsale.com/user/update/13\" method=\"post\" enctype=\"multipart/form-data\">
            <input type='file' name='avatar'><br>
            <input type=\"submit\">
        </form>";
    });
});
