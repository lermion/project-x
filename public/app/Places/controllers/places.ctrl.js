(function (angular) {
	'use strict';

	angular
		.module('app.places')
		.controller('PlacesCtrl', PlacesCtrl);

	PlacesCtrl.$inject = ['$rootScope', '$scope', '$http', '$window', '$state', '$stateParams', '$filter', '$timeout', '$location',
		'$anchorScroll', 'AuthService', 'storageService',
		'placesService', 'countries', 'places', 'typeStatic', 'typeDynamic', 'ngDialog', 'PublicationService',
		'UserService', 'Upload', '$q', 'orderByFilter'];

	function PlacesCtrl($rootScope, $scope, $http, $window, $state, $stateParams, $filter, $timeout, $location,
						$anchorScroll, AuthService, storageService,
						placesService, countries, places, typeStatic, typeDynamic, ngDialog, PublicationService,
						UserService, Upload, $q, orderBy) {

		var LIMIT_PLACE = 3;

		var vm = this;

		var storage = storageService.getStorage();

		var myId = storage.userId;

		var modalMap, modalCropLogoImage, map;

		vm.typeStatic = typeStatic;
		vm.typeDynamic = typeDynamic;

		var staticIds = typeStatic.map(function (type) {
			return type.id
		});
		var dynamicIds = typeDynamic.map(function (type) {
			return type.id
		});

		vm.activeTypePlaceId = null;

		vm.places = places;

		vm.countries = countries;

		vm.userName = storage.username;

		vm.placesDropdown = null;
		$scope.checkedAreas = [];

		vm.placeNew = {
			category: null,

			country: {
				originalObject: {}
			},
			city: null,
			address: null,

			name: '',
			description: null,

			cover: null,
			originalCover: null,
			logo: null,
			originalLogo: null,

			isCreate: null,
			isDynamic: false,

			coordinates_x: null,
			coordinates_y: null,

			expired_days: null,

			// invited users
			users: []
		};

		vm.placeNew.country = vm.countries.filter(function(item) {
			return item.name === $rootScope.countryName;
		})[0] || null;
		var originalPlaceNew = angular.copy(vm.placeNew);

		vm.location = {
			latitude: null,
			longitude: null
		};

		vm.isPlaceAdded = false;

		vm.inviteNotSend = true;

		vm.selectedImage = null;
		vm.myCroppedImage = null;
		vm.blobImg = null;

		vm.limitPlace = LIMIT_PLACE;

		// TODO: refact!
		vm.categories = [
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true},
			{show: true}
		];
		vm.showAllPlaces = false;

		vm.subForm = false;

		vm.cities = [];

		activate();

		/////////////////////////////////////////////////

		function activate() {
			init();
		}

		function init() {
			$scope.$emit('userPoint', 'user');
			var storage = storageService.getStorage();
			//vm.loggedUser = storage.username;

			$http.get('/static_page/get/name')
				.success(function (response) {
					vm.staticPages = response;
				})
				.error(function (error) {
					console.log(error);
				});
			vm.logOut = function () {
				AuthService.userLogOut()
					.then(function (res) {
						storageService.deleteStorage();
						$state.go('login');
					}, function (err) {
						console.log(err);
					});
			};

			vm.openMenu = function () {
				if ($window.innerWidth <= 800) {
					vm.showMenu = !vm.showMenu;
				} else {
					vm.showMenu = true;
				}
			};

			vm.openBottomMenu = function () {
				if ($window.innerWidth <= 650) {
					vm.showBottomMenu = !vm.showBottomMenu;
				} else {
					vm.showBottomMenu = false;
				}
			};

			vm.searchCountries = function(str){
				var deferred = $q.defer();
				var matches = [];
				vm.countries.forEach(function(country){
					if((country.name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)){
						matches.push(country);
					}
				});
				if(matches.length > 0){
					deferred.resolve(matches);
				} else {
					deferred.reject();
				}
				return deferred.promise;
			};

			vm.countrySelected = function(country){
				vm.placeNew.country = country;

			};

			var w = angular.element($window);
			$scope.$watch(
				function () {
					return $window.innerWidth;
				},
				function (value) {
					if (value <= 800) {
						vm.showMenu = false;
					} else {
						vm.showMenu = true;
					}

					if (value <= 650) {
						vm.showBottomMenu = false;
					} else {
						vm.showBottomMenu = true;
					}

					if (value < 520) {
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 21) / 4;
						vm.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
						vm.resizeHeight = 'height:' + blockThirdthLength + 'px;';
					} else {
						vm.resizeSizes = '';
						vm.resizeHeight = '';
					}
				},
				true
			);
			w.bind('resize', function () {
				$scope.$apply();
			});

		}

		$scope.$watchCollection(angular.bind(vm, function () {
			return vm.places;
		}), function (array) {

			vm.myPlaces = array.filter(function (place) {
				return place.is_admin === true || place.is_sub;
			});

			vm.popularPlaces = array.filter(function (place) {
				// all places
				return true;
			});

			vm.newPlaces = array.filter(function (place) {
				// all places
				return true;
			});

			vm.dynamicPlaces = array.filter(function (place) {
				return dynamicIds.indexOf(place.type_place_id) !== -1;
			});

			//vm.nearPlaces = array.filter(function (place) {
			//    // all places
			//    return true;
			//});

			vm.shopPlaces = array.filter(function (place) {
				return +place.type_place_id === 1;
			});

			vm.cafePlaces = array.filter(function (place) {
				return +place.type_place_id === 2;
			});

			vm.entertainmentPlaces = array.filter(function (place) {
				return +place.type_place_id === 3;
			});

			vm.organizationPlaces = array.filter(function (place) {
				return +place.type_place_id === 4;
			});

			vm.universityPlaces = array.filter(function (place) {
				return +place.type_place_id === 5;
			});

			vm.schoolPlaces = array.filter(function (place) {
				return +place.type_place_id === 6;
			});

			vm.addressPlaces = array.filter(function (place) {
				// all places
				return true;
			});


		});


		$scope.$watch(angular.bind(vm, function () {
			return vm.placesDropdown;
		}), function (newVal) {
			if (newVal === 'places.add') {
				$state.go('places.add');
			} else if (newVal) {
				vm.togglePlaceView(+newVal);
			}
		});
		// $scope.$watch(angular.bind(vm, function () {
		// 	return vm.placeNew.country;
		// }), function (newVal, oldVal) {
		// 	if (newVal !== oldVal && newVal !== null) {
		// 		getCities(newVal);
		// 	}
		// });
		$scope.$watch(function () {
			return $state.params;
		}, function (p) {
			if (p.activeTypePlaceId) {
				vm.activePlace = vm.typeStatic.filter(function (item) {
					return p.activeTypePlaceId === item.id;
				})[0];
				vm.placeNew.category = {id: p.activeTypePlaceId};
			}
		});

		vm.openModalMap = function () {
			modalMap = ngDialog.open({
				template: '../app/Places/views/popup-map.html',
				name: 'modal-edit-group',
				className: 'popup-add-group place-map ngdialog-theme-default',
				scope: $scope
			});
		};

		vm.submitPlaceNew = function () {
			if (vm.subForm) {
				return false;
			}
			vm.form.placeNew.$setSubmitted();

			if (vm.form.placeNew.$invalid) {
				return false;
			}
			if (vm.placeNew.expired_date) {
				vm.placeNew.expired_date = moment(vm.placeNew.expired_date).format('YYYY-MM-DD');
			}
			vm.subForm = true;
			vm.placeNew.scopes = $scope.checkedAreas;
			placesService.addPlace(vm.placeNew)
				.then(function (data) {
					if (data.status) {
						getSubscribers();
						getSubscription();
						vm.placeName = data.place.url_name;
						vm.isPlaceAdded = true;
						vm.placeId = data.place.id;
						data.place.is_new_place = true;
						data.place.is_admin = true;
						vm.currentPlace = data.place;
						vm.places.push(data.place);
						vm.subForm = false;
					}
				}, function () {
					console.log('Add place failed');
					vm.subForm = false;
				});
		};

		vm.onItemSelected = function (user) {

			var isExist = $filter('getById')(vm.placeNew.users, user.id);

			if (!isExist) {
				var item = {
					userId: user.id,
					firstName: user.first_name,
					lastName: user.last_name,
					avatar: user.avatar_path,
					login: user.login,
					user_quote: user.user_quote,
					is_online: user.is_online,

					isAdmin: false
				};
				vm.placeNew.users.push(item);
			}
		};

		vm.removeUser = function (user) {
			for (var i = vm.placeNew.users.length - 1; i >= 0; i--) {
				if (vm.placeNew.users[i].userId == user.userId) {
					vm.placeNew.users.splice(i, 1);
				}
			}
		};

		vm.setAdmin = function (user) {
			user.isAdmin = !user.isAdmin;
		};

		vm.submitInviteUsers = function () {

			if (vm.placeNew.users.length === 0 || vm.subForm) {
				return false;
			}

			vm.subForm = true;

			placesService.inviteUsers(vm.placeId, vm.placeNew.users)
				.then(function (data) {
					if (data.status) {
						vm.inviteNotSend = false;
						var users = vm.placeNew.users.filter(function (item, i, arr) {
							return item.isAdmin === true;
						});
						if (users.length > 0) {
							setAdmins(users, vm.placeId);
						}
						vm.subForm = false;
						$timeout(function () {
							vm.goPlace(vm.currentPlace);
						}, 2000);
					}
				}, function () {
					console.log('Invite users to new place failed');
					vm.subForm = false;
				});
		};

		vm.removeUserFromInviteList = function (user) {
			for (var i = vm.placeNew.users.length - 1; i >= 0; i--) {
				if (vm.placeNew.users[i].userId == user.userId) {
					vm.placeNew.users.splice(i, 1);
				}
			}
		};

		vm.filterByDynamicType = function (item) {
			return dynamicIds.indexOf(item.type_place_id) !== -1;
		};


		// Crop cover & logo for new places
		vm.changePlaceCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			if (file) {
				// For show on the form
				Upload.resize(file, 218, 220, 1, null, null, true).then(function (resizedFile) {
					vm.placeNew.coverPreviewToShow = resizedFile;
				});

				vm.placeNew.originalCover = file;

				var isCoverCropMode = true;

				openModalCropLogoImage(file.name, event, isCoverCropMode);
			}

		};
		vm.changePlaceLogoFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			if (file) {

				vm.placeNew.originalLogo = file;

				var isCoverCropMode = false;

				openModalCropLogoImage(file.name, event, isCoverCropMode);
			}
		};
		vm.saveCropp = function (croppedDataURL, isCoverCrop) {

			var blob = Upload.dataUrltoBlob(croppedDataURL, vm.selectedLogoImageName);

			if (isCoverCrop) {
				Upload.imageDimensions(blob).then(function (dimensions) {
					console.info('Place: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				vm.placeNew.cover = blob;
				vm.placeNew.coverPreview = vm.placeNew.coverPreviewToShow;
				vm.form.placeNew.cover.$setValidity('required', true);
				vm.form.placeNew.cover.$valid = true;
			} else {
				Upload.imageDimensions(blob).then(function (dimensions) {
					console.info('Place: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				vm.placeNew.logo = blob;
				vm.form.placeNew.logo.$setValidity('required', true);
				vm.form.placeNew.logo.$valid = true;
			}

			modalCropLogoImage.close();
		};


		vm.togglePlaceView = function (index) {

			//TODO: refact!
			if (index === undefined) {
				vm.limitPlace = LIMIT_PLACE;
				for (var i = 0; i < vm.categories.length; i++) {
					vm.categories[i].show = true;
				}
				vm.showAllPlaces = false;
				vm.placesDropdown = null;
			} else {
				vm.showAllPlaces = true;
				for (var j = 0; j < vm.categories.length; j++) {
					vm.categories[j].show = false;
				}
				vm.categories[index].show = true;
				vm.limitPlace = 'Infinity';
				//$location.hash('wrapper');
				$anchorScroll();
			}

		};

		vm.resetNewPlaceForm = function () {
			vm.placeNew = angular.copy(originalPlaceNew);
		};

		vm.goPlace = function (place) {
			$state.go('place', {
				placeName: place.url_name,
				placeId: place.id
			});
		};

		function getCities(countryObj) {
			placesService.getCities(countryObj).then(function(data){
					vm.cities = data;
				}
			);
		}

		function getSubscribers() {
			return UserService.getSubscribers(myId)
				.then(function (subscribers) {
					vm.subscribers = subscribers;
				});
		}

		function getSubscription() {
			return PublicationService.getSubscription(myId)
				.then(function (data) {
					vm.subscription = data;
				});
		}

		function getScopes(){
			PublicationService.getScopes().then(function(data){
				$scope.scopes = data;
				$scope.scopes.forEach(function(value){
					if(value.signed){
						$scope.checkedAreas.push(value.id);
						value.active = true;
					}
				});
			},
			function(error){
				console.log(error);
			});
		}

		$scope.checkedScope = function(active, scope){
			if(active){
				if($scope.checkedAreas.length < 3){
					$scope.checkedAreas.push(scope.id);
				}
			}else{
				$scope.checkedAreas.splice($scope.checkedAreas.indexOf(scope.id), 1);
			}
		};

		getScopes();

		function setAdmin(placeId, userId) {
			return placesService.setAdmin(placeId, userId);
		}

		function setAdmins(users, placeId) {

			//var defer = $q.defer();
			//
			//
			//var prom = [];

			angular.forEach(users, function (user) {
				setAdmin(placeId, user.userId);
			});

			//$q.all(prom).then(function () {
			//    modalNewGroup.close();
			//});
		}

		function openModalCropLogoImage(fileName, e, isCoverMode) {
			var file = e.currentTarget.files[0];
			if (file) {
				var reader = new FileReader();

				reader.onload = function (e) {
					$scope.$apply(function ($scope) {
						vm.selectedLogoImage = e.target.result;
						vm.selectedLogoImageName = fileName;
						modalCropLogoImage = ngDialog.open({
							template: '../app/Places/views/popup-crop-image.html',
							className: 'settings-add-ava ngdialog-theme-default',
							scope: $scope,
							data: {
								isCover: isCoverMode
							}
						});
					});
				};

				reader.readAsDataURL(file);
			}
		}


		vm.beforeInitMapForNewPlace = function () {
			if (vm.placeNew.country.originalObject.name && vm.placeNew.city) {
				var addressStr = vm.placeNew.country.name + ' ' + vm.placeNew.city.name;
				ymaps.geocode(addressStr, {format: 'json', results: 1}).then(function (res) {
					// Выбираем первый результат геокодирования.
					var firstGeoObject = res.geoObjects.get(0);
					// Задаем центр карты.
					$scope.$apply(function () {
						vm.center = firstGeoObject.geometry.getCoordinates();
					});
				}, function (err) {
					// Если геокодирование не удалось, сообщаем об ошибке.
					alert(err.message);
				});
			} else {
				var geolocation = ymaps.geolocation;
				geolocation.get({
					provider: 'yandex',
					mapStateAutoApply: true
				}).then(function (result) {
					//vm.geoObject.geometry.coordinates = result.geoObjects.position;
					vm.center = result.geoObjects.position;
					$scope.$digest();
				});
				geolocation.get({
					provider: 'browser',
					mapStateAutoApply: true
				}).then(function (result) {
					//vm.geoObject.geometry.coordinates = result.geoObjects.position;
					vm.center = result.geoObjects.position;
					$scope.$digest();
				});
			}
		};
		vm.geoObject = {
			geometry: {
				type: 'Point',
				coordinates: []
			},
			properties: {}
		};
		vm.afterInit = function ($map) {
			map = $map;
		};
		vm.mapClick = function (e) {
			var coords = e.get('coords');
			vm.geoObject.geometry.coordinates = coords;

			// Отправим запрос на геокодирование.
			ymaps.geocode(coords).then(function (res) {
				var names = [];
				// Переберём все найденные результаты и
				// запишем имена найденный объектов в массив names.
				res.geoObjects.each(function (obj) {
					names.push(obj.properties.get('text'));
				});

				var addressStr = '';
				var obj = res.geoObjects.get(0);
				var thoroughfareName = obj.getThoroughfare();
				var premiseNumber = obj.getPremiseNumber();

				if (thoroughfareName && premiseNumber) {
					addressStr = thoroughfareName + ' ' + premiseNumber;
				} else {
					addressStr = obj.properties.get('name');
				}

				vm.placeNew.address = addressStr;
				$scope.$broadcast('angucomplete-alt:changeInput', 'autocomplete-address-place', addressStr);

				// Добавим на карту метку в точку, по координатам
				// которой запрашивали обратное геокодирование.
				var geoObj = {
					geometry: {
						type: 'Point',
						coordinates: coords
					},
					properties: {
						// В качестве контента иконки выведем
						// первый найденный объект.
						iconContent: names[0],
						// А в качестве контента балуна - подробности:
						// имена всех остальных найденных объектов.
						balloonContent: names.reverse().join(', ')
					}
				};

				vm.placeNew.coordinates_x = geoObj.geometry.coordinates[0];
				vm.placeNew.coordinates_y = geoObj.geometry.coordinates[1];
				$scope.$apply(function () {
					vm.geoObject = geoObj;
				});
			});
		};

		vm.beforeInit = function () {
			var geolocation = ymaps.geolocation;
			geolocation.get({
				provider: 'browser',
				mapStateAutoApply: true
			}).then(function (result) {
				//vm.geoObject.geometry.coordinates = result.geoObjects.position;
				vm.myCoords = result.geoObjects.position;
				placesService.getPlaceNearMe(vm.myCoords[0], vm.myCoords[1])
					.then(function (data) {
						vm.nearPlaces = data;
					});
				//$scope.$digest();
			});
		};

		vm.addressSelected = function (selected) {
			if (selected) {
				var posStr = selected.originalObject.GeoObject.Point.pos;
				var posArr = posStr.split(' ');
				vm.placeNew.coordinates_x = +posArr[1];
				vm.placeNew.coordinates_y = +posArr[0];
				vm.placeNew.address = selected.title;
			}
		};

		vm.citySelected = function (item) {

			var city = item.originalObject;

			console.log(city);

			if (city.id) {
				vm.placeNew.city = {};
				vm.placeNew.city.id = +city.id;
				vm.placeNew.city.name = city.name;
			} else {
				var cityObj = {
					countryId: vm.placeNew.country.originalObject.id,
					name: city.name,
					region: city.region,
					area: city.area
				};
				placesService.addCity(cityObj)
					.then(function (data) {
							if (data.status) {
								vm.placeNew.city = {};
								vm.placeNew.city.id = +data.city_id;
								vm.placeNew.city.name = city.name;
							}
						},
						function (error) {
							console.log(error);
						});
			}
		};

		vm.searchAPI = function (inputStr, timeoutPromise) {

			return $http({
				method: 'GET',
				url: 'https://geocode-maps.yandex.ru/1.x/?format=json&results=1&geocode=' + vm.placeNew.country.originalObject.name + ', ' + vm.placeNew.city.name + ', ' + inputStr,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
				data: null,
				timeout: 1000
			})
				.then(getPublicationsComplete)
				.catch(getPublicationsFailed);

			function getPublicationsComplete(resp) {
				// return only first found address
				return resp.data.response.GeoObjectCollection.featureMember;
			}

			function getPublicationsFailed(error) {
				console.error('XHR Failed for getPublications. ' + error.data);
			}

		};


		function getCitiesFromDatabase(countryId, cityName) {
			return placesService.getCities(countryId, cityName)
				.then(function(data) {
					return data;
				});
		}

		function getCitiesFromYandexMaps(countryName, cityName) {
			return placesService.getCitiesFromYandexMaps(countryName, cityName)
				.then(function(data) {
					return data;
				});
		}


		/**
		 * Returns array of cities
		 * @param data
		 * @returns {*|Array}
		 */
		function getCitiesYandex(data) {
			var arr = data.response.GeoObjectCollection.featureMember;


			arr.forEach(function (item) {
				var data = item.GeoObject.metaDataProperty.GeocoderMetaData;
				var subArea = null;
				var cityName = null,
					region = null,
					area = null;

				if (data.kind === 'locality') {
					subArea = data.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea;

					if (subArea) {
						cityName = subArea.Locality.LocalityName;
						region = data.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName;
						area = subArea.SubAdministrativeAreaName;
					} else {
						subArea = data.AddressDetails.Country.AdministrativeArea;
						cityName = subArea.Locality.LocalityName;
						region = '';
						area = '';
					}

					vm.cities.push({
						region: region,
						name: cityName,
						area: area
					});

				}
			});
			// vm.cities = orderBy(vm.cities, '+name');
			return vm.cities;
		}


		/**
		 * Remove duplicates by cities name and region
		 * @param data
		 * @returns {*}
		 */
		function getCitiesWithoutDuplicates(data) {
			return data.filter(function(obj, pos, arr) {

				var names = arr.map(function(mapObj) {
					return mapObj['name'] + ' ' + mapObj['region'];
				});

				return names.indexOf(obj['name'] + ' ' + obj['region']) === pos;
			});
		}

		vm.searchCity = function (cityName) {
			vm.cities = [];

			var def = $q.defer();


			$q.all([
				getCitiesFromDatabase(vm.placeNew.country.originalObject.id, cityName),
				getCitiesFromYandexMaps(vm.placeNew.country.originalObject.name, cityName)
			]).then(function(cities) {
				console.log(cities);

				var citiesDatabase = cities[0];
				var citiesYandex = getCitiesYandex(cities[1]);
				console.log(citiesYandex);

				var newArr = citiesDatabase.concat(citiesYandex);
				var filteredArr = getCitiesWithoutDuplicates(newArr);
				console.log('Before filter', newArr);
				console.log('-------------');
				console.log('After filter', filteredArr);
				filteredArr = orderBy(filteredArr, '+name');
				def.resolve(filteredArr);
			});

			return def.promise;
		};
	}

})(angular);
