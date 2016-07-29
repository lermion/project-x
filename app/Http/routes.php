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
            Route::get('confirm/{id}', 'Admin\UserController@confirm');
            Route::get('review/{id}', 'Admin\UserController@review');
            Route::get('suspicious/{id}', 'Admin\UserController@suspicious');
            Route::get('delete/{id}/{month}', 'Admin\UserController@destroy');
            Route::get('show/{id}', 'Admin\UserController@show');
            Route::get('get_confirm', 'Admin\UserController@getConfirm');
            Route::get('get_review', 'Admin\UserController@getReview');
            Route::get('get_suspicious', 'Admin\UserController@getSuspicious');
            Route::post('main_picture', 'Admin\UserController@mainPicture');
            Route::get('option', 'Admin\OptionController@index');
            Route::post('create_option', 'Admin\OptionController@create');
            Route::post('update_option/{id}', 'Admin\OptionController@update');
        });
        Route::group(['prefix' => 'moderator'], function () {
            Route::get('/', 'Admin\ModeratorController@index');
            Route::get('create', 'Admin\ModeratorController@create');
            Route::post('store', 'Admin\ModeratorController@store');
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
        Route::get('show/{login}', 'UserController@show');
        Route::post('{id}/publication', 'PublicationController@userPublication')->middleware(['auth']);
        Route::post('subscribe/store', 'SubscriberController@store')->middleware(['auth']);
        Route::get('subscribe/confirm/{id}', 'SubscriberController@confirm')->middleware(['auth']);
        Route::get('{id}/subscription', 'SubscriberController@subscription');
        Route::get('{id}/subscribers', 'SubscriberController@subscribers');
    });
    Route::get('country', 'CountryController@index');
    Route::get('city/{country_id}', 'CityController@index');
    Route::get('static_page/{name}', 'StaticPageController@show');
    Route::get('static_page/get/name', 'StaticPageController@getNames');

    Route::group(['prefix' => 'password'], function () {
        Route::post('update', 'PasswordController@update')->middleware(['auth']);
        Route::post('amend', 'PasswordController@amendPassword');
        Route::post('restore', 'PasswordController@restore');
        Route::post('validate_code', 'PasswordController@validateCode');
    });

    Route::group(['prefix' => 'group', 'middleware' => 'auth'], function () {

        Route::get('counter_new_group', 'GroupController@counter_new_group');
        Route::get('/', 'GroupController@index');
        Route::get('admin_group', 'GroupController@adminGroup');
        Route::post('store', 'GroupController@store')->middleware(['auth']);;
        Route::get('show/{name}', 'GroupController@show');
        Route::post('update/{id}', 'GroupController@update');
        Route::get('destroy/{id}', 'GroupController@destroy');
        Route::get('subscription/{id}', 'GroupController@subscription');
        Route::post('delete_subscription/{id}', 'GroupController@admin_subscription_delete');
        Route::post('invite/{group_id}', 'GroupController@invite');
        Route::get('set_user_admin/{group_id}/{user_id}', 'GroupController@setUserAdmin');
        Route::get('set_admin_creator/{group_id}/{admin_id}', 'GroupController@setUserCreator');
        Route::group(['prefix' => '{groupId}/publication'], function () {
            Route::get('/', 'GroupPublicationController@index');
            Route::post('store', 'GroupPublicationController@store');
            Route::post('update/{id}', 'GroupPublicationController@update');
            Route::group(['prefix' => '{publicationId}/comment'], function () {
                Route::post('store', 'GroupPublicationCommentController@store');
            });
        });
    });

    Route::group(['prefix' => 'moderator'], function () {
        Route::group(['middleware' => 'moderator'], function () {
            Route::get('/', 'Moderator\IndexController@index');
            Route::get('edit', 'Moderator\IndexController@edit');
            Route::post('update', 'Moderator\IndexController@update');
            Route::get('logout', 'Moderator\AuthController@logout');
            Route::group(['prefix' => 'moderate'], function () {
                Route::get('/', 'Moderator\ModerateController@index');
                Route::get('confirm/{id}', 'Moderator\ModerateController@confirm');
                Route::get('topic/{id}', 'Moderator\ModerateController@topic');
                Route::post('block/{id}', 'Moderator\ModerateController@block');
            });
        });
        Route::get('login', 'Moderator\AuthController@login');
        Route::post('auth', 'Moderator\AuthController@auth');

    });

    Route::group(['prefix' => 'publication'], function () {
        Route::post('/', 'PublicationController@index');
        Route::get('/topic', 'PublicationController@topic');
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
            Route::post('complaint', 'ComplaintCommentController@create')->middleware(['auth']);

        });
    });

    Route::group(['prefix' => 'place', 'middleware' => 'auth'], function () {

        Route::get('counter_new_place', 'PlaceController@counter_new_place');
        Route::get('/', 'PlaceController@index');
        Route::get('admin_place', 'PlaceController@adminPlace');
        Route::post('create', 'PlaceController@create')->middleware(['auth']);
        Route::get('show/{name}', 'PlaceController@show');
        Route::post('update/{id}', 'PlaceController@update');
        Route::get('destroy/{id}', 'PlaceController@destroy');
        Route::get('set_user_admin/{place_id}/{user_id}', 'PlaceController@setUserAdmin');
        Route::get('set_admin_creator/{place_id}/{admin_id}', 'PlaceController@setUserCreator');
        Route::get('subscription/{id}', 'PlaceController@subscription');
        Route::post('delete_subscription/{id}', 'PlaceController@admin_subscription_delete');
        Route::post('invite/{place_id}', 'PlaceController@invite');
        Route::group(['prefix' => '{placeId}/publication'], function () {
            Route::get('/', 'PlacePublicationController@index');
            Route::post('store', 'PlacePublicationController@store');
            Route::post('update/{id}', 'PlacePublicationController@update');
            Route::get('destroy/{id}', 'PlacePublicationController@destroy');
            Route::group(['prefix' => '{publicationId}/comment'], function () {
                Route::post('store', 'PlacePublicationCommentController@store');
            });
        });
        Route::group(['prefix' => 'type'], function () {
            Route::post('create', 'TypePlaceController@create');
            Route::get('static', 'TypePlaceController@getStatic');
            Route::get('dynamic', 'TypePlaceController@getDynamic');
        });

    });

    Route::group(['prefix' => 'chat'], function () {
        Route::get('locked/{locked_user_id}', 'ChatController@locked');
        Route::get('get_locked_users', 'ChatController@get_locked_users');
        Route::get('delete_chat/{room_id}', 'ChatController@delete_chat');
        Route::get('delete_user/{room_id}/{user_id_sub}', 'ChatController@delete_user');
        Route::get('notification/{room_id}', 'ChatController@notification_chat');
        Route::get('correspondence_delete/{room_id}', 'ChatController@correspondence_delete');
        Route::get('file_chat/{room_id}', 'ChatController@file_chat');
    });

    Route::group(['prefix' => 'mail'], function () {
        Route::get('/', 'MailController@index');
        Route::get('get_review', 'MailController@get_review');
        Route::get('get_closed', 'MailController@get_closed');
        Route::post('create', 'MailController@create');
        Route::get('destroy/{id}', 'MailController@destroy');
        Route::get('status_closed/{id}', 'MailController@change_status_closed');
        Route::get('status_review/{id}', 'MailController@change_status_review');
    });

    Route::post('search','SphinxSearchController@search');
    Route::get('search', function () {
        echo "<form action=\"http://".$_SERVER['SERVER_NAME']."/search\" method=\"post\" enctype=\"multipart/form-data\">
            <input type='text' name='name'><br>
            <input type=\"checkbox\" name=\"usersearch\">По юзерам<br>
            <input type=\"checkbox\" name=\"publicationsearch\">По публикациям<br>
            <input type=\"checkbox\" name=\"placesearch\">По местам и публикациям<br>
            <input type=\"checkbox\" name=\"groupsearch\">По группам и публикациям<br>
            <input type=\"submit\">
            </form>";
    });
    Route::get('test', function () {
        echo "<form action=\"http://pp.dev/chat/file_chat/1\" method=\"get\" enctype=\"multipart/form-data\">
            <input type='text' name='name' value='1095'><br>
            <input type='text' name='description' value='1094'><br>
            <input type='text' name='city_id' value='1'><br>
            <input type='text' name='address'value='1'><br>
            <input type='text' name='coordinates_x' value='1'><br>
            <input type='text' name='coordinates_y' value='1'><br>
            <input type='text' name='type_place_id'><br>

            <input type=\"submit\">
            </form>";
    });
});
