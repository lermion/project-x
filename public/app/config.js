angular.module('placePeopleApp')
	.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){

  $urlRouterProvider.otherwise('/');

	  $stateProvider
	    .state('auth', {
	      url: '/',
	      templateUrl: '../../app/Auth/views/auth.html',
	      controller: 'authCtrl'
	    })
	    // .state('about', {
	    //   url: '/about',
	    //   templateUrl: 'assets/templates/about-us.html',
	    //   controller: 'aboutCtrl'
	    // })
	    // .state('about/details', {
	    //   url: '/about/:from',
	    //   templateUrl: 'assets/templates/about-details.html',
	    //   controller: 'moreCtrl'
	    // })
	    // .state('what-we-do', {
	    //   url: '/what-we-do',
	    //   templateUrl: 'assets/templates/what-we-do.html',
	    //   controller: 'whatWeDoCtrl'
	    // })
	    // .state('what-we-do/details', {
	    //   url: '/what-we-do/:from',
	    //   templateUrl: 'assets/templates/more.html',
	    //   controller: 'moreCtrl'
	    // })
	    // .state('clients', {
	    //   url: '/clients',
	    //   templateUrl: 'assets/templates/clients.html',
	    //   controller: 'clientsCtrl'
	    // })
	    // .state('clients/details', {
	    //   url: '/clients/:from',
	    //   templateUrl: 'assets/templates/client-detail.html',
	    //   controller: 'moreCtrl'
	    // })
	    // .state('contacts', {
	    //   url: '/contacts',
	    //   templateUrl: 'assets/templates/contacts.html',
	    //   controller: 'contactsCtrl'
	    // })
	    // .state('more', {
	    //   url: '/more/:from',
	    //   templateUrl: 'assets/templates/more.html',
	    //   controller: 'moreCtrl'
	    // })

	}]);