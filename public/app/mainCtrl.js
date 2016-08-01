angular.module('placePeopleApp')
	.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'groupsService', 'placesService', 'storageService', 'AuthService', '$location', 'socket', function ($rootScope, $scope, $state, groupsService, placesService, storageService, AuthService, $location, socket) {
		$scope.logOut = function(){
			AuthService.userLogOut().then(function(response){
				storageService.deleteStorage();
				$state.go('login');
			},
			function(error){
				console.log(error);
			});
		};
		socket.on("get user rooms", function(response){
			var chatRoomsArray = [];
			for(var i = 0; i < response.length; i++){
				if(response[i].countMessages > 0){
					chatRoomsArray.push(response[i].countMessages);
				}
			}
			$rootScope.countChatMessages = chatRoomsArray.length;
		});
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
