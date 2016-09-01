(function (angular) {

    'use strict';

    angular
        .module('app.components')
        .component('pubNew', {
            bindings: {
                group: '<',
                place: '<',
                profile: '<',
                feed: '<'
            },
            templateUrl: '../app/common/components/publication-new/publication-new.html',
            controller: function (PublicationService, groupsService, placesService, storageService, ngDialog, Upload) {
                var ctrl = this;

                ctrl.pub = {};

                // Current user
                var storage = storageService.getStorage();
                ctrl.firstName = storage.firstName;
                ctrl.lastName = storage.lastName;
                ctrl.myAvatar = storage.loggedUserAva;
                ctrl.myId = storage.userId;
                ctrl.userName = storage.username;

                ctrl.menuItems = [
                    {
                        menuType: "members",
                        name: "Пользователи"
                    },
                    {
                        menuType: "groups-chat",
                        name: "Групповые чаты"
                    },
                    {
                        menuType: "groups",
                        name: "Группы"
                    },
                    {
                        menuType: "places",
                        name: "Места"
                    }
                ];

                ctrl.shareData = [];

                ctrl.emojiMessage = {};

                // Lifecycle hooks
                ctrl.$onInit = function (args) {
                    ctrl.pub = ctrl.pubData;
                    ctrl.avatar = getAvatarPath();
                    ctrl.authorName = getAuthorName();
                };

                ctrl.$onChanges = function (args) {
                    //console.log('OnChanges');
                };

                ctrl.$onDestroy = function (args) {
                    //console.log('OnDestroy');
                };

                ctrl.$postLink = function (args) {
                    //console.log('OnLink');
                };



                $ctrl.newPublicationForm = {};

                $ctrl.submitNewPublication = function() {

                }

                $ctrl.emojiMessage = {
                    messagetext: ''
                }


                function getAvatarPath() {
                    return ctrl.group.card_avatar || ctrl.place.avatar || ctrl.profile.loggedUserAva || ctrl.feed.loggedUserAva;
                }

                function getAuthorName() {
                    return ctrl.group.name || ctrl.place.name || ctrl.profile.fullName || ctrl.feed.fullame;
                }

                function loadUserContacts() {
                    PublicationService.getSubscribers($rootScope.user.userId).then(function (response) {
                            ctrl.subscribers = response;
                        },
                        function (error) {
                            console.log(error);
                        });
                    PublicationService.getSubscription($rootScope.user.userId).then(function (response) {
                            ctrl.subscriptions = response;
                        },
                        function (error) {
                            console.log(error);
                        });
                }

                function resizeImage2(image) {
                    return Upload.resize(image, 700, 395).then(function (resizedFile) {
                        return resizedFile;
                    });
                }

            }
        });
})(angular);