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
    Route::get('one_group/{name}', 'GroupController@show');
    Route::get('one_place/{name}', 'PlaceController@show');
    Route::get('one_publication/{id}', 'PublicationController@show');

    Route::group(['prefix' => 'admin'], function () {
        Route::group(['middleware' => 'moderator'], function () {
            Route::get('get_check_time/', 'Admin\PresenceCheckController@getCheckTime');
            Route::get('confirmation/{id}', 'Admin\PresenceCheckController@Confirmation');
            Route::get('/', 'Admin\HomeController@index');
            Route::get('statistic/{date}/{end_date}', 'Admin\HomeController@statistic');
            Route::get('count_new_users', 'Admin\HomeController@count_new_users');
            Route::get('logout', 'Admin\AuthController@logout');
            Route::group(['prefix' => 'user'], function () {
                Route::get('/', 'Admin\UserController@index');
                Route::get('get_users/', 'Admin\UserController@getUsers');
                Route::get('confirm/{id}', 'Admin\UserController@confirm');
                Route::get('review/{id}', 'Admin\UserController@review');
//                Route::get('suspicious/{id}', 'Admin\UserController@suspicious');
//                Route::get('delete/{id}/{month}', 'Admin\UserController@destroy');
                Route::get('show/{id}', 'Admin\UserController@show');
                Route::get('get_confirm', 'Admin\UserController@getConfirm');
//                Route::get('get_all', 'Admin\UserController@getAll');
//                Route::post('get_review', 'Admin\UserController@getReview');
//                Route::get('get_suspicious', 'Admin\UserController@getSuspicious');
            });
            Route::group(['prefix' => 'moderator'], function () {
                Route::get('/', 'Admin\ModeratorController@index');
                Route::get('create', 'Admin\ModeratorController@create');
                Route::get('stop/{id}', 'Admin\ModeratorController@stop');
                Route::get('stopped', 'Admin\ModeratorController@stopped');
                Route::get('update/{id}', 'Admin\ModeratorController@update');
                Route::post('update_save', 'Admin\ModeratorController@updateSave');
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

            Route::group(['prefix' => 'mail'], function () {
                Route::get('/', 'Admin\MailController@index');
                Route::get('get_review', 'Admin\MailController@get_review');
                Route::get('get_closed', 'Admin\MailController@get_closed');
                Route::get('destroy/{id}', 'Admin\MailController@destroy');
                Route::get('status_closed/{id}', 'Admin\MailController@change_status_closed');
                Route::get('status_review/{id}', 'Admin\MailController@change_status_review');
            });
            Route::group(['prefix' => 'option'], function () {
                Route::get('/', 'Admin\OptionController@index');
                Route::post('create', 'Admin\OptionController@create');
                Route::post('main_picture', 'Admin\OptionController@mainPicture');
                // Route::post('update_option/{id}', 'Admin\OptionController@update');
            });
            Route::group(['prefix' => 'complaints'], function () {
                Route::get('/', 'Admin\ComplaintsController@index');
                Route::get('delete_complaint_comment/{id}', 'Admin\ComplaintsController@delete_complaint_comment');
                Route::get('delete_comment/{id}', 'Admin\ComplaintsController@delete_comment');
                Route::get('comments', 'Admin\ComplaintsController@comments');
                Route::get('delete_complaint_publication/{id}', 'Admin\ComplaintsController@delete_complaint_publication');
                Route::get('delete_publication/{id}', 'Admin\ComplaintsController@delete_publication');
            });
            Route::group(['prefix' => 'comments'], function () {
                Route::get('/', 'Admin\CommentsController@index');
                Route::get('delete_comment/{id}', 'Admin\CommentsController@delete_comment');
            });
            Route::group(['prefix' => 'lock'], function () {
                Route::get('/', 'Admin\LockContentController@index');
                Route::get('unlock_user/{id}', 'Admin\LockContentController@unlockUser');
                Route::get('places', 'Admin\LockContentController@getLockPlaces');
                Route::get('unlock_place/{id}', 'Admin\LockContentController@unlockPlace');
                Route::get('destroy_place/{id}', 'Admin\LockContentController@destroyPlace');
                Route::get('delete_places', 'Admin\LockContentController@deletePlaces');
                Route::get('groups', 'Admin\LockContentController@getLockGroups');
                Route::get('unlock_group/{id}', 'Admin\LockContentController@unlockGroup');
                Route::get('destroy_group/{id}', 'Admin\LockContentController@destroyGroup');
                Route::get('delete_groups', 'Admin\LockContentController@deleteGroups');
                Route::get('publications', 'Admin\LockContentController@getLockPublications');
                Route::get('unlock_publication/{id}', 'Admin\LockContentController@unlockPublication');
                Route::get('destroy_publication/{id}', 'Admin\LockContentController@destroyPublication');
                Route::get('delete_publications', 'Admin\LockContentController@deletePublications');
                Route::get('delete_user/{id}/{month}', 'Admin\LockContentController@destroy');
            });
            Route::group(['prefix' => 'count'], function () {
                Route::get('users', 'Admin\CountController@users');
                Route::get('mails', 'Admin\CountController@mails');
                Route::get('to_remove', 'Admin\CountController@to_remove');
            });
            Route::group(['prefix' => 'base'], function () {
                Route::get('/', 'Admin\CountryController@index');
                Route::post('create_сountry', 'Admin\CountryController@createCountry');
                Route::get('edit_сountry/{id}', 'Admin\CountryController@editCountry');
                Route::post('edit_country_save', 'Admin\CountryController@editCountrySave');
                Route::get('region', 'Admin\CountryController@region');
                Route::post('create_region', 'Admin\CountryController@createRegion');
                Route::get('edit_region/{id}/{country_id}', 'Admin\CountryController@editRegion');
                Route::post('edit_region_save', 'Admin\CountryController@editRegionSave');
                Route::get('district', 'Admin\CountryController@district');
                Route::post('create_district', 'Admin\CountryController@createDistrict');
                Route::get('edit_district/{id}', 'Admin\CountryController@editDistrict');
                Route::post('edit_district_save', 'Admin\CountryController@editDistrictSave');
                Route::get('settlement', 'Admin\CountryController@settlement');
                Route::post('create_settlement', 'Admin\CountryController@createSettlement');
                Route::get('edit_settlement/{id}', 'Admin\CountryController@editSettlement');
                Route::post('edit_settlement_save', 'Admin\CountryController@editSettlementSave');
                Route::get('get_region/{id}', 'Admin\CountryController@getRegion');
                Route::get('get_area/{id}', 'Admin\CountryController@getArea');
                Route::get('get_city', 'Admin\CountryController@getCity');

            });
            Route::group(['prefix' => 'moderation'], function () {
                Route::get('/', 'Admin\ModerationController@index');
                Route::get('publications_is_topic', 'Admin\ModerationController@getIsTopicPublications');
                Route::get('publications_is_block', 'Admin\ModerationController@getIsBlockPublications');
                Route::get('publications_is_main', 'Admin\ModerationController@getIsMainPublications');
                Route::get('publications_is_moderate', 'Admin\ModerationController@getIsModeratePublications');
                Route::get('publications_to_note', 'Admin\ModerationController@getToNotePublications');
                Route::get('publications_main/{id}', 'Admin\ModerationController@mainPublications');
                Route::get('publications_topic/{id}', 'Admin\ModerationController@topic');
                Route::get('block_publication/{id}', 'Admin\ModerationController@blockPublication');
                Route::get('confirm_publication/{id}', 'Admin\ModerationController@confirmPublication');
                Route::get('note_publication/{id}', 'Admin\ModerationController@notePublication');
                Route::get('groups', 'Admin\ModerationController@groups');
                Route::get('groups_is_block', 'Admin\ModerationController@getIsBlockGroups');
                Route::get('groups_to_note', 'Admin\ModerationController@getToNoteGroups');
                Route::get('block_group/{id}', 'Admin\ModerationController@blockGroup');
                Route::get('confirm_group/{id}', 'Admin\ModerationController@confirmGroup');
                Route::get('note_group/{id}', 'Admin\ModerationController@noteGroup');
                Route::get('places', 'Admin\ModerationController@places');
                Route::get('places_is_block', 'Admin\ModerationController@getIsBlockPlaces');
                Route::get('places_to_note', 'Admin\ModerationController@getToNotePlaces');
                Route::get('block_place/{id}', 'Admin\ModerationController@blockPlace');
                Route::get('confirm_place/{id}', 'Admin\ModerationController@confirmPlace');
                Route::get('note_place/{id}', 'Admin\ModerationController@notePlace');
            });

        });
        Route::get('login', 'Admin\AuthController@login');
        Route::post('auth', 'Admin\AuthController@auth');
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
        Route::get('count_not_confirmed', 'SubscriberController@count_not_confirmed')->middleware(['auth']);
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
            //Route::post('update/{id}', 'GroupPublicationController@update');
            Route::group(['prefix' => '{publicationId}/comment'], function () {
                Route::post('store', 'GroupPublicationCommentController@store');
            });
        });
    });

