angular.module('placePeopleApp')
	.controller('mainCtrl', ['$rootScope', '$scope', '$state', 'groupsService', 'placesService', 'UserService',
		'storageService', 'AuthService', '$location', 'socket', '$http', '$window', 'ngDialog', 'md5',
		function ($rootScope, $scope, $state, groupsService, placesService, UserService, storageService,
				  AuthService, $location, socket, $http, $window, ngDialog, md5) {




			$scope.currentPath = $location.url();

			// данные текущего авторизированного пользователя, которые доступны в любом месте приложения
			$rootScope.user = {
				firstName: '',
				lastName: '',
				fullName: '',
				loggedUserAva: null,
				pubView: '',
				userId: null,
				username: ''
			};

			var originalUser = angular.copy($rootScope.user);



			// при каждом обновлении значений в localStorage обновим данные текущего пользователя
			$rootScope.$on('storage:update', function () {
				updateCurrentUserProfile();
			});

			$rootScope.$on('storage:deleted', function () {
				$rootScope.user = angular.copy(originalUser);
			});


			$rootScope.showHeader = false;


			activate();

			/////////////////////////////////

			function activate() {
				setStaticPages();
				updateCurrentUserProfile();
			}

			$scope.$emit('userPoint', 'user');

			$scope.$on('publicPoint', function (event, data) {
				$scope.bodyClass = 'public';
			});

			$scope.$on('authPoint', function (event, data) {
				$scope.bodyClass = 'main-page';
			});

			$scope.$on('userPoint', function (event, data) {
				$scope.bodyClass = 'public user';
			});

			function setStaticPages() {
				$http.get('/static_page/get/name').success(function (response) {
					$scope.footerData = response;
				}).error(function (error) {
					console.log(error);
				});
			}


			// Sidebar menus
			$scope.openMenu = function () {
				if ($window.innerWidth <= 800) {
					$scope.showMenu = !$scope.showMenu;
					$scope.isOverlay = !$scope.isOverlay;
				} else {
					$scope.showMenu = true;
					$scope.isOverlay = false;
				}
			};
			$scope.openBottomMenu = function () {
				if ($window.innerWidth <= 650) {
					$scope.showBottomMenu = !$scope.showBottomMenu;
				} else {
					$scope.showBottomMenu = false;
				}
			};
			var w = angular.element($window);
			$scope.$watch(function () {
					return $window.innerWidth;
				},
				function (value) {

					if (value <= 800) {
						$scope.showMenu = false;
					} else {
						$scope.showMenu = true;
					}

					if (value <= 650) {
						$scope.showBottomMenu = false;
					} else {
						$scope.showBottomMenu = true;
					}

					if (value < 520) {
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 21) / 4;
						$scope.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
						$scope.resizeHeight = 'height:' + blockThirdthLength + 'px;';

						// для публикаций
						var pubSize = (parseInt(w[0].innerWidth) - 12) / 3;
						$scope.pubSize = 'width:' + pubSize + 'px;height:' + pubSize + 'px;';
					} else {
						$scope.pubSize = '';
						$scope.resizeHeight = '';
						$scope.isOverlay = false;
					}
				}, true);
			w.bind('resize', function () {
				$scope.$apply();
			});


			// Logout
			$scope.logOut = function () {
				AuthService.userLogOut().then(function (response) {
						storageService.deleteStorage();
						$rootScope.userLogged = false;
						$state.go('login');
					},
					function (error) {
						console.log(error);
					});
			};


			$rootScope.$on('preloader:off', function () {
				$scope.preloader = false;
			});

			$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

				//console.info('state SUCCESS');

				$scope.preloader = false;
				ngDialog.closeAll();
				$scope.currentPath = $location.url();

				$rootScope.showHeader = $state.current.showHeader === true;

				$scope.isOverlay = false;

			});

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

				//console.info('state START - ' + toState.name);
				$scope.preloader = true;
				$scope.currentPath = $location.url();
				if ($window.innerWidth <= 800) {
					$scope.showMenu = false;
				}
				if (toState.name !== 'search' &&
					toState.name !== 'search.people' &&
					toState.name !== 'search.publications' &&
					toState.name !== 'search.places' &&
					toState.name !== 'search.groups') {

					resetSearch();

				}

				// продолжим переход на state если не нужно выполнять проверку авторизации
				// такая проверка не нужна, если она была выполнена на предыдущем stateChangeStart
				if (fromParams.skipAuthCheck) {
					return;
				}

				// отменим переход на state
				event.preventDefault();

				// выполним проверку авторизации
				storageService.isUserAuthorized().then(continueNavigation);

				function continueNavigation(response) {
					$rootScope.isAuthorized = response.is_authorization;

					// параметры для последующего перехода на state
					var params = angular.copy(toParams);

					// при "повторном" переходе на tate не прерывать такой переход и не выполнять проверку авторизации
					fromParams.skipAuthCheck = true;

					// если пользователь авторизирован (есть сессия на сервере)
					if ($rootScope.isAuthorized) {
						// получим счетчики для header
						getCounters();

						// если авторизированы и переходим на страницы авторизации, то перенаправляем на Главную
						// в других случаях - переход на state без ограничений
						if (toState.name === 'login' || toState.name === 'auth' || toState.name === 'reg' || toState.name === "restore") {
							$state.go('feed');
						} else {
							$state.go(toState.name, params);
						}

						// если пользователь не авторизирован (нет сессии на сервере)
					} else {
						// если state требует авторизации, то перенаправляем на страницу авторизации
						// очистим локальное хранилище, т. к. в нем могут оставаться неактуальные данные
						if (toState.requireLogin) {
							storageService.deleteStorage();
							$rootScope.user = {};
							$state.go('login');

							// если state не требует авторизации (т. е. некоторые страницы доступны для
							// неавторизированных пользователей), то переход без ограничений
						} else {
							if (toState.name === "desktop-pub-view" && toParams.hash) {
								var hashPubId = md5.createHash(toParams.id);
								if (hashPubId === toParams.hash) {
									$state.go('desktop-pub-view', toParams);
								}
							}
							$state.go(toState.name, toParams);
						}
						if(toState.name === "reg"){
							AuthService.isClosedRegistration().then(function(response){
								if(response && !$rootScope.isRightCode){
									$state.go('invite');
								}else{
									$state.go("reg");
								}
							},
							function(error){
								console.log(error);
							});
						}
					}
				}

				function getCounters() {
					//Header counters
					groupsService.getCounterNewGroups().then(function (data) {
						if(data){
							$rootScope.counters.groupsNew = data;
						}
					});
					placesService.getCounterNewPlaces().then(function (data) {
						if(data){
							$rootScope.counters.placesNew = data;
						}
					});
					UserService.getCounterNewSubscribers().then(function (data) {
						if(data){
							$rootScope.counters.subscribersNew = data.confirmed;
						}
					});

					if (toState.name !== 'search' &&
						toState.name !== 'search.people' &&
						toState.name !== 'search.publications' &&
						toState.name !== 'search.places' &&
						toState.name !== 'search.groups') {
						resetSearch();
					}
				}

			});

			// Chat
			if($scope.loggedUserId !== ""){
				socket.emit("get user rooms", $scope.loggedUserId);
				socket.on("get user rooms", function(response){
					var chatRoomsArray = [];
					var gotNotice = [];
					for(var i = 0; i < response.length; i++){
						if(response[i].countMessages > 0){
							gotNotice.push(response[i]);
							chatRoomsArray.push(response[i].countMessages);
						 }
					}
					$rootScope.countChatMessages = chatRoomsArray.length;
					socket.emit("got notice", gotNotice);
				});
				socket.on('updatechat', function (data) {
					socket.emit("get user rooms", $scope.loggedUserId);
				});
			}

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
				if ($scope.search.str === '') {
					return false;
				}
				if ($state.current.name === 'search' ||
					$state.current.name === 'search.people' ||
					$state.current.name === 'search.publications' ||
					$state.current.name === 'search.places' ||
					$state.current.name === 'search.groups') {

					$scope.$broadcast('search', {
						searchObj: angular.copy($scope.search),
						restoreSearchResult: false
					});

				} else {
					$state.go('search', {
						'searchObj': angular.copy($scope.search),
						'restoreSearchResult': false,
						'setActiveTab': true,
						'params': $scope.search.str
					});
				}
			};

			function resetSearch() {
				$scope.search = angular.copy(originalSearch);
				$rootScope.showSearch = false;
			}


			// Ellipsis menu button
			$scope.closeUserMenu = function () {
				$rootScope.showUserMenu = false;
				$rootScope.showUserMenuSecondary = false;

			};

			function updateCurrentUserProfile() {
				var storage = storageService.getStorage();


				$rootScope.user.username = storage.username || '';
				$rootScope.user.firstName = storage.firstName || '';
				$rootScope.user.lastName = storage.lastName || '';
				$rootScope.user.fullName = (storage.firstName || '') + ' ' + (storage.lastName || '');
				$rootScope.user.loggedUserAva = storage.loggedUserAva !== '' ? storage.loggedUserAva : '/upload/preview-chat-no-avatar.png';
				$rootScope.user.userId = +storage.userId || '';
				$rootScope.user.pubView = storage.pubView || '';

				// TODO: заменить во всех представлениях
				$scope.loggedUserId = $rootScope.user.userId;
			}

			function isMobile() {
				var screenWidth = $window.innerWidth;
				return screenWidth < 768;
			}


		}]);
