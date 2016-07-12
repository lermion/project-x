(function (angular) {
    'use strict';

    angular
        .module('app.groups')
        .controller('GroupCtrl', GroupCtrl);

    GroupCtrl.$inject = ['$filter', '$timeout', '$scope', '$state', '$stateParams', 'group', '$http', '$window',
        'AuthService', 'storageService', 'ngDialog', 'groupsService', 'UserService'];

    function GroupCtrl($filter, $timeout, $scope, $state, $stateParams, group, $http, $window,
                       AuthService, storageService, ngDialog, groupsService, UserService) {

        var vm = this;
        var storage = storageService.getStorage();

        var myId = storage.userId;
        var myAvatar = storage.loggedUserAva;
        var firstName = storage.firstName;
        var lastName = storage.lastName;

        var modalEditGroup, modalDeleteGroup, modalInviteUsers;
        var groupName = $stateParams.groupName;

        vm.group = group;
        vm.groupEdited = {};
        vm.showGroupMenu = false;
        vm.subscribers = [];
        vm.invitedUsers = [];

        vm.inviteNotSend = true;
        $scope.emoji = {};

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

        vm.openModalInviteUsers = function () {
            getSubscribers().then(function () {
                modalInviteUsers = ngDialog.open({
                    template: '../app/Groups/views/popup-invite-group.html',
                    name: 'modal-invite-group',
                    className: 'popup-invite-group ngdialog-theme-default',
                    scope: $scope
                });
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
                        if (data.is_sub) {
                            vm.group.users.push({
                                avatar_path: myAvatar,
                                first_name: firstName,
                                last_name: lastName,
                                id: myId
                            });
                            vm.group.count_users += 1;
                        } else {
                            removeUser({userId: myId});
                            vm.group.count_users -= 1;
                        }

                    }
                });
        };

        vm.onItemSelected = function (user) {
            var isExist = $filter('getById')(vm.invitedUsers, user.id);

            if (!isExist) {
                var item = {
                    userId: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatar: user.avatar_path,

                    isAdmin: false
                };
                vm.invitedUsers.push(item);
            }
        };

        vm.removeUserFromInviteList = function (user) {
            for (var i = vm.invitedUsers.length - 1; i >= 0; i--) {
                if (vm.invitedUsers[i].userId == user.userId) {
                    vm.invitedUsers.splice(i, 1);
                }
            }
        };

        vm.removeUser = function (user) {
            removeUser({
                userId: user.id,
                isAdmin: user.is_admin
            });
        };

        vm.submitInviteUsers = function () {
            if (!vm.inviteNotSend) {
                return false;
            }
            groupsService.inviteUsers(group.id, vm.invitedUsers)
                .then(function (data) {
                    if (data.status) {
                        vm.inviteNotSend = false;
                        $timeout(function () {
                            resetFormInviteUsers();
                            modalInviteUsers.close();
                        }, 2000);
                    }
                });
        };

        vm.abortInviteUsers = function () {
            resetFormInviteUsers();
            modalInviteUsers.close();
        };

        vm.setAdmin = function (user) {
            if (!vm.group.is_creator) {
                return false;
            }
            groupsService.setAdmin(group.id, user.id)
                .then(function (data) {
                    if (data.status) {
                        user.is_admin = data.is_admin;
                    }
                });
        };


        function getSubscribers() {
            return UserService.getSubscribers(myId)
                .then(function (subscribers) {
                    vm.subscribers = subscribers;
                });
        }

        function resetFormInviteUsers() {
            vm.invitedUsers = [];
            vm.subscribers = [];
            vm.inviteNotSend = true;
        }

        function removeUser(user) {
            for (var i = vm.group.users.length - 1; i >= 0; i--) {
                if (vm.group.users[i].id == user.userId) {
                    if (user.isAdmin && vm.group.is_creator || !user.isAdmin && vm.group.is_admin || user.userId === myId) {
                        vm.group.users.splice(i, 1);
                    }

                }
            }
        }

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

    }

})(angular);
