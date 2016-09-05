(function (angular) {

    'use strict';

    angular
        .module('app.components')
        .component('pubEdit', {
            bindings: {
                group: '<',
                place: '<',
                profile: '<',
                feed: '<'
            },
            templateUrl: '../app/common/components/publication-new/publication-edit.html',
            controller: function ($rootScope, $scope, $q, $state, PublicationService, groupsService, placesService, storageService, ngDialog, Upload) {
                var ctrl = this;

                ctrl.pub = {};
                ctrl.files = [];
                ctrl.subForm = false;
                ctrl.isAnonym = false;

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
                    ctrl.isFeed = $state.is('feed');
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


                ctrl.newPublicationForm = {};

                ctrl.emojiMessage = {
                    messagetext: ''
                };

                ctrl.ngDialog = ngDialog;


                ctrl.attachFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
                    var defer = $q.defer();
                    var prom = [];
                    newFiles.forEach(function (image) {
                        prom.push(resizeImage(image));
                    });
                    $q.all(prom).then(function () {
                        $scope.$broadcast('rebuild:me');
                    });
                };

                ctrl.removeFile = function (index) {
                    ctrl.files.splice(index, 1);
                    $scope.$broadcast('rebuild:me');
                };

                ctrl.setMainPubPhoto = function (index) {
                    angular.forEach(ctrl.files, function (item) {
                        item.isCover = false;
                    });

                    ctrl.files[index].isCover = true;

                    ctrl.cover = ctrl.files[index];
                };

                ctrl.submitNewPublication = function () {

                    if (ctrl.subForm) {
                        return false;
                    }

                    ctrl.newPublicationForm.$setSubmitted();

                    if (ctrl.newPublicationForm.$invalid) {
                        return false;
                    }

                    ctrl.subForm = true;

                    var images = [];
                    var videos = [];

                    var isMain;

                    if ($state.is('feed')) {
                        isMain = 1;
                    } else {
                        isMain = 0;
                    }

                    ctrl.files.forEach(function (file) {
                        var type = file.type.split('/')[0];
                        if (type === 'image') {
                            images.push(file);
                        } else if (type === 'video') {
                            videos.push(file);
                        }
                    });

                    if (!ctrl.cover) {
                        // если нет видеофайлов, обложка = фото
                        if (videos.length === 0) {
                            ctrl.cover = images[0];
                        } else {
                            // если есть и видео и фото, то обложка = фото
                            if (images.length > 0) {
                                ctrl.cover = images[0];
                            } else {
                                // если есть только видео, то обложка = видео
                                ctrl.cover = videos[0];
                            }
                        }
                    }


                    var newPublication = {
                        text: ctrl.emojiMessage.messagetext,
                        cover: ctrl.cover,
                        images: images,
                        videos: videos,
                        isAnonym: ctrl.isAnonym,
                        isMain: isMain,
                        inProfile: $state.is('user'),

                        groupId: ctrl.group ? ctrl.group.id : null,
                        placeId: ctrl.place ? ctrl.place.id : null

                    };

                    // в зависимости от того где создается публикация используется свой сервис
                    if (ctrl.group) {
                        submitGroupPublication(newPublication);
                    } else if (ctrl.place) {
                        submitPlacePublication(newPublication);
                    } else {
                        submitProfileOrFeedPublication(newPublication);
                    }

                };

                function submitProfileOrFeedPublication(pub) {
                    PublicationService.createPublication(pub).then(function (data) {
                        $rootScope.$broadcast('publication:add', {
                            publication: data.publication
                        });
                        ctrl.subForm = false;
                        ngDialog.closeAll();
                    });
                }

                function submitGroupPublication(pub) {
                    groupsService.addPublication(pub).then(function (data) {
                        $rootScope.$broadcast('publication:add', {
                            publication: data.publication
                        });
                        ctrl.subForm = false;
                        ngDialog.closeAll();
                    });
                }

                function submitPlacePublication(pub) {
                    placesService.addPublication(pub).then(function (data) {
                        $rootScope.$broadcast('publication:add', {
                            publication: data.publication
                        });
                        ctrl.subForm = false;
                        ngDialog.closeAll();
                    });
                }

                function resizeImage(image) {
                    //Upload.imageDimensions(image).then(function (dimensions) {
                    //    console.info('Group publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                    //});

                    return Upload.resize(image, 700, 395).then(function (resizedFile) {
                        //Upload.imageDimensions(resizedFile).then(function (dimensions) {
                        //    console.info('Group publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                        //});
                        ctrl.files.push(resizedFile);
                    });
                }

                function getAvatarPath() {

                    var avatar;

                    if (ctrl.group) {
                        avatar = ctrl.group.card_avatar;
                    }
                    if (ctrl.place) {
                        avatar = ctrl.place.avatar;
                    }
                    if (ctrl.profile) {
                        avatar = ctrl.profile.loggedUserAva;
                    }
                    if (ctrl.feed) {
                        avatar = ctrl.feed.loggedUserAva;
                    }
                    return avatar;
                }

                function getAuthorName() {
                    var name;

                    if (ctrl.group) {
                        name = ctrl.group.name;
                    }
                    if (ctrl.place) {
                        name = ctrl.place.name;
                    }
                    if (ctrl.profile) {
                        name = ctrl.profile.fullName;
                    }
                    if (ctrl.feed) {
                        name = ctrl.feed.fullName;
                    }
                    return name;
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