(function (angular) {

    'use strict';

    angular
        .module('app.components')
        .component('pubListItem', {
            bindings: {
                pubData: '<',
                isGroup: '=',
                isPlace: '=',
                authorName: '<',
                avatar: '<',
                index: '<',
                pubIndex: '<',
                prevState: '<',

                // для callback из контекста вывода компонента
                toClick: '<',

                // для карусели публикаций
                pubList: '<',

                // различные обработчики клика в зависимоости от открытия публикации в модальном окне
                // или вывод как элемент списка
                isModal: '<',

                // "плитка" или список
                isGrid: '<',

                // "На модерации"
                showModerate: "<"
            },
            templateUrl: '../app/common/components/publication-list-item/publication-list-item.html',
            controller: function ($rootScope, $scope, $state, $location, $timeout, PublicationService, groupsService, placesService, storageService, ngDialog, amMoment,
                                  socket, md5, $filter, $q, Upload, $window) {
                var ctrl = this;
                var modal, modalEditPub, modalDeletePub;

                var pubEditDeletedPhotos = [];
                var pubEditDeletedVideos = [];

                var originalPubEdited = {};

                amMoment.changeLocale('ru');

                ctrl.pub = {};
                ctrl.showPubMenu = false;
                ctrl.mainImage = null;
                ctrl.mainVideo = null;
                ctrl.emojiMessage = {};
                ctrl.subForm = false;

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

                var alertPubCommentModal;

                // Lifecycle hooks
                ctrl.$onInit = function (args) {
                    ctrl.pub = ctrl.pubData;
                    ctrl.avatar = getAvatarPath();
                    ctrl.authorName = getAuthorName();
                    if (ctrl.pubList) {
                        ctrl.pubList = $filter('orderBy')(ctrl.pubList, '-created_at');
                    }


                    if (ctrl.isModal) {
                        ctrl.indexCurrentImage = getIndexCurrentImage();
                        $timeout(function () {
                            var element = $window.document.getElementById('pub' + ctrl.pub.id);
                            if (element)
                                element.focus();
                        });

                        if (ctrl.pub.videos.length > 0) {
                            ctrl.mainVideo = ctrl.pub.videos[0].url;
                        }

                    }
                    ctrl.mainImage = ctrl.pub.cover;

                    ctrl.pub.files = ctrl.pub.images.concat(ctrl.pub.videos);
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


                ctrl.changeMainFile = function (file, index) {
                    if (file.pivot.video_id) {
                        ctrl.mainImage = null;
                        ctrl.mainVideo = file.url;
                        if (ctrl.isModal) {
                            ctrl.indexCurrentImage = index;
                        }
                    } else if (file.pivot.image_id) {
                            ctrl.mainVideo = null;
                            ctrl.mainImage = file.url;
                            if (ctrl.isModal) {
                                ctrl.indexCurrentImage = index;
                            }
                    }
                };

                ctrl.keyPress = function (event) {
                    if (ctrl.isModal) {
                        if (event.keyCode === 39) {
                            showNextInfo();
                        } else if (event.keyCode === 37) {
                            ctrl.openPreviousInfo();
                        }
                    }
                };

                ctrl.addPublicationLike = function () {
                    ctrl.pub.user_like = !ctrl.pub.user_like;
                    ctrl.pub.like_count = ctrl.pub.user_like ? ++ctrl.pub.like_count : --ctrl.pub.like_count;
                    PublicationService.addPublicationLike(ctrl.pub.id).then(function (response) {
                            ctrl.pub.user_like = response.user_like;
                            ctrl.pub.like_count = response.like_count;
                        },
                        function (error) {
                            console.log(error);
                        });
                };

                ctrl.closeModal = function () {
                    ngDialog.closeAll();
                };


                // Comments
                ctrl.commentForm = {};
                ctrl.newComment = {
                    text: '',
                    files: []
                };
                ctrl.showAddComment = false;
                var originalNewComment = angular.copy(ctrl.newComment);

                ctrl.getAllCommentsPublication = function (flag, pub, showAllComments) {
                    PublicationService.getAllCommentsPublication(pub.id).then(function (response) {
                            if (showAllComments === true) {
                                if (flag === "feedPage") {
                                    pub.comments = response;
                                }
                            }
                            pub.comment_count = response.length;
                        },
                        function (error) {
                            console.log(error);
                        });
                };

                ctrl.showFullComment = function (comment) {
                    comment.commentLength = comment.text.length;
                };

                ctrl.addCommentLike = function (comment) {
                    PublicationService.addCommentLike(comment.id).then(function (response) {
                            comment.like_count = response.like_count;
                        },
                        function (error) {
                            console.log(error);
                        });
                };

                ctrl.deleteComment = function (flag, pub, comment, index) {
                    PublicationService.deleteCommentPublication(comment.id).then(function (response) {
                            if (response.status) {
                                pub.comments.splice(index, 1);
                                pub.comment_count--;
                            }
                        },
                        function (error) {
                            console.log(error);
                        });
                };

                ctrl.openCommentComplainBlock = function (commentId) {
                    alertPubCommentModal = ngDialog.open({
                        template: '../app/common/components/publication-list-item/alert-publication.html',
                        className: 'alert-publication ngdialog-theme-default',
                        scope: $scope,
                        data: {
                            id: commentId,
                            flag: 'comment'
                        },
                        preCloseCallback: function () {
                            ctrl.complainIsSend = false;
                            ctrl.alerts = {};
                        }
                    });
                };

                ctrl.addNewComment = function (flag, pub, pubText, files) {

                    if (ctrl.newComment.files.length === 0) {
                        ctrl.commentForm.$setSubmitted();
                        if (ctrl.commentForm.$invalid) {
                            return false;
                        }
                    }

                    var images = [];
                    var videos = [];
                    if (files != undefined) {
                        files.forEach(function (file) {
                            var type = file.type.split('/')[0];
                            if (type === 'image') {
                                images.push(file);
                            } else if (type === 'video') {
                                videos.push(file);
                            }
                        });
                    }

                    ctrl.newComment.text = ctrl.emojiMessage.messagetext;
                    ctrl.subForm = true;

                    PublicationService.addCommentPublication(pub.id, ctrl.newComment.text, images, videos).then(function (response) {
                            ctrl.showAddComment = false;
                            ctrl.disableAddComment = false;
                            if (response.data.status) {
                                $(".emoji-wysiwyg-editor").html("");
                                if (flag === "feedPage") {
                                    ctrl.newComment = angular.copy(originalNewComment);
                                    pub.comments.push(response.data.comment);
                                    pub.comment_count++;
                                }
                            }
                            ctrl.commentForm.$setPristine();
                            ctrl.subForm = false;
                        },
                        function (error) {
                            console.log(error);
                            ctrl.subForm = false;
                        });
                };

                ctrl.showAddCommentBlock = function () {
                    //var div = $(".emoji-wysiwyg-editor")[ctrl.index];
                    //setTimeout(function () {
                    //    div.focus();
                    //}, 0);
                    ctrl.showAddComment = !(ctrl.showAddComment === true);
                };

                ctrl.deletePubFile = function (files, index) {
                    files.splice(index, 1);
                    $scope.$broadcast('rebuild:me');
                };

                ctrl.attachFileToComment = function (files) {
                    if (ctrl.newComment.files.length > 4 || files.length > 4) {
                        $scope.$broadcast('rebuild:me');
                    }
                    ctrl.commentForm.text.$setValidity('required', true);
                };

                ctrl.showMoreImages = function (images, currImg) {
                    var mainImageInPopup;

                    if (currImg != null) {
                        mainImageInPopup = currImg.url;
                    } else {
                        mainImageInPopup = images[0].url;
                    }

                    ngDialog.open({
                        template: '../app/common/components/publication/popup-comment-images.html',
                        className: 'popup-comment-images ngdialog-theme-default',
                        controller: ['$scope', function ($scope) {
                            $scope.changeMainFile = function (file, flag, pub) {
                                $scope.mainImageInPopup = file.url;
                            };
                        }],
                        data: {
                            images: images,
                            mainImageInPopup: mainImageInPopup
                        }
                    });
                };

                ctrl.goPrevState = function () {
                    $state.go(ctrl.prevState.name, ctrl.prevState.params);
                };

                ctrl.clickEvent = function () {
                    if (ctrl.toClick && !ctrl.isModal) {
                        ctrl.toClick(ctrl.pub, ctrl.index);
                    } else {
                        showNextInfo();
                    }
                };

                ctrl.sharePub = function (pubId) {
                    ngDialog.open({
                        template: '../app/common/components/publication-list-item/share-publication.html',
                        className: 'share-publication ngdialog-theme-default',
                        scope: $scope,
                        data: {
                            pubId: pubId
                        }
                    });
                    loadUserContacts();
                };

                ctrl.sendSharePublication = function (pubId) {
                    if (ctrl.shareData.length > 0) {
                        var membersLength = [];
                        ctrl.shareData.forEach(function (value) {
                            if (value.type === "members") {
                                membersLength.push(value);
                                var members = [];
                                members[0] = $rootScope.user.userId;
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
                                                    userId: $rootScope.user.userId,
                                                    room_id: value.room_id,
                                                    message: $location.absUrl() + "/publication/" + pubId
                                                };
                                                socket.emit('send message', data);
                                            });
                                        }
                                    } else {
                                        var data = {
                                            userId: $rootScope.user.userId,
                                            room_id: response.room_id,
                                            message: $location.absUrl() + "/publication/" + pubId
                                        };
                                        socket.emit('send message', data, function () {
                                            var popupNotification = ngDialog.open({
                                                template: '../app/User/views/popup-notification.html',
                                                className: 'popup-delete-group ngdialog-theme-default',
                                                scope: ctrl
                                            });
                                            setTimeout(function () {
                                                ngDialog.closeAll();
                                            }, 2000);
                                        });
                                    }
                                });
                            } else {
                                var data = {
                                    userId: $rootScope.user.userId,
                                    room_id: value.room_id,
                                    message: $location.absUrl() + "/publication/" + pubId
                                };
                                socket.emit('send message', data, function () {
                                    ngDialog.open({
                                        template: '../app/User/views/popup-notification.html',
                                        className: 'popup-delete-group ngdialog-theme-default',
                                        scope: $scope
                                    });
                                    setTimeout(function () {
                                        ngDialog.closeAll();
                                    }, 2000);
                                });
                            }
                        });
                    }
                };
                ctrl.change = function (data, active) {
                    if (active) {
                        ctrl.shareData.push(data);
                    } else {
                        ctrl.shareData.splice(ctrl.shareData.indexOf(data), 1);
                    }
                };
                ctrl.currentIndex = 0;
                ctrl.members = function () {
                    return true;
                }
                ctrl.isSelected = function (index) {
                    return index === ctrl.currentIndex;
                }
                ctrl.changeMenu = function (value, index) {
                    ctrl.currentIndex = index;
                    if (value === "members") {
                        ctrl.members = function () {
                            return true;
                        }
                        ctrl.groupsChat = function () {
                            return false;
                        }
                        ctrl.showGroups = function () {
                            return false;
                        }
                        ctrl.showPlaces = function () {
                            return false;
                        }
                    } else if (value === "groups-chat") {
                        socket.emit("get user rooms", ctrl.loggedUserId);
                        socket.on("get user rooms", function (response) {
                            ctrl.groupsChatArr = response;
                        });
                        ctrl.groupsChat = function () {
                            return true;
                        }
                        ctrl.members = function () {
                            return false;
                        }
                        ctrl.showGroups = function () {
                            return false;
                        }
                        ctrl.showPlaces = function () {
                            return false;
                        }
                    } else if (value === "groups") {
                        ctrl.showGroups = function () {
                            return true;
                        }
                        ctrl.groupsChat = function () {
                            return false;
                        }
                        ctrl.members = function () {
                            return false;
                        }
                        ctrl.showPlaces = function () {
                            return false;
                        }
                        groupsService.getGroupList().then(function (response) {
                                ctrl.groups = response;
                            },
                            function (error) {
                                console.log(error);
                            });
                    } else if (value === "places") {
                        ctrl.showPlaces = function () {
                            return true;
                        }
                        ctrl.showGroups = function () {
                            return false;
                        }
                        ctrl.groupsChat = function () {
                            return false;
                        }
                        ctrl.members = function () {
                            return false;
                        }
                        placesService.getPlaces().then(function (response) {
                                ctrl.places = response;
                            },
                            function (error) {
                                console.log(error);
                            });
                    }
                }

                ctrl.getPubLink = function (pubId) {
                    var hashPubId = md5.createHash(pubId + "");
                    var linkToPublication = "http://" + $location.host() + "/p/" + pubId + "/" + hashPubId;
                    ngDialog.open({
                        template: '../app/common/components/publication-list-item/get-link-publication.html',
                        className: 'link-publication ngdialog-theme-default',
                        scope: $scope,
                        data: {
                            link: linkToPublication
                        }
                    });
                };

                ctrl.openPubComplainBlock = function (pubId) {
                    ngDialog.open({
                        template: '../app/common/components/publication-list-item/alert-publication.html',
                        className: 'alert-publication ngdialog-theme-default',
                        scope: $scope,
                        data: {
                            id: pubId,
                            flag: 'pub'
                        },
                        preCloseCallback: function () {
                            ctrl.complainIsSend = false;
                            ctrl.alerts = {};
                        }
                    });
                };

                ctrl.openModalEditPub = function (pubId) {
                    modalEditPub = ngDialog.open({
                        template: '../app/common/components/publication-list-item/edit-publication.html',
                        className: 'user-publication user-publication-edit ngdialog-theme-default ',
                        scope: $scope,
                        name: 'modal-edit-publication',
                        preCloseCallback: function () {
                            ctrl.pubEdited = angular.copy(originalPubEdited);
                        }
                    });
                };

                $scope.$on('ngDialog.opened', function (e, $dialog) {
                    if ($dialog.name === "modal-edit-publication") {
                        $(".ngdialog.user-publication-edit .emoji-wysiwyg-editor")[0].innerHTML = $filter('colonToSmiley')(ctrl.pub.text);
                    }
                });

                ctrl.alerts = {};
                ctrl.sendComplain = function (complainUnitId, flag, cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8) {
                    var complainCategory = [];
                    cat1 ? complainCategory.push(1) : '';
                    cat2 ? complainCategory.push(2) : '';
                    cat3 ? complainCategory.push(3) : '';
                    cat4 ? complainCategory.push(4) : '';
                    cat5 ? complainCategory.push(5) : '';
                    cat6 ? complainCategory.push(6) : '';
                    cat7 ? complainCategory.push(7) : '';
                    if (flag === 'comment') {
                        PublicationService.complaintCommentAuthor(complainUnitId, complainCategory)
                            .then(
                                function (res) {
                                    if (res.status) {
                                        ctrl.complainIsSend = true;
                                        $timeout(function () {
                                            alertPubCommentModal.close();
                                        }, 2000);

                                    } else {
                                        console.log('Error');
                                    }
                                },
                                function (err) {
                                    console.log(err);
                                });
                    } else if (flag === 'pub') {
                        PublicationService.complaintPubAuthor(complainUnitId, complainCategory)
                            .then(
                                function (res) {
                                    if (res.status) {
                                        ctrl.complainIsSend = true;
                                        $timeout(function () {
                                            ngDialog.closeAll();
                                        }, 2000);
                                    } else {
                                        console.log('Error');
                                    }
                                },
                                function (err) {
                                    console.log(err);
                                });
                    }
                };

                ctrl.goToSearch = function (searchParam) {
                    if (searchParam.indexOf("#") === 0) {
                        var search = {
                            str: searchParam,
                            byUsers: true,
                            byPublications: true,
                            byPlaces: true,
                            byGroups: true
                        };
                        $state.go('search', {
                            'searchObj': angular.copy(search),
                            'restoreSearchResult': false,
                            'setActiveTab': true
                        });
                    }
                };

                ctrl.splitText = function (text) {
                    var mes = text.split(' messagetext: ');
                    return mes[1];
                };

                ctrl.editedPubDeleteFile = function (index, fileId, pivot) {
                    ctrl.pubEdited.files.splice(index, 1);
                    if (pivot.image_id) {
                        pubEditDeletedPhotos.push(fileId);
                    } else if (pivot.video_id) {
                        pubEditDeletedVideos.push(fileId);
                    }
                    $scope.$broadcast('rebuild:me');
                };

                ctrl.setNewMainPubPhoto = function (index, isNewFile) {

                    angular.forEach(ctrl.pubEdited.newFiles, function (item) {
                        if (item.isCover) {
                            item.isCover = false;
                        }
                    });
                    angular.forEach(ctrl.pubEdited.files, function (item) {
                        item.pivot.is_cover = false;
                    });

                    if (isNewFile) {
                        ctrl.pubEdited.newFiles[index].isCover = true;
                        ctrl.pubEdited.cover = ctrl.pubEdited.newFiles[index];
                    } else {
                        ctrl.pubEdited.files[index].pivot.is_cover = true;
                        ctrl.pubEdited.coverId = ctrl.pubEdited.files[index].id;
                    }
                };

                ctrl.addFilesToEditPub = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
                    var defer = $q.defer();
                    var prom = [];
                    newFiles.forEach(function (image) {
                        prom.push(resizeImage2(image));
                    });
                    $q.all(prom).then(function (data) {
                        angular.forEach(data, function (item) {
                            ctrl.pubEdited.newFiles.push(item);
                        });
                        $scope.$broadcast('rebuild:me');
                    });
                };

                ctrl.saveEditedPub = function (pubId) {
                    var textToSave = ctrl.emojiMessage.messagetext;

                    ctrl.updatePubLoader = true;

                    var images = [];
                    var videos = [];
                    var isMain = 0;

                    if (ctrl.pubEdited.newFiles) {
                        ctrl.pubEdited.newFiles.forEach(function (file) {
                            var type = file.type.split('/')[0];
                            if (type === 'image') {
                                images.push(file);
                            } else if (type === 'video') {
                                videos.push(file);
                            }
                        });
                    }

                    ctrl.pubEdited.inProfile = true;

                    PublicationService.updatePublication(pubId, textToSave, 0, isMain, images, videos, pubEditDeletedVideos, pubEditDeletedPhotos, ctrl.pubEdited)
                        .then(
                            function (res) {
                                if (res.status) {
                                    modalEditPub.close();
                                } else {
                                    console.log('Error');
                                }
                                ctrl.updatePubLoader = false;
                                ctrl.updatePubLoader = false;
                            },
                            function (err) {
                                console.log(err);
                            });
                };

                ctrl.openModalDeletePub = function () {
                    modalDeletePub = ngDialog.open({
                        template: '../app/common/components/publication-list-item/delete-publication.html',
                        className: 'popup-delete-group ngdialog-theme-default ',
                        scope: $scope,
                        preCloseCallback: function () {

                        }
                    });
                };

                ctrl.confirmPubDelete = function () {
                    PublicationService.deletePublication(ctrl.pub.id).then(function (res) {
                            if (res.status) {
                                $rootScope.$broadcast('publication:delete', {
                                    pubId: ctrl.pub.id
                                });
                            }
                            ngDialog.closeAll();
                        },
                        function (err) {
                            console.log(err);
                        });
                };

                function getAvatarPath() {
                    if (!ctrl.pub.is_anonym) {
                        return ctrl.pub.user.avatar_path;
                    }
                }

                function getAuthorName() {
                    if (!ctrl.pub.is_anonym) {
                        return ctrl.pub.user.first_name + ' ' + ctrl.pub.user.last_name;
                    } else {
                        return 'Анонимная публикация';
                    }
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


                // Carousel
                ctrl.indexCurrentImage = 0;

                ctrl.openPreviousInfo = function () {
                    $timeout(function () {
                        var element = $window.document.getElementById('pub' + ctrl.pub.id);
                        if (element)
                            element.focus();
                    });
                    var imagesLength = ctrl.pub.files.length;
                    if (imagesLength >= 1) {
                        if (ctrl.pub.files[ctrl.indexCurrentImage - 1] !== undefined) {
                            ctrl.indexCurrentImage--;
                            if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.image_id) {
                                ctrl.mainImage = ctrl.pub.files[ctrl.indexCurrentImage].url;
                                ctrl.mainVideo = null;
                            } else if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id){
                                ctrl.mainVideo = ctrl.pub.files[ctrl.indexCurrentImage].url;
                                ctrl.mainImage = null;
                            }
                        } else {
                            var prevPub = ctrl.pubList[ctrl.pubIndex - 1];
                            if (prevPub) {
                                ctrl.pubIndex--;
                                ctrl.pub = prevPub;
                                imagesLength = ctrl.pub.files.length;
                                ctrl.indexCurrentImage = ctrl.pub.files.length - 1;
                                if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.image_id) {
                                    ctrl.mainImage = ctrl.pub.files[ctrl.indexCurrentImage].url;
                                    ctrl.mainVideo = null;
                                } else if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id){
                                    ctrl.mainVideo = ctrl.pub.files[ctrl.indexCurrentImage].url;
                                    ctrl.mainImage = null;
                                }
                                ctrl.indexCurrentImage = imagesLength - 1;
                            }
                        }
                    }
                };

                function showNextInfo() {
                    if (ctrl.pub.files.length >= 1) {
                        if (ctrl.pub.files[ctrl.indexCurrentImage + 1] !== undefined) {
                            ctrl.indexCurrentImage++;
                            if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.image_id) {
                                ctrl.mainImage = ctrl.pub.files[ctrl.indexCurrentImage].url;
                                ctrl.mainVideo = null;
                            } else if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id){
                                ctrl.mainVideo = ctrl.pub.files[ctrl.indexCurrentImage].url;
                                ctrl.mainImage = null;
                            }
                        } else {
                            var nextPub = ctrl.pubList[ctrl.pubIndex + 1];
                            if (nextPub) {
                                ctrl.pubIndex++;
                                ctrl.pub = nextPub;
                                if (ctrl.pub.files[0] !== undefined) {
                                    if (ctrl.pub.files[0].pivot.image_id) {
                                        ctrl.mainImage = ctrl.pub.files[0].url;
                                        ctrl.mainVideo = null;
                                    } else if (ctrl.pub.files[0].pivot.video_id) {
                                        ctrl.mainVideo = ctrl.pub.files[0].url;
                                        ctrl.mainImage = null;
                                    }
                                    ctrl.indexCurrentImage = 0;
                                }
                            }
                        }
                    }
                }

                function getIndexCurrentImage() {
                    var index;
                    ctrl.pub.files.forEach(function (file, i, files) {
                        if (file.pivot.is_cover) {
                            index = i;
                        }
                    });

                    return index;
                }
            }
        });
})(angular);