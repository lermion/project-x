angular.module('placePeopleApp')
	.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'groupsService', 'placesService', 'storageService', 'AuthService', '$location', function ($rootScope, $scope, $state, groupsService, placesService, storageService, AuthService, $location) {
		$scope.logOut = function(){
			AuthService.userLogOut().then(function(response){
				storageService.deleteStorage();
				$state.go('login');
			},
			function(error){
				console.log(error);
			});
		};
		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			var storage = storageService.getStorage();
			$scope.loggedUser = storage.username;
			$scope.currentPath = $location.url();
		});
		$scope.$on('publicPoint', function (event, data) {
			$scope.bodyClass = 'public';
		});

		$scope.$on('authPoint', function (event, data) {
			$scope.bodyClass = 'main-page';
		});

		$scope.$on('userPoint', function (event, data) {
			$scope.bodyClass = 'public user';
		});

		$rootScope.$on('$stateChangeStart',
			function (event, toState, toParams, fromState, fromParams) {
				groupsService.getCounterNewGroups().then(function (data) {
					$rootScope.counters.groupsNew = data;
				});
				placesService.getCounterNewPlaces().then(function (data) {
					$rootScope.counters.placessNew = data;
				});
			});
		$scope.search = {
			str: null,
			byUsers: true,
			byPublications: true,
			byPlaces: true,
			byGroups: true
		};
		$scope.submitSearch = function () {

			$state.go('search', {'searchObj': $scope.search});
		};
	}]);
