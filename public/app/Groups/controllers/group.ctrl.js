(function (angular) {
    'use strict';

    angular
        .module('app.groups')
        .controller('GroupCtrl', GroupCtrl);

    GroupCtrl.$inject = ['$filter', '$rootScope', '$scope', '$state', '$stateParams', 'group', '$http', '$window', 'AuthService', 'storageService', 'ngDialog', 'groupsService'];

    function GroupCtrl($filter, $rootScope, $scope, $state, $stateParams, group, $http, $window, AuthService, storageService, ngDialog, groupsService) {

        var vm = this;
        var storage = storageService.getStorage();

        var myId = storage.userId;

        var modalEditGroup, modalDeleteGroup, modalNoticeGroupNotFound;
        var groupName = $stateParams.groupName;

        vm.group = group;
        vm.groupEdited = {};
        vm.showGroupMenu = false;
        $scope.emoji = {};

        activate();

        /////////////////////////////////////////////////

        function activate() {
            init();
            //getGroup();
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

        vm.openModalEditGroup = function () {
            vm.groupEdited = angular.copy(vm.group);

            modalEditGroup = ngDialog.open({
                template: '../app/Groups/views/popup-edit-group.html',
                name: 'modal-edit-group',
                className: 'popup-add-group popup-edit-group ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.openModalDeleteGroup = function () {
            modalDeleteGroup = ngDialog.open({
                template: '../app/Groups/views/popup-delete-group.html',
                name: 'modal-delete-group',
                className: 'popup-delete-group ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.deleteGroup = function () {
            groupsService.deleteGroup(vm.group.id)
                .then(function (data) {
                    if (data.status) {
                        $state.go('groups');
                        modalDeleteGroup.close();
                    }
                });
        };

        vm.updateGroup = function () {
            groupsService.updateGroup(vm.groupEdited)
                .then(function (data) {

                });
        };

        vm.abortDeleteGroup = function () {
            modalDeleteGroup.close();
        };

        vm.subscribe = function () {
            groupsService.subscribeGroup(vm.group.id)
                .then(function (data) {
                    if (data.status) {
                        vm.group.is_sub = data.is_sub;
                    }
                });
        };

        vm.stateGo = function (state) {
            $state.go(state);
            modalNoticeGroupNotFound.close();
        };

        //function getGroup() {
        //    return groupsService.getGroup(groupName)
        //        .then(function (data) {
        //            if (data) {
        //                vm.group = data;
        //                vm.group.is_open = !!vm.group.is_open;
        //                vm.group.avatarIsChange = false;
        //
        //                $scope.emoji.messagetext = data.description;
        //            } else {
        //                showNoticeGroupNotFound();
        //            }
        //        });
        //}

        function showNoticeGroupNotFound() {
            modalNoticeGroupNotFound = ngDialog.open({
                template: '../app/Groups/views/popup-notfound-group.html',
                name: 'modal-notfound-group',
                className: 'popup-delete-group ngdialog-theme-default',
                scope: $scope
            });
        }
    }

})(angular);
