(function (angular) {
    'use strict';

    angular
        .module('app.places')
        .controller('PlacesCtrl', PlacesCtrl);

    PlacesCtrl.$inject = ['$scope', '$http', '$window', '$state', 'AuthService', 'storageService',
        'placesService', 'countries', 'ngDialog'];

    function PlacesCtrl($scope, $http, $window, $state, AuthService, storageService,
                        placesService, countries, ngDialog) {

        var vm = this;

        var storage = storageService.getStorage();

        var modalMap;

        vm.countries = countries;

        vm.userName = storage.username;

        vm.placesDropdown = null;

        vm.placeNew = {
            category: null,
            country: 'default',
            city: null,
            address: null,
            days: null,
            description: null,
            cover: null,
            logo: null,
            isCreate: null
        };

        vm.location = {
            latitude: null,
            longitude: null
        };

        activate();

        /////////////////////////////////////////////////

        function activate() {
            init();
            //getLocation();
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

        vm.openModalMap = function() {
            modalMap = ngDialog.open({
                template: '../app/Places/views/popup-map.html',
                name: 'modal-edit-group',
                className: 'popup-add-group place-map ngdialog-theme-default',
                scope: $scope
            });
        };


        ymaps.ready(getLocation);

        function getLocation() {
            var geolocation = ymaps.geolocation,
                myMap = new ymaps.Map('map', {
                    center: [55, 34],
                    zoom: 10
                }, {
                    searchControlProvider: 'yandex#search'
                });

            geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                result.geoObjects.options.set('preset', 'islands#redCircleIcon');
                result.geoObjects.get(0).properties.set({
                    balloonContentBody: 'Мое местоположение'
                });
                myMap.geoObjects.add(result.geoObjects);
                vm.location.latitude = result.geoObjects.position[0];
                vm.location.longitude = result.geoObjects.position[1];
            });

            //geolocation.get({
            //    provider: 'browser',
            //    mapStateAutoApply: true
            //}).then(function (result) {
            //    result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
            //    myMap.geoObjects.add(result.geoObjects);
            //});
        }

        function getCities(country) {
            placesService.getCities(country.id).then(
                function (data) {
                    vm.cities = data;
                }
            );
        }


    }

})(angular);
