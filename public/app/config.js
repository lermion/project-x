angular.module('placePeopleApp')
	.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){

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
	    // .state('user', {
	    //   url: '/:username',
	    //   templateUrl: '../../app/Public/views/public.html',
	    //   controller: 'authCtrl'
	    // })
	    .state('static', {
	      url: '/static/:pageName',
	      templateUrl: '../../app/Static/views/unauth-static.html',
	      controller: 'staticCtrl'
	    })
	    .state('static-auth', {
	      url: '/page/:pageName',
	      templateUrl: '../../app/Static/views/auth-static.html',
	      controller: 'staticCtrl'
	    })
	    
	}]);