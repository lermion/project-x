angular.module('app.groups')
    .controller('groupsCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$filter', '$q', 'StaticService',
        'AuthService', 'UserService', '$window', '$http', 'storageService', 'ngDialog', 'groupsService', 'PublicationService', 'Upload',
        function ($rootScope, $scope, $state, $stateParams, $filter, $q, StaticService,
                  AuthService, UserService, $window, $http, storageService, ngDialog, groupsService, PublicationService, Upload) {

            var LIMIT_MY_GROUPS = 3,
                LIMIT_ALL_PUBLIC_GROUPS = 3;

            var storage = storageService.getStorage();
            var myId = storage.userId;
            var modalNewGroup, modalEditGroup, modalCropImage, modalUnsubscribeCreator;


            $scope.myName = storage.firstName + ' ' + storage.lastName;
            $scope.myAvatar = storage.loggedUserAva;
            $scope.userName = storage.username;
            $scope.showEditAva = true;

            $scope.showGroupMenu = false;

            $scope.forms = {
                newGroup: {}
            };
            $scope.submFormGroup = false;
            $scope.subForm = false;


            $scope.newGroup = {
                name: '',
                description: '',
                isOpen: true,
                avatar: null,
                originalAvatar: null,
                avatarCard: null,
                users: []
            };
            $scope.editGroup = {
                name: '',
                description: '',
                isOpen: true,
                avatar: null
            };
            $scope.emojiMessage = {
                messagetext: ''
            };
            $scope.avatarFile = null;
            $scope.myImage = null;
            $scope.myCroppedImage = null;
            $scope.blobImg = null;
            $scope.subscribers = [];
            $scope.strSearch = '';
            $scope.showAllGroups = true;
            $scope.showMyGroups = true;
            $scope.showAllButtons = false;
            $scope.limitMyGroups = LIMIT_MY_GROUPS;
            $scope.limitAllPublicGroups = LIMIT_ALL_PUBLIC_GROUPS;
            $scope.filterGroups = {
                value: '-count_user'
            };
            $scope.onItemSelected = function (user) {

                var isExist = $filter('getById')($scope.newGroup.users, user.id);

                if (!isExist) {
                    var item = {
                        userId: user.id,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        avatar: user.avatar_path,
                        user_quote: user.user_quote,
                        is_online: user.is_online,

                        isAdmin: false
                    };
                    $scope.newGroup.users.push(item);
                }
            };
            $scope.setAdmin = function (user) {
                user.isAdmin = !user.isAdmin;
            };


            activate();

            /////////////////////////////////////////////////

            function activate() {
                init();
                getGroupList();
            }

            function init() {
                $scope.$emit('userPoint', 'user');

                $http.get('/static_page/get/name')
                    .success(function (response) {
                        $scope.staticPages = response;
                    })
                    .error(function (error) {
                        console.log(error);
                    });

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

            }


            /*Page content*/


            $scope.$on('ngDialog.opened', function (e, $dialog) {
                if ($dialog.name === 'modal-new-group' || $dialog.name === 'modal-edit-group') {
                    //angular.element(document.querySelector('.js-group-avatar')).on('change', onFileSelected);
                    //angular.element(document.querySelector('.emoji-wysiwyg-editor')).on('blur keyup paste input mousemove change', validateEmojiArea);
                    //angular.element(document.querySelector('#messageInput')).on('DOMNodeInserted', validateEmoji);
                    //angular.element(document.querySelector('.emoji-wysiwyg-editor')).on('blur keyup paste input mousemove change', validateEmoji);
                    // init emoji picker
                    //window.emojiPicker = new EmojiPicker({
                    //    emojiable_selector: '[data-emojiable=true]',
                    //    assetsPath: 'lib/img/',
                    //    popupButtonClasses: 'fa fa-smile-o'
                    //});
                    //window.emojiPicker.discover();
                    //$(".emoji-button").text("");

                    getSubscribers(myId);
                    getSubscription(myId);
                }
            });

            $rootScope.$on('emoji:group', function (event, args) {
                $scope.emojiMessage.rawhtml = args;
            });


            // Submit
            $scope.addGroup = function () {

                if ($scope.subForm) {
                    return false;
                }
                $scope.isGroupNameExist = false;
                validateEmojiArea();
                $scope.forms.newGroup.$setSubmitted();

                if ($scope.forms.newGroup.$invalid) {
                    return false;
                }
                $scope.submFormGroup = true;
                $scope.subForm = true;

                $scope.newGroup.description = $scope.emojiMessage.messagetext;

                groupsService.addGroup($scope.newGroup)
                    .then(function (data) {
                        if (data.status) {
                            data.group.users = [{id: myId}];
                            $scope.groupList.unshift(data.group);

                            if ($scope.newGroup.users.length > 0) {
                                //TODO: push new group object instead getting all groups
                                inviteUsers(data.group.id)
                                    .then(getGroupList)
                                    .then(function () {
                                        var users = $scope.newGroup.users.filter(function (item, i, arr) {
                                            return item.isAdmin === true;
                                        });
                                        setAdmins(users, data.group.id);
                                    });
                            } else {
                                resetFormNewGroup();
                                getGroupList();
                                $scope.subForm = false;
                                modalNewGroup.close();
                            }
                        } else {
                            if (+data.error.code === 1) {
                                $scope.subForm = false;
                                $scope.isGroupNameExist = true;
                            }
                        }
                    }, function () {
                        console.log('Add group failed');
                        $scope.subForm = false;
                    });
            };



            $scope.goGroup = function (group) {
                $state.go('group', {
                    groupId: group.id,
                    groupName: group.url_name
                });
            };

            $scope.checkState = function (stateName) {
                return stateName === $state.current.name;
            };

            $scope.openNewGroupCreation = function () {
                modalNewGroup = ngDialog.open({
                    template: '../app/Groups/views/popup-add-group.html',
                    name: 'modal-new-group',
                    className: 'popup-add-group ngdialog-theme-default',
                    scope: $scope,
                    preCloseCallback: resetFormNewGroup
                });
            };

            $scope.viewGroupPublication = function (groupId, pubId) {
                if ($window.innerWidth <= 720) {
                    $state.go('mobile-view-group-publication', {groupId: groupId, pubId: pubId});
                } else {
                    ngDialog.open({
                        template: '../app/Groups/views/popup-view-group-publication.html',
                        className: 'popup-view-group-publication ngdialog-theme-default',
                        scope: $scope
                    });
                }

            };

            $scope.showPublication = function (pubId) {
                ngDialog.open({
                    template: '../app/Groups/views/popup-view-group-publication.html',
                    className: 'popup-add-group ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.removeUser = function (user) {
                for (var i = $scope.newGroup.users.length - 1; i >= 0; i--) {
                    if ($scope.newGroup.users[i].userId == user.userId) {
                        $scope.newGroup.users.splice(i, 1);
                    }
                }
            };

            $scope.saveCropp = function (croppedDataURL) {

                var blob = Upload.dataUrltoBlob(croppedDataURL, $scope.myImageName);

                Upload.resize(blob, 218, 220, 1, null, null, true).then(function (resizedFile) {
                    $scope.newGroup.avatarCard = resizedFile;
                });

                modalCropImage.close();
            };





            $scope.cancelNewGroup = function () {
                modalNewGroup.close();
            };

            $scope.toogleGroupsView = function (filter) {
                switch (filter) {
                    case 'my':
                        $scope.showMyGroups = true;
                        $scope.showAllGroups = false;
                        $scope.showAllButtons = true;
                        $scope.limitMyGroups = 'Infinity';
                        break;
                    case 'public':
                        $scope.showMyGroups = false;
                        $scope.showAllGroups = true;
                        $scope.showAllButtons = true;
                        $scope.limitAllPublicGroups = 'Infinity';
                        break;
                    case 'all':
                        $scope.showMyGroups = true;
                        $scope.showAllGroups = true;
                        $scope.showAllButtons = false;
                        $scope.limitMyGroups = LIMIT_MY_GROUPS;
                        $scope.limitAllPublicGroups = LIMIT_ALL_PUBLIC_GROUPS;
                }
            };

            $scope.getGroupType = function () {
                return $scope.filterGroups;
            };

            $scope.subscribe = function (group) {
                groupsService.subscribeGroup(group.id)
                    .then(function (data) {
                        if (data.status) {
                            group.is_sub = data.is_sub;
                        }
                    });
            };

            $scope.showMyGroupsFilter = function (group) {
                return group.is_admin === true || group.is_sub === true;
            };

            $scope.changeGroupCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
                var originalFile;
                if (file) {
                    originalFile = event.currentTarget.files[0];
                    $scope.newGroup.originalAvatar = file;

                    Upload.imageDimensions(file).then(function (dimensions) {
                        console.info('Group: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                    });

                    Upload.resize(file, 700).then(function (resizedFile) {
                        Upload.imageDimensions(resizedFile).then(function (dimensions) {
                            console.info('Group: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                        });
                        $scope.newGroup.avatar = resizedFile;
                    });

                    onFileSelected(file.name, originalFile);
                }
            };


            // Modal windows
            $scope.openModalUnsubscribeCreator = function () {
                modalUnsubscribeCreator = ngDialog.open({
                    template: '../app/Groups/views/popup-unsubscribe-creator-group.html',
                    name: 'modal-notfound-group',
                    className: 'popup-delete-group ngdialog-theme-default',
                    scope: $scope
                });
            };

            function getGroupList() {
                return groupsService.getGroupList()
                    .then(function (groupList) {
                        $scope.groupList = groupList;

                        $scope.myGroupsFiltered = groupList.filter(function (group) {
                            return group.is_admin === true || group.is_sub === true;
                        });

                        $scope.publicGroupsFiltered = groupList.filter(function (group) {
                            return !!+group.is_open === true;
                        });

                    });
            }

            function getSubscribers(userId) {
                UserService.getSubscribers(userId)
                    .then(function (subscribers) {
                        $scope.subscribers = subscribers;
                    });
            }

            function getSubscription(userId) {
                PublicationService.getSubscription(userId)
                    .then(function (data) {
                        $scope.subscription = data;
                    });
            }

            function inviteUsers(groupId) {
                return groupsService.inviteUsers(groupId, $scope.newGroup.users);
            }

            function resetFormNewGroup() {
                $scope.newGroup = {
                    name: '',
                    description: '',
                    isOpen: true,
                    avatar: null,
                    users: []
                };
                $scope.dataURI = null;
                $scope.emojiMessage = {};
                $scope.subscribers = [];
                $scope.submFormGroup = false;
            }

            function setAdmin(groupId, userId) {
                return groupsService.setAdmin(groupId, userId);
            }

            function setAdmins(users, groupId) {

                var defer = $q.defer();


                var prom = [];

                angular.forEach(users, function (user) {
                    prom.push(setAdmin(groupId, user.userId));
                });

                $q.all(prom).then(function () {
                    modalNewGroup.close();
                    $scope.subForm = false;
                });
            }


            function onFileSelected(fileName, originalFile) {
                var file = originalFile;
                if (file) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $scope.$apply(function ($scope) {
                            $scope.myImage = e.target.result;
                            $scope.myImageName = fileName;

                            modalCropImage = ngDialog.open({
                                template: '../app/Groups/views/popup-crop-image.html',
                                className: 'settings-add-ava ngdialog-theme-default',
                                scope: $scope
                            });
                        });
                    };

                    reader.readAsDataURL(file);
                }

            }

            $scope.$watch('emojiMessage.messagetext', function (newValue, oldValue) {
                if ($scope.emojiHasError && newValue) {
                    $('.emoji-wysiwyg-editor').removeClass('has-error');
                    //$scope.forms.newGroup.description.$invalid = false;
                }
            });

            function validateEmojiArea() {
                var emojiArea = $('.emoji-wysiwyg-editor');

                var checkText = emojiArea.text().trim().length;
                var checkEmoji = emojiArea.children().length;

                if (checkText === 0 && checkEmoji === 0) {
                    //$scope.forms.newGroup.avatar.$invalid = true;
                    $scope.emojiHasError = true;
                    emojiArea.addClass('has-error');
                } else {
                    $scope.emojiHasError = false;
                    emojiArea.removeClass('has-error');
                }
            }

            function validateEmoji(e) {
                console.log(e.type);
            }

            function blobToFile(dataURI) {
                var byteString = atob(dataURI.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ab], {type: 'image/jpeg'});
            }

        }]);

