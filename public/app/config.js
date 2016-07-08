angular.module('placePeopleApp')
	.config(['$urlRouterProvider', '$stateProvider', 'laddaProvider',
		function($urlRouterProvider, $stateProvider, laddaProvider){

    laddaProvider.setOption({
      style: 'expand-right',
      spinnerSize: 30,
      spinnerColor: '#ffffff'
    });

  	$urlRouterProvider.otherwise('/');

	  $stateProvider
	    .state('auth', {
	      url: '/',
	      templateUrl: '../../app/Auth/views/auth.html',
	      controller: 'authCtrl'
	    })
	    .state('reg', {
	      url: '/auth/registration',
	      templateUrl: '../../app/Auth/views/reg.html',
	      controller: 'authCtrl'
	    })
	    .state('restore', {
	      url: '/auth/restore',
	      templateUrl: '../../app/Auth/views/restore.html',
	      controller: 'authCtrl'
	    })
	    .state('login', {
	      url: '/auth/login',
	      templateUrl: '../../app/Auth/views/login.html',
	      controller: 'authCtrl'
	    })
	    .state('static', {
	      url: '/static/:pageName',
	      templateUrl: '../../app/Static/views/static.html',
	      controller: 'staticCtrl'
	    })
	    .state('subscribers', {
	      url: '/:username/subscribers/:id',
	      templateUrl: '../../app/User/views/popup-user-subscribers.html',
	      controller: 'userCtrl'
	    })
	    .state('subscribes', {
	      url: '/:username/subscribes/:id',
	      templateUrl: '../../app/User/views/popup-user-subscribe.html',
	      controller: 'userCtrl'
	    })
	    .state('settings', {
	      url: '/settings',
	      templateUrl: '../../app/Settings/views/settings.html',
	      controller: 'settingsCtrl'
	    })

	    .state('feed', {
	      url: '/feed',
	      templateUrl: '../../app/Feed/views/feed.html',
	      controller: 'feedCtrl'
	    })
	    // .state('feed-mobile', {
	    //   url: 'feed/:pubId',
	    //   templateUrl: '../../app/Feed/views/view-publication.html',
	    //   controller: 'feedCtrl'
	    // })
	    // .state('feed-desktop', {
	    //   url: 'feed/pubs/:pubId',
	    //   templateUrl: '../../app/Feed/views/feed.html',
	    //   controller: 'feedCtrl'
	    // })
	    .state('chat', {
	      url: '/chat',
	      templateUrl: '../../app/Chat/views/dla-testa.html',
	      controller: 'chatCtrl'
	    })
	    .state('chat.list', {
	      url: '/',
	      templateUrl: '../../app/Chat/views/chat-list.html',
	      controller: 'chatCtrl'
	    })
	    .state('chat.contacts', {
	      url: '/contacts',
	      templateUrl: '../../app/Chat/views/chat-contacts.html',
	      controller: 'chatCtrl'
	    })
	    .state('chat.blocked', {
	      url: '/blocked',
	      templateUrl: '../../app/Chat/views/chat-blocked.html',
	      controller: 'chatCtrl'
	    })
	    .state('chat.menu', {
	      url: '/menu',
	      templateUrl: '../../app/Chat/views/chat-menu.html',
	      controller: 'chatCtrl'
	    })

	    /*User must be in the end*/
	    .state('user', {
	      url: '/:username',
	      templateUrl: '../../app/User/views/user.html',
	      controller: 'userCtrl'
	    })
	    .state('mobile-pub-view', {
	      url: '/:username/pub/:id',
	      templateUrl: '../../app/User/views/view-publication.html',
	      controller: 'userCtrl'
	    })
	    .state('desktop-pub-view', {
	      url: '/:username/publication/:id',
	      templateUrl: '../../app/User/views/user.html',
	      controller: 'userCtrl'
	    })
	    




	}]);