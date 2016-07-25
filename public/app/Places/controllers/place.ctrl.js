(function (angular) {
    'use strict';

    angular
        .module('app.places')
        .controller('PlaceCtrl', PlaceCtrl);

    PlaceCtrl.$inject = ['$scope', '$state', 'place', 'storageService', 'placesService', 'ngDialog', '$http', '$window'];

    function PlaceCtrl($scope, $state, place, storageService, placesService, ngDialog, $http, $window) {

        var vm = this;
        var storage = storageService.getStorage();

        var myId = +storage.userId;
        var myAvatar = storage.loggedUserAva;
        var firstName = storage.firstName;
        var lastName = storage.lastName;

        var modalEditPlace, modalDeletePlace, modalInviteUsers,
            modalSetCreator, modalNewPublication, modalReviewPublication;

        //var groupName = $stateParams.groupName;
        //
        //var newPublicationObj = {
        //    groupId: group.id,
        //    text: ''
        //};
        //
        //
        vm.firstName = firstName;
        vm.lastName = lastName;
        vm.myAvatar = myAvatar;


        vm.place = place;
        vm.placeEdited = {};
        //vm.newPublication = angular.copy(newPublicationObj);
        //
        //vm.forms = {
        //    editGroup: {},
        //    newPublication: {}
        //};
        //
        //vm.showGroupMenu = false;
        //vm.subscribers = [];
        //vm.invitedUsers = [];
        //vm.adminsList = [];
        //vm.creator = {id: null};
        //
        //vm.inviteNotSend = true;
        //vm.isSend = false;
        //
        //vm.emoji = {
        //    emojiMessage: {
        //        messagetext: '',
        //        rawhtml: ''
        //    }
        //};
        //
        //vm.userName = storage.username;
        //
        //vm.files = [];
        //
        activate();
        //
        ///////////////////////////////////////////////////
        //
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
        //
        // set default tab (view) for place view
        $scope.$on("$stateChangeSuccess", function () {
            var state = $state.current.name;
            if (state === 'place') {
                $state.go('place.publications');
            }
        });

        vm.subscribe = function () {
            if (place.is_creator) {
                openModalSetCreator();
            } else {
                placesService.subscribePlace(vm.place.id)
                    .then(function (data) {
                        if (data.status) {
                            vm.place.is_sub = data.is_sub;
                            if (data.is_sub) {
                                vm.place.users.push({
                                    avatar_path: myAvatar,
                                    first_name: firstName,
                                    last_name: lastName,
                                    id: myId
                                });
                                vm.place.count_users += 1;
                            } else {
                                removeUser({userId: myId});
                                vm.place.count_users -= 1;
                            }

                        }
                    });
            }

        };
        //$scope.$on('ngDialog.opened', function (e, $dialog) {
        //    var string = $filter('colonToSmiley')(vm.placeEdited.description);
        //    if ($dialog.name === "modal-edit-group") {
        //        $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML = string;
        //    }
        //});
        //
        //
        // Modal windows
        vm.openModalEditPlace = function () {
            vm.placeEdited = angular.copy(vm.place);
            modalEditPlace = ngDialog.open({
                template: '../app/Places/views/popup-edit-place.html',
                name: 'modal-edit-group',
                className: 'popup-add-group popup-edit-group ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.openModalDeletePlace = function () {
            modalDeletePlace = ngDialog.open({
                template: '../app/Places/views/popup-delete-place.html',
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

        vm.openModalNewPublication = function () {
            modalNewPublication = ngDialog.open({
                template: '../app/Groups/views/popup-add-publication.html',
                name: 'modal-publication-group',
                className: 'user-publication ngdialog-theme-default',
                scope: $scope,
                preCloseCallback: resetFormNewPublication
            });
        };

        vm.openModalReviewPublication = function (id) {
            getPublication(id).then(function () {
                modalReviewPublication = ngDialog.open({
                    template: '../app/Groups/views/popup-view-group-publication.html',
                    name: 'modal-publication-group',
                    className: 'view-publication ngdialog-theme-default',
                    scope: $scope
                });
            });
        };
        //
        //
        //// Submit forms
        //vm.submitNewPublication = function () {
        //    vm.newPublication.text = vm.emoji.emojiMessage.messagetext;
        //    vm.newPublication.files = filterAttachFilesByType();
        //    groupsService.addPublication(vm.newPublication)
        //        .then(function (data) {
        //            if (data.status) {
        //                console.log('Publication added!');
        //                modalNewPublication.close();
        //            }
        //        })
        //};
        //
        //
        ////New publication
        //vm.removeAttachFile = function (index) {
        //    vm.files.splice(index, 1);
        //    $scope.$broadcast('rebuild:me');
        //};
        //
        //vm.beforeAttachFileToPublication = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
        //    if (vm.files.length > 4 || files > 4) {
        //        $scope.$broadcast('rebuild:me');
        //    }
        //};
        //
        //
        //vm.deleteGroup = function () {
        //    groupsService.deleteGroup(vm.group.id)
        //        .then(function (data) {
        //            if (data.status) {
        //                $state.go('groups');
        //                modalDeletePlace.close();
        //            }
        //        });
        //};
        //
        //vm.updateGroup = function () {
        //    if (groupName === vm.placeEdited.name) {
        //        vm.placeEdited.name = null;
        //    }
        //    if (!vm.forms.editGroup.avatar.$dirty) {
        //        vm.placeEdited.avatar = null;
        //    }
        //    vm.placeEdited.description = vm.emoji.emojiMessage.messagetext;
        //    groupsService.updateGroup(vm.placeEdited)
        //        .then(function (data) {
        //
        //        });
        //};
        //
        //vm.abortDeleteGroup = function () {
        //    modalDeletePlace.close();
        //};
        //
        //vm.subscribe = function () {
        //    if (group.is_creator) {
        //        openModalSetCreator();
        //    } else {
        //        groupsService.subscribeGroup(vm.group.id)
        //            .then(function (data) {
        //                if (data.status) {
        //                    vm.group.is_sub = data.is_sub;
        //                    if (data.is_sub) {
        //                        vm.group.users.push({
        //                            avatar_path: myAvatar,
        //                            first_name: firstName,
        //                            last_name: lastName,
        //                            id: myId
        //                        });
        //                        vm.group.count_users += 1;
        //                    } else {
        //                        removeUser({userId: myId});
        //                        vm.group.count_users -= 1;
        //                    }
        //
        //                }
        //            });
        //    }
        //
        //};
        //
        //vm.onItemSelected = function (user) {
        //    var isExist = $filter('getById')(vm.invitedUsers, user.id);
        //
        //    if (!isExist) {
        //        var item = {
        //            userId: user.id,
        //            firstName: user.first_name,
        //            lastName: user.last_name,
        //            avatar: user.avatar_path,
        //
        //            isAdmin: false
        //        };
        //        vm.invitedUsers.push(item);
        //    }
        //};
        //
        //vm.removeUserFromInviteList = function (user) {
        //    for (var i = vm.invitedUsers.length - 1; i >= 0; i--) {
        //        if (vm.invitedUsers[i].userId == user.userId) {
        //            vm.invitedUsers.splice(i, 1);
        //        }
        //    }
        //};
        //
        //vm.removeUser = function (user) {
        //    removeUser({
        //        userId: user.id,
        //        isAdmin: user.is_admin
        //    });
        //};
        //
        //vm.submitInviteUsers = function () {
        //    if (!vm.inviteNotSend) {
        //        return false;
        //    }
        //    groupsService.inviteUsers(group.id, vm.invitedUsers)
        //        .then(function (data) {
        //            if (data.status) {
        //                vm.inviteNotSend = false;
        //                $timeout(function () {
        //                    resetFormInviteUsers();
        //                    modalInviteUsers.close();
        //                }, 2000);
        //            }
        //        });
        //};
        //
        //vm.abortInviteUsers = function () {
        //    resetFormInviteUsers();
        //    modalInviteUsers.close();
        //};
        //
        //vm.setAdmin = function (user) {
        //    if (!vm.group.is_creator) {
        //        return false;
        //    }
        //    groupsService.setAdmin(group.id, user.id)
        //        .then(function (data) {
        //            if (data.status) {
        //                user.is_admin = data.is_admin;
        //            }
        //        });
        //};
        //
        //vm.setCreator = function () {
        //    if (vm.isSend) {
        //        return false;
        //    }
        //    groupsService.setCreator(group.id, vm.creator.id)
        //        .then(function (data) {
        //            if (data.status) {
        //                vm.isSend = true;
        //                $timeout(function () {
        //                    resetFormSetCreator();
        //                    modalSetCreator.close();
        //                    $state.go('groups');
        //                }, 2000);
        //            }
        //        });
        //};
        //
        //vm.abortSetCreator = function () {
        //    resetFormSetCreator();
        //    modalSetCreator.close();
        //};
        //
        //vm.changeGroupCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
        //    Upload.resize(file, 700, 240, 1, null, null, true).then(function (resizedFile) {
        //        console.log(resizedFile);
        //        vm.placeEdited.avatar = resizedFile;
        //    });
        //};
        //
        //vm.changeMainFile = function (file, flag, pub) {
        //    if (file.pivot.video_id) {
        //        vm.mainImage = "";
        //        vm.mainVideo = file.url;
        //    } else if (file.pivot.image_id) {
        //        if (flag) {
        //            vm.mainImageInPopup = file.url;
        //        } else {
        //            vm.mainVideo = "";
        //            vm.mainImage = file.url;
        //        }
        //    }
        //};
        //
        //
        //function getSubscribers() {
        //    return UserService.getSubscribers(myId)
        //        .then(function (subscribers) {
        //            vm.subscribers = subscribers;
        //        });
        //}
        //
        //function getPublication(id) {
        //    return PublicationService.getSinglePublication(id)
        //        .then(function (data) {
        //            vm.activePublication = data;
        //            if (data.images[0] !== undefined) {
        //                vm.mainImage = data.images[0].url;
        //            }
        //        });
        //}
        //
        // Reset Forms
        function resetFormInviteUsers() {
            vm.invitedUsers = [];
            vm.subscribers = [];
            vm.inviteNotSend = true;
        }

        function resetFormSetCreator() {
            vm.adminsList = [];
            vm.creator.id = null;
        }

        function resetFormNewPublication() {
            vm.newPublication = angular.copy(newPublicationObj);
            vm.files = [];
        }
        //
        //
        function removeUser(user) {
            var arr = [];
            var indexToRemove;
            for (var i = vm.place.users.length - 1; i >= 0; i--) {
                if (vm.place.users[i].id == user.userId) {
                    if (user.isAdmin && vm.place.is_creator || !user.isAdmin && vm.place.is_admin || user.userId === myId) {
                        arr.push(user.userId);
                        indexToRemove = i;
                        groupsService.removeUsers(vm.place.id, arr)
                            .then(function (data) {
                                if (data.status) {
                                    vm.place.users.splice(indexToRemove, 1);
                                }
                            });
                    }

                }
            }
        }
        //
        //function openModalSetCreator() {
        //    vm.adminsList = getAdminsList();
        //    modalSetCreator = ngDialog.open({
        //        template: '../app/Groups/views/popup-setcreator-group.html',
        //        name: 'modal-setcreator-group',
        //        className: 'popup-setcreator-group ngdialog-theme-default',
        //        scope: $scope
        //    });
        //}
        //
        //function getAdminsList() {
        //    return group.users.filter(function (item) {
        //        return (!!item.is_admin === true && item.id !== myId);
        //    });
        //}
        //
        //function filterAttachFilesByType() {
        //    var filesByType = {
        //        images: [],
        //        videos: []
        //    };
        //    if (vm.files && vm.files.length > 0) {
        //        angular.forEach(vm.files, function (file) {
        //            if (~file.type.indexOf('image')) {
        //                filesByType.images.push(file);
        //            } else if (~file.type.indexOf('video')) {
        //                filesByType.videos.push(file);
        //            }
        //        });
        //    }
        //
        //    return filesByType;
        //}

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
