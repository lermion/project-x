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
        Route::post('create', 'AuthController@store');
    });

    Route::get('test', function(){
        echo "<form action=\"http://pp.dev/auth/create\" method=\"post\">
            <input type='text' name='phone'><br>
            <input type='text' name='country_id'><br>
            <input type=\"submit\">
        </form>";
    });
});
