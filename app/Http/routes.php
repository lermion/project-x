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
    });
    Route::get('country', 'CountryController@index');
    Route::get('static_page/{name}', 'StaticPageController@show');
    Route::group(['prefix' => 'password'], function()
    {
        Route::post('update', 'PasswordController@update');
        Route::post('restore', 'PasswordController@restore');
        Route::post('validate_code', 'PasswordController@validateCode');
    });


    Route::get('test', function(){
        echo "<form action=\"http://pp.dev/password/update\" method=\"post\">
            <input type='text' name='password'><br>
            <input type=\"submit\">
        </form>";
    });
});
