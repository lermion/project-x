angular.module('placePeopleApp')
	.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'groupsService', 'placesService',
		'storageService', 'AuthService', '$location', 'socket', '$http', '$window',
		function ($rootScope, $scope, $state, groupsService, placesService, storageService, AuthService, $location, socket, $http, $window) {
		var storage = storageService.getStorage();
		$scope.currentPath = $location.url();
		$scope.loggedUserId = parseInt(storage.userId);
		$scope.$emit('userPoint', 'user');
		$scope.logOut = function(){
			AuthService.userLogOut().then(function(response){
				storageService.deleteStorage();
				$state.go('login');
			},
			function (error) {
				console.log(error);
			});
		};
		$http.get('/static_page/get/name').success(function(response){
			$scope.staticPages = response;
		}).error(function(error){
			console.log(error);
		});
		$scope.openMenu = function(){
			if($window.innerWidth <= 800){
				$scope.showMenu = !$scope.showMenu;
			}else{
				$scope.showMenu = true;
			}
		};
		$scope.openBottomMenu = function(){
			if($window.innerWidth <= 650){
				$scope.showBottomMenu = !$scope.showBottomMenu;
			}else{
				$scope.showBottomMenu = false;
			}
		};
		var w = angular.element($window);
			$scope.$watch(function(){
					return $window.innerWidth;
			},
			function(value){
				if(value <= 800){
					$scope.showMenu = false;
				}else{
					$scope.showMenu = true;
				}
				if (value <= 650) {
					$scope.showBottomMenu = false;
				}else{
					$scope.showBottomMenu = true;
				}
				if(value < 520){
					var blockThirdthLength = (parseInt(w[0].innerWidth) - 21) / 4;
					$scope.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
					$scope.resizeHeight = 'height:' + blockThirdthLength + 'px;';
				}else{
					$scope.resizeSizes = '';
					$scope.resizeHeight = '';
				}
			},true);
			w.bind('resize', function(){
				$scope.$apply();
			});
		socket.emit("get user rooms", $scope.loggedUserId);
		socket.on("get user rooms", function (response) {
			var chatRoomsArray = [];
			for (var i = 0; i < response.length; i++) {
				if (response[i].countMessages > 0) {
					chatRoomsArray.push(response[i].countMessages);
				}
			}
			$rootScope.countChatMessages = chatRoomsArray.length;
		});
		socket.on('updatechat', function (data) {
			socket.emit("get user rooms", $scope.loggedUserId);
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
					$rootScope.counters.placesNew = data;
				});

				if (toState.name !== 'search' &&
					toState.name !== 'search.people' &&
					toState.name !== 'search.publications' &&
					toState.name !== 'search.places' &&
					toState.name !== 'search.groups') {

					resetSearch();

				}

			});


		// Search
		$scope.search = {
			str: '',
			byUsers: true,
			byPublications: true,
			byPlaces: true,
			byGroups: true
		};

		var originalSearch = angular.copy($scope.search);

		$scope.submitSearch = function () {
			if ($state.current.name === 'search' ||
				$state.current.name === 'search.people' ||
				$state.current.name === 'search.publications' ||
				$state.current.name === 'search.places' ||
				$state.current.name === 'search.groups') {

				$scope.$broadcast('search', {searchObj: angular.copy($scope.search)});

			} else {
				$state.go('search', {'searchObj': angular.copy($scope.search)});
			}
		};

		function resetSearch() {
			$scope.search = angular.copy(originalSearch);
			$scope.showSearch = false;
		}


	}]);
