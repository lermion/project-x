(function (angular) {
    'use strict';

    angular
        .module('app.groups')
        .controller('GroupCtrl', GroupCtrl);

    GroupCtrl.$inject = ['$filter', '$rootScope', '$scope', '$state', '$stateParams', '$http', '$window', 'AuthService', 'storageService', 'ngDialog', 'groupsService'];

    function GroupCtrl($filter, $rootScope, $scope, $state, $stateParams, $http, $window, AuthService, storageService, ngDialog, groupsService) {

        var vm = this;
        var modalEditGroup;
        var groupName = $stateParams.groupName;

        vm.group = {};
        vm.showGroupMenu = false;
        $scope.emoji = {
        };
        //$scope.emojiMessage = {
        //    rawhtml: '5555555'
        //};

        activate();

        /////////////////////////////////////////////////

        function activate() {
            init();
            getGroup();
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

        // set default tab (view) for group view
        $scope.$on("$stateChangeSuccess", function () {
            var state = $state.current.name;
            if (state === 'group') {
                $state.go('group.publications');
            }
        });

        vm.editGroup = function () {
            modalEditGroup = ngDialog.open({
                template: '../app/Groups/views/popup-edit-group.html',
                name: 'modal-edit-group',
                className: 'popup-add-group ngdialog-theme-default',
                scope: $scope
            });
        };

        function getGroup() {
            groupsService.getGroup(groupName)
                .then(function (data) {
                    vm.group = data;
                    $scope.emoji.messagetext = data.description;
                    //$scope.emoji.rawhtml = '123';
                    //$rootScope.$broadcast('emoji:group', {message: data.description});
                });
        }
    }

})(angular);
