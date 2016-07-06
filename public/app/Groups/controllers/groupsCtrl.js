angular.module('placePeopleApp')
    .controller('groupsCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService', 'ngDialog',
        function ($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog) {

            var myId;

            $scope.newGroup = {
                name: '',
                description: '',
                isOpen: false,
                avatar: null
            };
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
                var storage = storageService.getStorage();

                myId = storage.userId;

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
                // init emoji picker
                window.emojiPicker = new EmojiPicker({
                    emojiable_selector: '[data-emojiable=true]',
                    assetsPath: 'lib/img/',
                    popupButtonClasses: 'fa fa-smile-o'
                });
                window.emojiPicker.discover();
                $(".emoji-button").text("");

                getSubscribers(myId);
            });


            $scope.checkState = function (stateName) {
                return stateName === $state.current.name;
            };

            $scope.openNewGroupCreation = function () {
                ngDialog.open({
                    template: '../app/Groups/views/popup-add-group.html',
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


            function getSubscribers(userId) {
                UserService.getSubscribers(userId)
                    .then(function (subscribers) {
                        $scope.subscribers = subscribers;
                    });
            }


        }]);

