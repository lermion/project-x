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
                prevState: '<'
            },
            templateUrl: '../app/common/components/publication-list-item/publication-list-item.html',
            controller: function ($scope, $state, PublicationService, storageService, ngDialog, amMoment) {
                var ctrl = this;
                var modal;

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

                // Lifecycle hooks
                ctrl.$onInit = function (args) {
                    ctrl.pub = ctrl.pubData;
                    ctrl.avatar = getAvatarPath();
                    ctrl.authorName = getAuthorName();
                };

                ctrl.$onChanges = function (args) {
                    console.log('OnChanges');
                };

                ctrl.$onDestroy = function (args) {
                    console.log('OnDestroy');
                };

                ctrl.$postLink = function (args) {
                    console.log('OnLink');
                };


                ctrl.changeMainFile = function (file, flag, pub) {
                    if (file.pivot.video_id) {
                        ctrl.mainImage = "";
                        ctrl.mainVideo = file.url;
                    } else if (file.pivot.image_id) {
                        if (flag) {
                            ctrl.mainImageInPopup = file.url;
                        } else {
                            ctrl.mainVideo = "";
                            ctrl.mainImage = file.url;
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

                ctrl.showFullComment = function(comment){
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
                    ngDialog.open({
                        template: '../app/Places/views/alert-publication.html',
                        className: 'alert-publication ngdialog-theme-default',
                        scope: $scope,
                        data: {
                            id: commentId,
                            flag: 'comment'
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
                    var div = $(".emoji-wysiwyg-editor")[ctrl.index];
                    setTimeout(function () {
                        div.focus();
                    }, 0);
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

                ctrl.goPrevState = function() {
                  $state.go(ctrl.prevState.name, ctrl.prevState.params);
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

            }
        });
})(angular);