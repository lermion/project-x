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
	    .state('groups', {
	      url: '/groups',
	      templateUrl: '../../app/Groups/views/groups.html',
	      controller: 'groupsCtrl'
	    })
	    .state('view-group', {
	      url: '/group/:groupId',
	      templateUrl: '../../app/Groups/views/group.html',
	      controller: 'groupsCtrl'
	    })
	    .state('view-group-publication', {
	      url: '/group/:groupId/publication/:pubId',
	      templateUrl: '../../app/Groups/views/group.html',
	      controller: 'groupsCtrl'
	    })
	    .state('mobile-view-group-publication', {
	      url: '/group/:groupId/pub/:pubId',
	      templateUrl: '../app/Groups/views/popup-view-group-publication.html',
	      controller: 'groupsCtrl'
	    })
	    .state('feed', {
	      url: '/feed',
	      templateUrl: '../../app/Feed/views/feed.html',
	      controller: 'feedCtrl'
	    })
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