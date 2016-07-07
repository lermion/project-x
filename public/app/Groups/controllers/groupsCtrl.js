angular.module('placePeopleApp')
    .controller('groupsCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService', 'ngDialog',
        function ($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog) {

            var storage = storageService.getStorage();
            var myId = storage.userId;
            var modalNewGroup, modalCropImage;

            $scope.myName = storage.firstName + ' ' + storage.lastName;
            $scope.myAvatar = storage.loggedUserAva;
            $scope.showEditAva = true;


            $scope.newGroup = {
                name: '',
                description: '',
                isOpen: false,
                avatar: null
            };
            $scope.myImage = null;
            $scope.myCroppedImage = null;
            $scope.blobImg = null;
            $scope.subscribers = [];
            $scope.users = [];
            $scope.strSearch = '';
            $scope.onItemSelected = function (user) {

                var item = {
                    userId: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatar: user.avatar_path
                };
                $scope.users.push(item);
            };


            activate();

            /////////////////////////////////////////////////

            function activate() {
                init();
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

            }


            /*Page content*/

            // set default tab (view) for group view
            $scope.$on("$stateChangeSuccess", function () {
                var state = $state.current.name;
                if (state === 'group') {
                    $state.go('group.publications');
                }
            });

            $scope.$on('ngDialog.opened', function (e, $dialog) {
                if ($dialog.name === 'modal-new-group') {
                    angular.element(document.querySelector('.js-group-avatar')).on('change', onFileSelected);

                    // init emoji picker
                    window.emojiPicker = new EmojiPicker({
                        emojiable_selector: '[data-emojiable=true]',
                        assetsPath: 'lib/img/',
                        popupButtonClasses: 'fa fa-smile-o'
                    });
                    window.emojiPicker.discover();
                    $(".emoji-button").text("");

                    getSubscribers(myId);
                }
            });


            $scope.checkState = function (stateName) {
                return stateName === $state.current.name;
            };

            $scope.openNewGroupCreation = function () {
                modalNewGroup = ngDialog.open({
                    template: '../app/Groups/views/popup-add-group.html',
                    name: 'modal-new-group',
                    className: 'popup-add-group ngdialog-theme-default',
                    scope: $scope
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
                for (var i = $scope.users.length - 1; i >= 0; i--) {
                    if ($scope.users[i].userId == user.userId) {
                        $scope.users.splice(i, 1);
                    }
                }
            };

            $scope.saveCropp = function (img, cropped) {

                var blobFile = blobToFile(cropped);

                $scope.dataURI = cropped;

                blobFile.name = 'image';
                blobFile.lastModifiedDate = new Date();

                modalCropImage.close();
                //
                //
                //UserService.updateAvatar(blobFile).then(function (res) {
                //        $scope.consoleLog = res;
                //        if (res.status) {
                //            ngDialog.closeAll();
                //            storageService.setStorageItem('loggedUserAva', res.user.avatar_path);
                //        }
                //    },
                //    function (err) {
                //        console.log(err);
                //    });
            };


            function getSubscribers(userId) {
                UserService.getSubscribers(userId)
                    .then(function (subscribers) {
                        $scope.subscribers = subscribers;
                    });
            }

            function onFileSelected(e) {
                var file = e.currentTarget.files[0];
                if (file) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        $scope.$apply(function ($scope) {
                            $scope.myImage = e.target.result;
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

