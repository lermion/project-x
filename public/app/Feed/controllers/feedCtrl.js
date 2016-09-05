(function (angular) {
    'use strict';

    angular
        .module('app.feed')
        .controller('feedCtrl', feedCtrl);

    feedCtrl.$inject = ['$rootScope', '$scope', '$state', 'PublicationService',
        'FeedService', '$window', 'storageService', 'ngDialog', 'amMoment', 'Upload',
        'socket', 'groupsService', 'placesService', '$location', '$q', 'profile', 'publications'];

    function feedCtrl($rootScope, $scope, $state, PublicationService,
                      FeedService, $window, storageService, ngDialog, amMoment, Upload,
                      socket, groupsService, placesService, $location, $q, profile, publications) {

        $scope.$emit('userPoint', 'user');

        var storage = storageService.getStorage();

        var sharePublication;

        $scope.publications = publications;

        $scope.emojiMessage = {
            messagetext: ''
        };
        $scope.shareData = [];
        $scope.loggedUserAva = storage.loggedUserAva;
        $scope.groupsChecked = [];
        $scope.placesChecked = [];
        $scope.groupsChatArray = [];
        $scope.subscribersArray = [];
        $scope.subscriptionsArray = [];



        activate();

        ////////////////////////////////////////

        function activate() {
            setStorage();
            checkPublicationsView();
        }

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

        $scope.pubNew = {
            files: [],
            cover: null
        };

        var originalPub = angular.copy($scope.pubNew);

        // Submit
        $scope.publishNewPub = function (isAnon, pubText) {
            var textToSave = pubText.messagetext;

            if ($scope.pubNew.files === undefined || $scope.pubNew.files.length == 0) {
                $scope.publishNewPubErr = true;
                return;
            }

            $scope.newPubLoader = true;
            var images = [];
            var videos = [];
            var isMain = 1;

            if (!$scope.pubNew.cover) {
                //TODO: separate files by type
                $scope.pubNew.cover = $scope.pubNew.files[0];
            }

            $scope.pubNew.files.forEach(function (file) {
                var type = file.type.split('/')[0];
                if (type === 'image') {
                    images.push(file);
                } else if (type === 'video') {
                    videos.push(file);
                }
            });

            PublicationService.createPublication(textToSave, !!isAnon ? 1 : 0, isMain, videos, images, $scope.pubNew)
                .then(
                    function (res) {
                        if (res.status) {
                            $scope.publications.push(res.publication);
                            ngDialog.closeAll();
                        } else {
                            console.log('Error');
                        }
                        $scope.newPubLoader = false;
                        $scope.pubNew.files = [];
                    },
                    function (err) {
                        console.log(err);
                        $scope.pubNew.files = [];
                    });

        };

        $scope.setMainPubPhoto = function (index) {
            angular.forEach($scope.pubNew.files, function (item) {
                item.isCover = false;
            });
            $scope.pubNew.files[index].isCover = true;
            $scope.pubNew.cover = $scope.pubNew.files[index];
            //resizePubCoverImage($scope.pubNew.files[index]).then(function (image) {
            //    $scope.pubNew.cover = image;
            //});
        };

        amMoment.changeLocale('ru');

        $scope.loggedUserId = +storage.userId;

        $scope.commentModel = {pubText: ''};

        var counter = 10;

        $scope.loadMorePubs = function () {
            if ($scope.publications && counter <= $scope.publications.length) {
                counter += 10;
            } else {
                return;
            }
            getMainPubs(counter);
        };

        $scope.indexCurrentImage = 0;


        $scope.openPreviousInfo = function (images) {
            if (images.length >= 1) {
                $scope.indexCurrentImage--;
                if (images[$scope.indexCurrentImage] !== undefined) {
                    $scope.mainImage = images[$scope.indexCurrentImage].url;
                } else {
                    if ($scope.indexCurrentPublication !== 0) {
                        $scope.publications.sort(dynamicSort("created_at"));
                        $scope.singlePublication = $scope.publications[$scope.indexCurrentPublication -= 1];
                        if ($scope.singlePublication.images[0] !== undefined) {
                            $scope.mainImage = $scope.singlePublication.images[0].url;
                            $scope.indexCurrentImage = 0;
                        }
                    } else {
                        $scope.indexCurrentImage = 0;
                    }
                }
            }
        };

        $scope.openNextInfo = function (images) {
            if (images.length >= 1) {
                $scope.indexCurrentImage++;
                if (images[$scope.indexCurrentImage] !== undefined) {
                    $scope.mainImage = images[$scope.indexCurrentImage].url;
                } else {
                    if ($scope.indexCurrentPublication + 1 !== $scope.publications.length) {
                        $scope.publications.sort(dynamicSort("created_at"));
                        $scope.singlePublication = $scope.publications[$scope.indexCurrentPublication += 1];
                        if ($scope.singlePublication.images[0] !== undefined) {
                            $scope.mainImage = $scope.singlePublication.images[0].url;
                            $scope.indexCurrentImage = 0;
                        }
                    }
                }
            }
        };

        $scope.sharePub = function (pubId) {
            sharePublication = ngDialog.open({
                template: '../app/User/views/share-publication.html',
                className: 'share-publication ngdialog-theme-default',
                scope: $scope,
                data: {pubId: pubId},
                preCloseCallback: function () {
                    $scope.groupsChecked = [];
                    $scope.placesChecked = [];
                    $scope.groupsChatArray = [];
                    $scope.subscribersArray = [];
                    $scope.subscriptionsArray = [];
                    $scope.shareData = [];
                }
            });
            loadUserContacts();
        };

        $scope.sendSharePublication = function (pubId) {
            var isMembers = false;
            var isAnotherPlace = false;
            if ($scope.shareData.length > 0) {
                var membersLength = [];
                $scope.shareData.forEach(function (value) {
                    if (value.type === "members") {
                        membersLength.push(value);
                        var members = [];
                        members[0] = parseInt($scope.loggedUserId);
                        members[1] = value.id;
                        var data = {
                            members: members,
                            is_group: false,
                            share: true
                        };
                        socket.emit('create room', data, function (response) {
                            if (Object.prototype.toString.call(response) === '[object Array]') {
                                if (response.length === membersLength.length) {
                                    response.forEach(function (value) {
                                        var data = {
                                            userId: $scope.loggedUserId,
                                            room_id: value.room_id,
                                            message: $location.absUrl() + "/publication/" + pubId
                                        };
                                        socket.emit('send message', data);
                                    });
                                }
                            } else {
                                var data = {
                                    userId: $scope.loggedUserId,
                                    room_id: response.room_id,
                                    message: $location.absUrl() + "/publication/" + pubId
                                };
                                socket.emit('send message', data, function () {
                                    isMembers = true;
                                    if (!isAnotherPlace) {
                                        var popupNotification = ngDialog.open({
                                            template: '../app/User/views/popup-notification.html',
                                            className: 'popup-delete-group ngdialog-theme-default',
                                            scope: $scope
                                        });
                                        setTimeout(function () {
                                            ngDialog.closeAll();
                                        }, 2000);
                                    }
                                });
                            }
                        });
                    } else {
                        var data = {
                            userId: $scope.loggedUserId,
                            room_id: value.room_id,
                            message: $location.absUrl() + "/publication/" + pubId
                        };
                        socket.emit('send message', data, function () {
                            isAnotherPlace = true;
                            if (!isMembers) {
                                var popupNotification = ngDialog.open({
                                    template: '../app/User/views/popup-notification.html',
                                    className: 'popup-delete-group ngdialog-theme-default',
                                    scope: $scope
                                });
                                setTimeout(function () {
                                    ngDialog.closeAll();
                                }, 2000);
                            }
                        });
                    }
                });
            }
        };

        $scope.change = function (data, active, type) {
            if (active) {
                $scope.shareData.push(data);
                if (type === "subscription") {
                    $scope.subscriptionsArray.push(data.id);
                    $scope.subscribers.forEach(function (value) {
                        if (value.id === data.id) {
                            $scope.subscribersArray.push(value.id);
                        }
                    });
                } else if (type === "subscriber") {
                    $scope.subscribersArray.push(data.id);
                    $scope.subscriptions.forEach(function (value) {
                        if (value.id === data.id) {
                            $scope.subscriptionsArray.push(value.id);
                        }
                    });
                } else if (type === "group") {
                    $scope.groupsChecked.push(data.id);
                } else if (type === "place") {
                    $scope.placesChecked.push(data.id);
                } else if (type === "group-chat") {
                    $scope.groupsChatArray.push(data.room_id);
                }
            } else {
                $scope.shareData.splice($scope.shareData.indexOf(data), 1);
                if (type === "subscription") {
                    $scope.subscriptionsArray.splice($scope.subscriptionsArray.indexOf(data.id), 1);
                    $scope.subscribers.forEach(function (value) {
                        if (value.id === data.id) {
                            $scope.subscribersArray.splice($scope.subscribersArray.indexOf(value.id), 1);
                        }
                    });
                } else if (type === "subscriber") {
                    $scope.subscribersArray.splice($scope.subscribersArray.indexOf(data.id), 1);
                    $scope.subscriptions.forEach(function (value) {
                        if (value.id === data.id) {
                            $scope.subscriptionsArray.splice($scope.subscriptionsArray.indexOf(value.id), 1);
                        }
                    });
                } else if (type === "group") {
                    $scope.groupsChecked.splice($scope.groupsChecked.indexOf(data.id), 1);
                } else if (type === "place") {
                    $scope.placesChecked.splice($scope.placesChecked.indexOf(data.id), 1);
                } else if (type === "group-chat") {
                    $scope.groupsChatArray.splice($scope.groupsChatArray.indexOf(data.room_id), 1);
                }
            }
        };

        $scope.currentIndex = 0;

        $scope.members = function () {
            return true;
        };

        $scope.isSelected = function (index) {
            return index === $scope.currentIndex;
        };

        $scope.changeMenu = function (value, index) {
            $scope.currentIndex = index;
            if (value === "members") {
                $scope.members = function () {
                    return true;
                }
                $scope.groupsChat = function () {
                    return false;
                }
                $scope.showGroups = function () {
                    return false;
                }
                $scope.showPlaces = function () {
                    return false;
                }
            } else if (value === "groups-chat") {
                socket.emit("get user rooms", $scope.loggedUserId);
                socket.on("get user rooms", function (response) {
                    $scope.groupsChatArr = response;
                });
                $scope.groupsChat = function () {
                    return true;
                }
                $scope.members = function () {
                    return false;
                }
                $scope.showGroups = function () {
                    return false;
                }
                $scope.showPlaces = function () {
                    return false;
                }
            } else if (value === "groups") {
                $scope.showGroups = function () {
                    return true;
                }
                $scope.groupsChat = function () {
                    return false;
                }
                $scope.members = function () {
                    return false;
                }
                $scope.showPlaces = function () {
                    return false;
                }
                groupsService.getGroupList().then(function (response) {
                        $scope.groups = response;
                    },
                    function (error) {
                        console.log(error);
                    });
            } else if (value === "places") {
                $scope.showPlaces = function () {
                    return true;
                }
                $scope.showGroups = function () {
                    return false;
                }
                $scope.groupsChat = function () {
                    return false;
                }
                $scope.members = function () {
                    return false;
                }
                placesService.getPlaces().then(function (response) {
                        $scope.places = response;
                    },
                    function (error) {
                        console.log(error);
                    });
            }
        };

        $scope.menuItems = [
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


        $rootScope.$on('publication:delete', function(event, data) {
            angular.forEach($scope.publications, function (item, index, arr) {
                if (item.id === data.pubId) {
                    arr.splice(index, 1);
                }
            });
        });

        $rootScope.$on('publication:update', function(event, data) {
            angular.forEach($scope.publications, function (item, index, arr) {
                if (item.id === data.publication.id) {
                    arr[index] = data.publication;
                }
            });
        });

        $scope.changeMainFileFeed = function (file, currPub) {
            if (file.pivot.video_id || file.pivot.image_id) {
                currPub.mainFile = file;
            }
        };

        $scope.changeMainFile = function (file, flag, pub, index) {
            $scope.indexCurrentImage = index;
            if (file.pivot.video_id) {
                $scope.mainImage = "";
                $scope.mainVideo = file.url;
            } else if (file.pivot.image_id) {
                if (flag) {
                    $scope.mainImageInPopup = file.url;
                } else {
                    $scope.mainVideo = "";
                    $scope.mainImage = file.url;
                }
            }
        };

        $scope.loadMorePubFiles = function (key, flag, pub) {
            if (flag === 'list') {
                if (key === false) {
                    pub.limit = pub.images.length + pub.videos.length;
                } else {
                    pub.limit = 6;
                }
                $scope.$broadcast('loadPubFiles');
            } else {
                if (key === false) {
                    $scope.limit = $scope.singlePublication.images.length + $scope.singlePublication.videos.length;
                } else {
                    $scope.limit = 6;
                }
                $scope.morePubFiles = true;
                $scope.$broadcast('loadPubFiles');
            }
        };

        $scope.deleteCommentFile = function (files, index) {
            files.splice(index, 1);
        };

        $scope.showFullComment = function (comment) {
            comment.commentLength = comment.text.length;
        };

        $scope.splitText = function (text) {
            var mes = text.split(' messagetext: ');
            return mes[1];
        };

        //$scope.createPublication = function () {
        //    ngDialog.open({
        //        template: '../app/Feed/views/create-publication.html',
        //        className: 'user-publication ngdialog-theme-default',
        //        scope: $scope,
        //        preCloseCallback: function () {
        //            $scope.pubNew = angular.copy(originalPub);
        //            $scope.emojiMessage.messagetext = '';
        //        }
        //    });
        //};

        $scope.createPublication = function () {
            ngDialog.open({
                template: '../app/common/views/publication-new.html',
                className: 'user-publication ngdialog-theme-default',
                scope: $scope,
                data: {
                    feed: $rootScope.user
                }
            });
        };
        $rootScope.$on('publication:add', function(event, data) {
            $scope.publications.push(data.publication);
        });

        $scope.deletePubFile = function (index) {
            $scope.pubNew.files.splice(index, 1);
            $scope.$broadcast('rebuild:me');
        };

        $scope.openPublicationPreviewBlock = function (files) {
            if (!$scope.showPubAdd) {
                $scope.showPubAdd = !$scope.showPubAdd;
            }
        };

        $scope.pubFiles = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
            var defer = $q.defer();
            var prom = [];
            newFiles.forEach(function (image) {
                prom.push(resizeImage(image));
            });
            $q.all(prom).then(function () {
                $scope.$broadcast('rebuild:me');
            });
        };

        $scope.showMoreImages = function (images, currImg) {
            if (currImg != null) {
                $scope.mainImageInPopup = currImg.url;
            } else {
                $scope.mainImageInPopup = images[0].url;
            }

            ngDialog.open({
                template: '../app/User/views/popup-comment-images.html',
                className: 'popup-comment-images ngdialog-theme-default',
                scope: $scope,
                data: {
                    images: images
                }
            });
        };

        $scope.closePopup = function () {
            ngDialog.closeAll();
        };

        $scope.returnToBack = function () {
            $state.go("feed");
        };

        $scope.showPublication = function (pub, index) {
            if (isMobile()) {

                $state.go('mobile-pub-view-test', {
                    id: pub.id,
                    prevState: {
                        name: 'feed',
                        params: null
                    }
                });

            } else {
                $scope.indexCurrentPublication = index;
                getSinglePublication(pub.id);
            }

        };

        $scope.goToSearch = function (searchParam) {
            if (searchParam.indexOf("#") === 0) {
                $scope.search = {
                    str: searchParam,
                    byUsers: true,
                    byPublications: true,
                    byPlaces: true,
                    byGroups: true
                };
                $state.go('search', {
                    'searchObj': angular.copy($scope.search),
                    'restoreSearchResult': false,
                    'setActiveTab': true
                });
            }
        };

        $scope.pubViewStyleChange = function (flag) {
            if (flag) {
                $scope.photosGrid = true;
                storageService.setStorageItem('feedPubView', 'greed');
            } else {
                $scope.photosGrid = false;
                storageService.setStorageItem('feedPubView', 'list');
            }
        };

        $scope.openModalPublication = function (pub, index) {
            if (isMobile()) {

                $state.go('mobile-pub-view-test', {
                    id: pub.id,
                    prevState: {
                        name: 'feed'
                    }
                });

            } else {
                console.info('PubID: ' + pub.id);
                ngDialog.open({
                    templateUrl: '../app/common/views/pub-item-modal.html',
                    name: 'modal-publication-group',
                    className: 'view-publication ngdialog-theme-default',
                    data: {
                        pub: pub,
                        pubList: $scope.publications,
                        pubIndex: index
                    }
                });
            }
        };

        function resizeImage(image) {
            Upload.imageDimensions(image).then(function (dimensions) {
                console.info('Feed publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
            });

            return Upload.resize(image, 700, 395).then(function (resizedFile) {
                Upload.imageDimensions(resizedFile).then(function (dimensions) {
                    console.info('Feed publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                });
                $scope.pubNew.files.push(resizedFile);
            });
        }

        function resizePubCoverImage(image) {
            Upload.imageDimensions(image).then(function (dimensions) {
                console.info('Feed publication cover: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
            });

            return Upload.resize(image, 395, 395, null, null, null, true).then(function (resizedFile) {
                Upload.imageDimensions(resizedFile).then(function (dimensions) {
                    console.info('Feed publication cover: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                });
                return resizedFile;
            });
        }

        function getSinglePublication(pubId, flag) {
            PublicationService.getSinglePublication(pubId).then(function (response) {
                    $scope.limit = 6;
                    $scope.singlePublication = response;
                    if (response.cover) {
                        $scope.mainImage = response.cover;
                    } else {
                        $scope.mainImage = response.images[0].url;
                    }
                    // if ($window.innerWidth <= 700) {
                    // 	$state.go('feed-mobile', {pubId: pubId});
                    // }else{
                    if (!flag && $state.current.name === 'feed') {
                        ngDialog.open({
                            template: '../app/Feed/views/view-publication.html',
                            className: 'view-publication ngdialog-theme-default',
                            scope: $scope,
                            preCloseCallback: function () {
                                $scope.indexCurrentImage = 0;
                            }
                        });
                    }
                    // }
                },
                function (error) {
                    console.log(error);
                });
        }

        function loadUserContacts() {
            PublicationService.getSubscribers($scope.loggedUserId).then(function (response) {
                    $scope.subscribers = response;
                },
                function (error) {
                    console.log(error);
                });
            PublicationService.getSubscription($scope.loggedUserId).then(function (response) {
                    $scope.subscriptions = response;
                },
                function (error) {
                    console.log(error);
                });
        }

        function isMobile() {
            var screenWidth = $window.innerWidth;
            return screenWidth < 768;
        }

        function dynamicSort(property) {
            var sortOrder = 1;
            if (property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }

        function getMainPubs(offset) {
            FeedService.getPublications(offset)
                .then(function (res) {
                    $scope.limit = 6;
                    if (!$scope.publications) {
                        $scope.publications = res;
                    } else {
                        if (res.length > 0) {
                            res.forEach(function (publication) {
                                $scope.publications.push(publication);
                            });
                        }
                    }
                }, function (err) {
                    console.log(err);
                });
        }

        function checkPublicationsView() {
            if (!storage.feedPubView) {
                storageService.setStorageItem('feedPubView', 'greed');
                $scope.photosGrid = true;
            } else {
                if (storage.feedPubView === 'greed') {
                    $scope.photosGrid = true;
                } else if (storage.feedPubView === 'list') {
                    $scope.photosGrid = false;
                }
            }
        }

        function setStorage() {
            storageService.setStorageItem('loggedUserAva', profile.avatar_path);
            storageService.setStorageItem('firstName', profile.first_name);
            storageService.setStorageItem('lastName', profile.last_name);
        }
    }

})
(angular);