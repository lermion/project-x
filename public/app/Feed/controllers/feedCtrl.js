angular.module('placePeopleApp')
    .controller('feedCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'PublicationService',
        'AuthService', 'FeedService', '$window', '$http', 'storageService', 'ngDialog', 'amMoment', 'Upload', '$timeout', 'UserService',
        'socket', 'groupsService', 'placesService', '$location',
        function ($scope, $state, $stateParams, StaticService, PublicationService, AuthService,
                  FeedService, $window, $http, storageService, ngDialog, amMoment, Upload, $timeout,
                  UserService, socket, groupsService, placesService, $location) {
            $scope.$emit('userPoint', 'user');
            var storage = storageService.getStorage();
            $scope.loggedUser = storage.username;
            $scope.emojiMessage = {};
            $scope.shareData = [];
            $scope.loggedUserAva = storage.loggedUserAva;
            $http.get('/static_page/get/name').success(function (response) {
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
                },
                true
            );
            w.bind('resize', function () {
                $scope.$apply();
            });

            /*Page content*/

            var alertPubCommentModal;

            $scope.pubNew = {
                files: []
            };

            $scope.ngRepeatHasRendered = function () {
                window.emojiPicker = new EmojiPicker({
                    emojiable_selector: '[data-emojiable=true]',
                    assetsPath: 'lib/img/',
                    popupButtonClasses: 'fa fa-smile-o'
                });
                window.emojiPicker.discover();
                $(".emoji-button").text("");
            }
            amMoment.changeLocale('ru');
            $scope.loggedUserId = +storage.userId;
            $scope.commentModel = {pubText: ''};
            var emptyPost = {pubText: ''};

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

            var counter = 0;
            getMainPubs(counter);

            $scope.loadMorePubs = function () {
                if ($scope.publications && counter < $scope.publications.length) {
                    counter += 10;
                } else {
                    return;
                }
                getMainPubs(counter);
            };

            $scope.getPubLink = function (pubId) {
                $scope.linkToPublication = $location.absUrl() + "/publication/" + pubId;
                ngDialog.open({
                    template: '../app/User/views/get-link-publication.html',
                    className: 'link-publication ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.indexCurrentImage = 0;
			$scope.openPreviousInfo = function(images){
				if(images.length >= 1){
					$scope.indexCurrentImage--;
					if(images[$scope.indexCurrentImage] !== undefined){
						$scope.mainImage = images[$scope.indexCurrentImage].url;
					}else{
						if($scope.indexCurrentPublication !== 0){
							$scope.singlePublication = $scope.publications[$scope.indexCurrentPublication -= 1];
							if($scope.singlePublication.images[0] !== undefined){
								$scope.mainImage = $scope.singlePublication.images[0].url;
								$scope.indexCurrentImage = 0;
							}
						}else{
							$scope.indexCurrentImage = 0;
						}
					}
				}
			};

			$scope.openNextInfo = function(images){
				if(images.length >= 1){
					$scope.indexCurrentImage++;
					if(images[$scope.indexCurrentImage] !== undefined){
						$scope.mainImage = images[$scope.indexCurrentImage].url;
					}else{
						if($scope.indexCurrentPublication + 1 !== $scope.publications.length){
							$scope.singlePublication = $scope.publications[$scope.indexCurrentPublication += 1];
							if($scope.singlePublication.images[0] !== undefined){
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
                    data: {
                        pubId: pubId
                    }
                });
                loadUserContacts();
            };
            $scope.sendSharePublication = function (pubId) {
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
                                        var popupNotification = ngDialog.open({
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
                        } else {
                            var data = {
                                userId: $scope.loggedUserId,
                                room_id: value.room_id,
                                message: $location.absUrl() + "/publication/" + pubId
                            };
                            socket.emit('send message', data, function () {
                                var popupNotification = ngDialog.open({
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
            $scope.change = function (data, active) {
                if (active) {
                    $scope.shareData.push(data);
                } else {
                    $scope.shareData.splice($scope.shareData.indexOf(data), 1);
                }
            };
            $scope.currentIndex = 0;
            $scope.members = function () {
                return true;
            }
            $scope.isSelected = function (index) {
                return index === $scope.currentIndex;
            }
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

            UserService.getUserData($scope.loggedUser)
                .then(
                    function (res) {
                        $scope.userData = res;
                        if (res.login === storage.username) {
                            $scope.myProfile = true;
                            storageService.setStorageItem('loggedUserAva', res.avatar_path);
                            $scope.loggedUserAva = res.avatar_path;
                        }
                    },
                    function (err) {
                        console.log(err);
                    }
                );


            $scope.complainIsSend = false;

            $scope.$on('ngDialog.opened', function (e, $dialog) {
            	var mainImagePublication = $(".main-image-publication");
            	setTimeout(function(){
					mainImagePublication.focus();
				}, 0);
            	$scope.keyPress = function(event, images){
            		console.log("gewgew!!");
					if(event.keyCode === 39){
						$scope.openNextInfo(images);
					}else if(event.keyCode === 37){
						$scope.openPreviousInfo(images);
					}
				};
                window.emojiPicker = new EmojiPicker({
                    emojiable_selector: '[data-emojiable=true]',
                    assetsPath: 'lib/img/',
                    popupButtonClasses: 'fa fa-smile-o'
                });
                window.emojiPicker.discover();
                $(".emoji-button").text("");
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
            }

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

            $scope.addPublicationLike = function (pub) {
                PublicationService.addPublicationLike(pub.id).then(function (response) {
                        pub.user_like = response.user_like;
                        pub.like_count = response.like_count;
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            $scope.getAllCommentsPublication = function (flag, pub, showAllComments) {
                getAllCommentsPublication(flag, pub, showAllComments);
            };
            function getAllCommentsPublication(flag, pub, showAllComments) {
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
            $scope.addCommentLike = function (comment) {
                PublicationService.addCommentLike(comment.id).then(function (response) {
                        comment.like_count = response.like_count;
                    },
                    function (error) {
                        console.log(error);
                    });
            };
            $scope.deleteComment = function (flag, pub, comment, index) {
                PublicationService.deleteCommentPublication(comment.id).then(function (response) {
                        if (response.status) {
                            if (flag === "feedPage") {
                                pub.comments = pub.comments.reverse();
                                pub.comments.splice(index, 1);
                            } else {
								$scope.singlePublication.comments.splice(index, 1);
							}
                        }
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            $scope.deleteCommentFile = function (files, index) {
                files.splice(index, 1);
            };

            $scope.addNewComment = function (flag, pub, pubText, files) {
                $scope.disableAddComment = true;
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

                PublicationService.addCommentPublication(pub.id, pubText.messagetext, images, videos).then(function (response) {
                        $scope.showAddComment = false;
                        $scope.disableAddComment = false;
                        if (response.data.status) {
                            $(".emoji-wysiwyg-editor").html("");
                            if (flag === "feedPage") {
                                pub.files = [];
                                pub.commentModel = angular.copy(emptyPost);
                                pub.comments.push(response.data.comment);
                                pub.comment_count++;
                            }
                        }
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            $scope.splitText = function (text) {
                var mes = text.split(' messagetext: ');
                return mes[1];
            };

            $scope.createPublication = function () {
                ngDialog.open({
                    template: '../app/Feed/views/create-publication.html',
                    className: 'user-publication ngdialog-theme-default',
                    scope: $scope
                });
            };

            $scope.deletePubFile = function (files, index) {
                files.splice(index, 1);
            };

            $scope.openPublicationPreviewBlock = function (files) {
                if (!$scope.showPubAdd) {
                    $scope.showPubAdd = !$scope.showPubAdd;
                }
            };

            $scope.pubFiles = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
                newFiles.forEach(function(image) {
                    resizeImage(image);
                });

                if (files.length > 4) {
                    $scope.pubFilesNeedScroll = true;
                } else if (files.length > 100) {
                    console.log('too much files');
                    return;
                }
                $scope.$broadcast('rebuild:me');
            };

            function resizeImage(image) {
                Upload.imageDimensions(image).then(function (dimensions) {
                    console.info('Feed publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                });

                Upload.resize(image, 700, 395).then(function (resizedFile) {
                    Upload.imageDimensions(resizedFile).then(function (dimensions) {
                        console.info('Feed publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
                    });
                    $scope.pubNew.files.push(resizedFile);
                });
            }

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
            }

            $scope.showAddCommentBlock = function (pub, index) {
                var div = $(".emoji-wysiwyg-editor")[index];
                setTimeout(function () {
                    div.focus();
                }, 0);
                if (pub.showAddComment) {
                    pub.showAddComment = false;
                } else {
                    pub.showAddComment = true;
                }
            }

            $scope.closePopup = function () {
                ngDialog.closeAll();
            };

            $scope.returnToBack = function () {
                $state.go("feed");
            };

            // if($state.current.name === "feed-mobile"){
            // 	var pubId = $stateParams.pubId;
            // 	if ($window.innerWidth > 700) {
            // 			$state.go('feed-desktop', {pubId: pubId});
            // 	}
            // }
            // if($state.current.name === "feed-desktop"){
            // 	var pubId = $stateParams.pubId;
            // 	if ($window.innerWidth < 700) {
            // 			console.log(pubId);
            // 			$state.go('feed-mobile', {pubId: pubId});

            // 	} else {
            // 		getSinglePublication(pubId);
            // 		ngDialog.open({
            // 					template: '../app/Feed/views/view-publication.html',
            // 					className: 'view-publication ngdialog-theme-default',
            // 					scope: $scope
            // 				});
            // 	}

            // }

            $scope.publishNewPub = function (isAnon, pubText) {
                var textToSave = $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + pubText.messagetext;

                if ($scope.pubNew.files === undefined || $scope.pubNew.files.length == 0) {
                    $scope.publishNewPubErr = true;
                    return;
                }

                $scope.newPubLoader = true;
                var images = [];
                var videos = [];
                var isMain = 1;

                // if ($scope.mainPubPhoto) {
                // 	images[0] = '';
                // }

                $scope.pubNew.files.forEach(function (file) {
                    var type = file.type.split('/')[0];
                    if (type === 'image') {
                        images.push(file);
                    } else if (type === 'video') {
                        videos.push(file);
                    }
                });


                // if ($scope.mainPubPhoto) {
                // 	for(var i=0; i < images.length; i++){
                // 		if (images[i].name === $scope.mainPubPhoto) {
                // 			var mainPhoto = images.splice(i, 1);
                // 			images[0] = mainPhoto[0];

                // 		}
                // 	}
                // }


                PublicationService.createPublication(textToSave, !!isAnon ? 1 : 0, isMain, videos, images)
                    .then(
                        function (res) {
                            if (res.status) {
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

            function getSinglePublication(pubId, flag) {
                PublicationService.getSinglePublication(pubId).then(function (response) {
                        $scope.limit = 6;
                        $scope.singlePublication = response;
                        if (response.images[0] !== undefined) {
                            $scope.mainImage = response.images[0].url;
                        }
                        // if ($window.innerWidth <= 700) {
                        // 	$state.go('feed-mobile', {pubId: pubId});
                        // }else{
                        if (!flag && $state.current.name === 'feed') {
                            ngDialog.open({
                                template: '../app/Feed/views/view-publication.html',
                                className: 'view-publication ngdialog-theme-default',
                                scope: $scope
                            });
                        }
                        // }
                    },
                    function (error) {
                        console.log(error);
                    });
            }

            $scope.showPublication = function (pub, index) {
            	$scope.indexCurrentPublication = index;
                getSinglePublication(pub.id);
            };

            $scope.getAllCommentsPublication = function (flag, pub, showAllComments) {
                getAllCommentsPublication(flag, pub, showAllComments);
            }
            function getAllCommentsPublication(flag, pub, showAllComments) {
                PublicationService.getAllCommentsPublication(pub.id).then(function (response) {
                        if (showAllComments === true) {
                            if (flag === "feedPage") {
                                pub.comments = response;
                            } else {
                                $scope.singlePublication.comments = response;
                            }
                        }
                        $scope.lengthAllComments = response.length;
                    },
                    function (error) {
                        console.log(error);
                    });
            }

            $scope.openCommentComplainBlock = function (commentId) {
                ngDialog.open({
                    template: '../app/Feed/views/alert-publication.html',
                    className: 'alert-publication ngdialog-theme-default',
                    scope: $scope,
                    data: {
                        id: commentId,
                        flag: 'comment'
                    },
                    preCloseCallback: function () {
                        $scope.complainIsSend = false;
                    }
                });
            };

            $scope.openPubComplainBlock = function (pubId) {
                alertPubCommentModal = ngDialog.open({
                    template: '../app/Feed/views/alert-publication.html',
                    className: 'alert-publication ngdialog-theme-default',
                    scope: $scope,
                    data: {
                        id: pubId,
                        flag: 'pub'
                    },
                    preCloseCallback: function () {
                        $scope.complainIsSend = false;
                        $scope.alerts = {};
                    }
                });
            };

            $scope.alerts = {};
            $scope.sendComplain = function (complainUnitId, flag, cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8) {
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
                                    $scope.complainIsSend = true;
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
                    // PublicationService.complaintPubAuthor(complainUnitId, complainCategory)
                    // 	.then(
                    // 		function(res){
                    // 			if (res.status) {
                    $scope.complainIsSend = true;
                    $timeout(function () {
                        ngDialog.closeAll();
                    }, 2000);
                    // 			} else {
                    // 				console.log('Error');
                    // 			}
                    // 		},
                    // 		function(err){
                    // 			console.log(err);
                    // 		});
                }
            };


            $scope.pubViewStyleChange = function (flag) {
                if (flag) {
                    $scope.photosGrid = true;
                    storageService.setStorageItem('pubView', 'greed');
                } else {
                    $scope.photosGrid = false;
                    storageService.setStorageItem('pubView', 'list');
                }
            }
        }]);