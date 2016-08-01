angular.module('placePeopleApp')
	.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'groupsService', 'placesService', 'storageService', 'AuthService', function ($rootScope, $scope, $state, groupsService, placesService, storageService, AuthService) {
		var storage = storageService.getStorage();
		$scope.loggedUser = storage.username;
		$scope.logOut = function(){
			AuthService.userLogOut().then(function(response){
				storageService.deleteStorage();
				$state.go('login');
			},
			function(error){
				console.log(error);
			});
		};
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
