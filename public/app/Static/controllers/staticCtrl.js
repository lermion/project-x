angular.module('placePeopleApp')
    .controller('staticCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'StaticService', 'AuthService',
        '$window', '$http', 'storageService', '$sce', '$location', '$timeout',
        function ($scope, $rootScope, $state, $stateParams, StaticService, AuthService, $window, $http,
                  storageService, $sce, $location, $timeout) {

            $scope.mailForm = {};

            $scope.mail = {
                name: '',
                email: '',
                text: ''
            };

            $scope.alerts = {
                sendMessageToAdmin: false
            };

            var originalMail = angular.copy($scope.mail);



            $scope.submitMail = function () {
                $scope.mailForm.$setSubmitted();

                if ($scope.mailForm.$invalid) {
                    return false;
                }

                StaticService.sendMailToAdmin($scope.mail).then(function (data) {
                       if (data.status) {
                           $scope.mail = angular.copy(originalMail);
                           $scope.alerts.sendMessageToAdmin = true;

                           $timeout(function() {
                               $scope.alerts.sendMessageToAdmin = false;
                           }, 1000);
                       }
                });
            };


            $scope.$emit('publicPoint', 'public');
            $scope.sce = $sce;

            var storage = storageService.getStorage();

            if (storage.length) {
                $scope.userLogged = true;
                $scope.username = storage.username;
            } else {
                $scope.userLogged = false;
            }

            $scope.page = $stateParams.pageName;

            StaticService.getStatic($stateParams.pageName).then(function (res) {
                    $scope.staticText = res.text;
                },
                function (err) {
                    console.log(err);
                });

            $scope.openMenu = function () {
                if ($window.innerWidth <= 800) {
                    $scope.showMenu = !$scope.showMenu;
                } else {
                    $scope.showMenu = false;
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
                },
                true
            );
            w.bind('resize', function () {
                $scope.$apply();
            });


        }]);
