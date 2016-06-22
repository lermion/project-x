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
	    .state('user', {
	      url: '/:username',
	      templateUrl: '../../app/User/views/user.html',
	      controller: 'userCtrl'
	    })
	    .state('static', {
	      url: '/static/:pageName',
	      templateUrl: '../../app/Static/views/static.html',
	      controller: 'staticCtrl'
	    })
	    .state('feed', {
	      url: '/feed/',
	      templateUrl: '../../app/Feed/views/feed.html',
	      // controller: 'staticCtrl'
	    })	    
	    
	}]);