//    Route::group(['prefix' => 'moderator'], function () {
//        Route::group(['middleware' => 'moderator'], function () {
//            Route::get('/', 'Moderator\IndexController@index');
//            Route::get('edit', 'Moderator\IndexController@edit');
//            Route::post('update', 'Moderator\IndexController@update');
//            Route::get('logout', 'Moderator\AuthController@logout');
//            Route::get('comments', 'Moderator\ModerateController@comments');
//            Route::get('delete_comment/{id}', 'Moderator\ModerateController@delete_comment');
//            Route::get('comment_complaints', 'Moderator\ModerateController@comment_complaints');
//            Route::get('delete_complaint_comment/{id}', 'Moderator\ModerateController@delete_complaint_comment');
//            Route::get('publication_complaints', 'Moderator\ModerateController@publication_complaints');
//            Route::get('delete_complaint_publication/{id}', 'Moderator\ModerateController@delete_complaint_publication');
//            Route::get('getPublication', 'Moderator\ModerateController@getPublication');
//            Route::get('getGroups', 'Moderator\ModerateController@getGroups');
//            Route::post('blockGroup/{id}', 'Moderator\ModerateController@blockGroup');
//            Route::get('confirmGroup/{id}', 'Moderator\ModerateController@confirmGroup');
//            Route::get('getPlaces', 'Moderator\ModerateController@getPlaces');
//            Route::post('blockPlace/{id}', 'Moderator\ModerateController@blockPlace');
//            Route::get('confirmPlace/{id}', 'Moderator\ModerateController@confirmPlace');
//            Route::get('topic/{id}', 'Moderator\ModerateController@topic');
//            Route::post('blockPublication/{id}', 'Moderator\ModerateController@blockPublication');
//            Route::get('confirmPublication/{id}', 'Moderator\ModerateController@confirmPublication');
//            Route::get('count_complaint_comment', 'Moderator\ModerateController@count_complaint_comment');
//            Route::get('count_complaint_publication', 'Moderator\ModerateController@count_complaint_publication');
//            Route::group(['prefix' => 'moderate'], function () {
//                Route::get('/', 'Moderator\ModerateController@index');
//                Route::get('confirm/{id}', 'Moderator\ModerateController@confirm');
//                Route::get('topic/{id}', 'Moderator\ModerateController@topic');
//                Route::post('block/{id}', 'Moderator\ModerateController@block');
//            });
//            Route::group(['prefix' => 'users'], function () {
//                Route::get('/', 'Moderator\UserController@index');
//                Route::get('confirm/{id}', 'Moderator\UserController@confirm');
//                Route::get('review/{id}', 'Moderator\UserController@review');
//                Route::get('suspicious/{id}', 'Moderator\UserController@suspicious');
//                Route::get('delete/{id}', 'Moderator\UserController@destroy');
//                Route::get('show/{id}', 'Moderator\UserController@show');
//                Route::get('get_confirm', 'Moderator\UserController@getConfirm');
//                Route::get('get_review', 'Moderator\UserController@getReview');
//                Route::get('get_suspicious', 'Moderator\UserController@getSuspicious');
//                Route::get('new_count_users', 'Moderator\UserController@newCountUsers');
//            });
//        });
//        Route::get('login', 'Moderator\AuthController@login');
//        Route::post('auth', 'Moderator\AuthController@auth');
//
//    });

    Route::group(['prefix' => 'publication'], function () {
        Route::post('/', 'PublicationController@index');
        Route::get('/topic', 'PublicationController@topic');
        Route::post('store', 'PublicationController@store')->middleware(['auth']);
        Route::post('update/{id}', 'PublicationController@update')->middleware(['auth']);
        Route::get('show/{id}', 'PublicationController@show')->middleware(['auth']);
        Route::get('like/{id}', 'PublicationController@like')->middleware(['auth']);
        Route::get('destroy/{id}', 'PublicationController@destroy')->middleware(['auth']);
        Route::post('complaint', 'PublicationController@complaint')->middleware(['auth']);
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
        Route::post('add_city', 'PlaceController@add_city');
        Route::get('destroy/{id}', 'PlaceController@destroy');
        Route::get('set_user_admin/{place_id}/{user_id}', 'PlaceController@setUserAdmin');
        Route::get('set_admin_creator/{place_id}/{admin_id}', 'PlaceController@setUserCreator');
        Route::get('subscription/{id}', 'PlaceController@subscription');
        Route::post('delete_subscription/{id}', 'PlaceController@admin_subscription_delete');
        Route::post('invite/{place_id}', 'PlaceController@invite');
        Route::group(['prefix' => '{placeId}/publication'], function () {
            Route::get('/', 'PlacePublicationController@index');
            Route::post('store', 'PlacePublicationController@store');
            //Route::post('update/{id}', 'PlacePublicationController@update');
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
        Route::post('users/{room_id}', 'ChatController@users');
        Route::get('exit_user/{room_id}', 'ChatController@exit_user');
        Route::get('exit_admin/{room_id}/{user_id}', 'ChatController@exit_admin');
        Route::post('videos', 'ChatController@videos');
        Route::get('get_video/{id}', 'ChatController@get_video');
    });

    Route::group(['prefix' => 'mail'], function () {
        Route::post('/', 'MailController@index');
//        Route::get('get_review', 'MailController@get_review');
//        Route::get('get_closed', 'MailController@get_closed');
//        Route::post('create', 'MailController@create');
//        Route::get('destroy/{id}', 'MailController@destroy');
//        Route::get('status_closed/{id}', 'MailController@change_status_closed');
//        Route::get('status_review/{id}', 'MailController@change_status_review');
    });

    Route::get('authorization', 'AuthorizationController@index');

    Route::post('search','SphinxSearchController@search');
    Route::get('searchsphinx', function () {

        // echo "<form action=\"http://pp.hqsale.com/search\" method=\"post\" enctype=\"multipart/form-data\">

        echo "<form action=\"http://".$_SERVER['SERVER_NAME']."/search\" method=\"post\" enctype=\"multipart/form-data\">
             <input type='text' name='name'><br>
             <input type=\"checkbox\" name=\"usersearch\">РџРѕ СЋР·РµСЂР°Рј<br>
             <input type=\"checkbox\" name=\"publicationsearch\">РџРѕ РїСѓР±Р»РёРєР°С†РёСЏРј<br>
             <input type=\"checkbox\" name=\"placesearch\">РџРѕ РјРµСЃС‚Р°Рј Рё РїСѓР±Р»РёРєР°С†РёСЏРј<br>
             <input type=\"checkbox\" name=\"groupsearch\">РџРѕ РіСЂСѓРїРїР°Рј Рё РїСѓР±Р»РёРєР°С†РёСЏРј<br>
             <input type=\"submit\">
             </form>";
    });
    Route::get('test', function () {
        echo "<form action=\"http://pp.dev/admin/get_check_time\" method=\"get\" enctype=\"multipart/form-data\">
             <input type='text' name='offset' ><br>
             <input type='text' name='limit' ><br>
             <input type='number' name='message_id' ><br>
             <input type='file' name='videos[]'><br>
             <input type=\"submit\">
              </form>";
    });
    Route::post('searchgeo','SphinxSearchController@geosearch');
    Route::any( '{angularjs}', function ( $page ) {
        return view('welcome');

    } )->where('angularjs', '(.*)');
});
