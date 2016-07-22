(function (angular) {
    'use strict';

    angular
        .module('app.places')
        .controller('PlacesCtrl', PlacesCtrl);

    PlacesCtrl.$inject = ['$scope', '$http', '$window', '$state', 'AuthService', 'storageService',
        'placesService', 'countries', 'places', 'ngDialog', 'PublicationService', 'UserService'];

    function PlacesCtrl($scope, $http, $window, $state, AuthService, storageService,
                        placesService, countries, places, ngDialog, PublicationService, UserService) {

        var vm = this;

        var storage = storageService.getStorage();

        var modalMap, map;

        vm.countries = countries;

        vm.userName = storage.username;

        vm.placesDropdown = null;

        vm.placeNew = {
            category: null,
            country: 'default',
            city: {},
            address: null,
            days: null,
            description: null,
            cover: null,
            logo: null,
            isCreate: null,
            coordinates_x: null,
            coordinates_y: null,
            expired_date: null,

            // invited users
            users: []
        };

        vm.location = {
            latitude: null,
            longitude: null
        };

        vm.isPlaceAdded = false;

        activate();

        /////////////////////////////////////////////////

        function activate() {
            init();
        }

        function init() {
            $scope.$emit('userPoint', 'user');
            var storage = storageService.getStorage();
            vm.loggedUser = storage.username;

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


        $scope.$watch(angular.bind(vm, function () {
            return vm.placesDropdown;
        }), function (newVal) {
            if (newVal === 'places.add') {
                vm.placesDropdown = 'default';
                $state.go('places.add');
            }
        });
        $scope.$watch(angular.bind(vm, function () {
            return vm.placeNew.country;
        }), function (newVal, oldVal) {
            if (newVal !== oldVal) {
                getCities(newVal);
            }
        });

        vm.placeAdd = function () {

        };

        vm.openModalMap = function () {
            modalMap = ngDialog.open({
                template: '../app/Places/views/popup-map.html',
                name: 'modal-edit-group',
                className: 'popup-add-group place-map ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.submitPlaceNew = function () {
            vm.form.placeNew.$setSubmitted();

            if (vm.form.placeNew.$invalid) {
                return false;
            }
            placesService.addPlace(vm.placeNew)
                .then(function(data) {
                    if (data.status) {
                        console.log('Place added!');
                        getSubscribers();
                        getSubscription();
                        vm.isPlaceAdded = true;
                    }
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

        function getCities(country) {
            placesService.getCities(country.id).then(
                function (data) {
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


        vm.beforeInit = function () {
            var geolocation = ymaps.geolocation;
            geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                vm.geoObject.geometry.coordinates = result.geoObjects.position;
                vm.center = result.geoObjects.position;
                $scope.$digest();
            });
            geolocation.get({
                provider: 'browser',
                mapStateAutoApply: true
            }).then(function (result) {
                vm.geoObject.geometry.coordinates = result.geoObjects.position;
                vm.center = result.geoObjects.position;
                $scope.$digest();
            });
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
            console.log(coords);
            vm.geoObject.geometry.coordinates = coords;

            // Отправим запрос на геокодирование.
            ymaps.geocode(coords).then(function (res) {
                var names = [];
                // Переберём все найденные результаты и
                // запишем имена найденный объектов в массив names.
                res.geoObjects.each(function (obj) {
                    names.push(obj.properties.get('text'));
                });
                console.log(names[0]);
                vm.placeNew.address = names[0];

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


    }

})(angular);
