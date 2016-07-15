(function (angular) {
    'use strict';

    angular
        .module('app.places')
        .controller('PlacesCtrl', PlacesCtrl);

    PlacesCtrl.$inject = ['$scope', '$http', '$window', '$state', 'AuthService', 'storageService'];

    function PlacesCtrl($scope, $http, $window, $state, AuthService, storageService) {

        var vm = this;

        vm.placesDropdown = null;

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

        $scope.$watch(angular.bind(vm, function() {
            return vm.placesDropdown;
        }), function(newVal) {
            if (newVal === 'places.add') {
                $state.go('places.add');
            }
        });

        vm.placeAdd = function() {

        }
    }

})(angular);
