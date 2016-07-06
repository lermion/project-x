angular.module('placePeopleApp')
    .controller('chatCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
        '$window', '$http', 'storageService', 'ngDialog', 'ChatService',
        function ($scope, $state, $stateParams, StaticService, AuthService, UserService, 
            $window, $http, storageService, ngDialog, ChatService) {
            $scope.$emit('userPoint', 'user');
            var storage = storageService.getStorage();
            $scope.loggedUser = storage.username;

            $http.get('/static_page/get/name')
                .success(function (response) {
                    $scope.staticPages = response;
                })
                .error(function (error) {
                    console.log(error);
                });
            $scope.logOut = function () {
                AuthService.userLogOut()
                    .then(function (res) {
                        storageService.deleteStorage();
                        $state.go('login');
                    }, function (err) {
                        console.log(err);
                    });
            };

            $scope.openMenu = function () {
                if ($window.innerWidth <= 800) {
                    $scope.showMenu = !$scope.showMenu;
                } else {
                    $scope.showMenu = true;
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
            $scope.$watch(
                function () {
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
                    } else {
                        $scope.resizeSizes = '';
                        $scope.resizeHeight = '';
                    }
                },
                true
            );
            w.bind('resize', function () {
                $scope.$apply();
            });

            /*Page content*/
    }]);