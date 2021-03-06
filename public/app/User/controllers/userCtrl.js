angular.module('placePeopleApp')
	.controller('userCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'StaticService', 'AuthService',
		'UserService', '$window', '$http', 'storageService', 'ngDialog', 'PublicationService', 'amMoment',
		'$q', '$timeout', 'Upload', 'socket', 'groupsService', 'placesService', '$location', 'md5', 'profile', 'publications',
		function ($scope, $rootScope, $state, $stateParams, StaticService, AuthService,
				  UserService, $window, $http, storageService, ngDialog, PublicationService, amMoment,
				  $q, $timeout, Upload, socket, groupsService, placesService, $location, md5, profile, publications) {

			amMoment.changeLocale('ru');

			$scope.$emit('userPoint', 'user');

			var storage = storageService.getStorage();
			var deletePublication = null;
			var sharePublication = null;
			var alertPubCommentModal;

			var w = angular.element($window);

			var editPubPopup;
			var counter = 0;
			var pubEditDeletedPhotos = [];
			var pubEditDeletedVideos = [];

			$scope.pubNew = {
				files: [],
				cover: null,
				cover_id: null,
				inProfile: true
			};
			var originalPubNew = angular.copy($scope.pubNew);

			$scope.loggedUserAvatar = storage.loggedUserAva;
			$scope.groupsChecked = [];
			$scope.placesChecked = [];
			$scope.groupsChatArray = [];
			$scope.subscribersArray = [];
			$scope.subscriptionsArray = [];

			$scope.loggedUserId = +storage.userId;
			$scope.indexCurrentImage = 0;
			$scope.emojiMessage = {
				messagetext: ''
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
			$scope.currentIndex = 0;
			$scope.alerts = {};


			$scope.shareData = [];
			$scope.complainIsSend = false;
			$scope.images = {};
			$scope.commentModel = {pubText: ''};

			$scope.userData = profile;
			$scope.userPublications = publications || [];
			$scope.needToLogin = $stateParams.needToLogin;


			activate();

			////////////////////////////////


			function activate() {
				checkPublicationsViewMode();
				setIsMyProfile();
			}

			$scope.closeSharePopup = function () {
				sharePublication.close();
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

			$scope.showFullComment = function (comment) {
				comment.commentLength = comment.text.length;
			};

			$scope.openMenu = function () {
				if ($window.innerWidth <= 800) {
					$scope.showMenu = !$scope.showMenu;
				} else {
					$scope.showMenu = true;
				}
			};

			$scope.showFullAvatar = function (originalAvatar) {
				$scope.mainImageInPopup = originalAvatar;
				angular.element(document.querySelector('.view-publication')).addClass('posFixedPopup');
				ngDialog.open({
					template: '../app/User/views/popup-comment-images.html',
					className: 'popup-comment-images ngdialog-theme-default',
					scope: $scope,
					preCloseCallback: function (value) {
						angular.element(document.querySelector('.view-publication')).removeClass('posFixedPopup');
					}
				});
			};

			$scope.openBottomMenu = function () {
				if ($window.innerWidth <= 650) {
					$scope.showBottomMenu = !$scope.showBottomMenu;
				} else {
					$scope.showBottomMenu = false;
				}
			};

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
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 2) / 3;
						$scope.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
						$scope.resizeHeight = 'height:' + parseInt(w[0].innerWidth) + 'px;';
					} else {
						$scope.resizeSizes = '';
						$scope.resizeHeight = '';
						$scope.mobileWidthMenu = true;
					}
				},
				true
			);
			w.bind('resize', function () {
				$scope.$apply();
			});

			$scope.$on('ngDialog.opened', function (e, $dialog) {
				if ($dialog.name === "view-publication") {
					var mainImagePublication = $(".main-image-publication");
					setTimeout(function () {
						mainImagePublication.focus();
					}, 0);
					$scope.keyPress = function (event, images) {
						if (event.keyCode === 39) {
							$scope.openNextInfo(images);
						} else if (event.keyCode === 37) {
							$scope.openPreviousInfo(images);
						}
					};
					window.emojiPicker = new EmojiPicker({
						emojiable_selector: '.view-publication-pub-text',
						assetsPath: 'lib/img/',
						popupButtonClasses: 'fa fa-smile-o'
					});
					window.emojiPicker.discover();
					$(".emoji-button").text("");
				} else if ($dialog.name === "edit-publication") {
					//window.emojiPicker = new EmojiPicker({
					//    emojiable_selector: '.edit-publication-pub-text',
					//    assetsPath: 'lib/img/',
					//    popupButtonClasses: 'fa fa-smile-o'
					//});
					//window.emojiPicker.discover();
					//$(".emoji-button").text("");
					//$(".ngdialog .emoji-wysiwyg-editor")[1].innerHTML = $scope.currPub.text.split(' messagetext: ')[0];
				} else if ($dialog.name === "create-publication") {
					//window.emojiPicker = new EmojiPicker({
					//    emojiable_selector: '.create-publication-pub-text',
					//    assetsPath: 'lib/img/',
					//    popupButtonClasses: 'fa fa-smile-o'
					//});
					//window.emojiPicker.discover();
					//$(".emoji-button").text("");
				}
			});

			$scope.loadMorePubs = function () {
				if ($scope.userPublications && counter < $scope.userPublications.length) {
					counter += 12;
				} else {
					return;
				}
				getUserPubs($scope.userData.id, counter);
			};

			//Sign on
			$scope.sign = function (subscription) {
				if (subscription) {
					$scope.userData.id = subscription.id;
				}
				UserService.sign(parseInt($scope.userData.id))
					.then(function (res) {
						if (res.status) {
							if (subscription !== undefined) {
								subscription.is_sub = res.is_sub;
							} else {
								$scope.isSigned = res.is_sub;
								if (res.is_sub) {
									$scope.needToSign = false;
									$scope.userData.subscribers_count++;
									if (!!$scope.userData.is_private && res.is_sub) {
										getUserPubs($scope.userData.id, counter);
									}
								} else {
									if ($scope.userData.is_private) {
										$scope.needToSign = true;
									}
									$scope.userData.subscribers_count--;
								}
							}
						} else {
							if (parseInt(res.error.code) === 1) {
								// 1 userId
							} else if (parseInt(res.error.code) === 8) {
								// 8 permission
							}
						}
					}, function (err) {
						console.log(err);
					});
			};

			// Unsubscribe for my user profile
			$scope.unsubscribe = function (user) {
				UserService.sign(user.id)
					.then(function (data) {
						if (data.status) {
							removeUserFromList($scope.subscriptions, user.id);
							$scope.userData.subscription_count--;
							if ($scope.subscriptions.length === 0) {
								ngDialog.closeAll();
							}
						}
					});
			};

			// Subscribe/Unsubscribe for another user profile
			$scope.subscribe = function (user) {
				UserService.sign(user.id)
					.then(function (data) {
						if (data.status) {
							user.is_sub = data.is_sub;
							if ($scope.myProfile) {
								data.is_sub ? $scope.userData.subscription_count++ : $scope.userData.subscription_count--;
							}
						}
					});
			};

			$scope.editProfile = function (name, lastname, status) {
				if (($window.innerWidth <= 520) && !$scope.showStatusArea) {
					$scope.showStatusArea = true;
				}
				if (!$scope.profileEdition) {
					$scope.profileEdition = true;
				} else {
					if (!name) {
						return;
					} else if (status && status.length > 140) {
						$scope.statusErr = true;
						return;
					} else {
						UserService.quickEdit(name, lastname, status)
							.then(
								function (res) {
									$scope.profileEdition = false;
									$scope.showStatusArea = false;
								},
								function (err) {
									console.log(err);
								});
					}
				}
			};

			if ($state.current.name === "subscribers") {
				$scope.returnToBack = function () {
					$state.go("user", {username: $stateParams.username});
				}
				openSubscribers($stateParams.id);
			}
			if ($state.current.name === "subscribes") {
				$scope.returnToBack = function () {
					$state.go("user", {username: $stateParams.username});
				}
				openSubscribe($stateParams.id);
			}
			if ($state.current.name === "mobile-pub-view") {
				var pubId = $stateParams.id;
				if ($window.innerWidth > 700) {
					$state.go('desktop-pub-view', {username: $stateParams.username, id: pubId});
				}
			}
			if ($state.current.name === "desktop-pub-view") {
				var pubId = $stateParams.id;
				if ($window.innerWidth <= 700) {
					$state.go('mobile-pub-view', {username: $stateParams.username, id: pubId});
				}
				getSinglePublication($stateParams.id);
				ngDialog.open({
					template: '../app/User/views/view-publication.html',
					className: 'view-publication ngdialog-theme-default',
					scope: $scope,
					preCloseCallback: function (value) {
						$state.go("user", {username: $stateParams.username});
					}
				});
			}


			$scope.openSubscribers = function (userId) {
				openSubscribers(userId);
			};

			$scope.openSubscribe = function (userId) {
				openSubscribe(userId);
			};

			//$scope.createPublication = function () {
			//    ngDialog.open({
			//        template: '../app/User/views/create-publication.html',
			//        className: 'user-publication ngdialog-theme-default',
			//        scope: $scope,
			//        name: "create-publication",
			//        preCloseCallback: function () {
			//            $scope.pubNew = angular.copy(originalPubNew);
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
						profile: $rootScope.user
					}
				});
			};
			$rootScope.$on('publication:add', function(event, data) {
				$scope.userPublications.unshift(data.publication);
				$scope.userData.publications_count++;
			});

			$rootScope.$on('publication:update', function(event, data) {
				angular.forEach($scope.userPublications, function (item, index, arr) {
					if (item.id === data.publication.id) {
						arr[index] = data.publication;
					}
				});
			});

			$rootScope.$on('publication:delete', function(event, data) {
				angular.forEach($scope.userPublications, function (item, index, arr) {
					if (item.id === data.pubId) {
						arr.splice(index, 1);
						$scope.userData.publications_count--;
						if ($state.current.name === "mobile-pub-view") {
							$state.go("user", {username: $stateParams.username});
						}
					}
				});
			});

			$scope.closePopup = function () {
				ngDialog.closeAll();
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

			$scope.addFilesToEditPub = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
				var defer = $q.defer();
				var prom = [];
				newFiles.forEach(function (image) {
					prom.push(resizeImage2(image));
				});
				$q.all(prom).then(function (data) {
					angular.forEach(data, function (item) {
						$scope.currPub.files.push(item);
					});
					$scope.$broadcast('rebuild:me');
				});
			};

			$scope.fileTypeCheck = function (filetype) {
				var type = filetype.split('/')[0];
				if (type === 'image') {
					return true;
				} else if (type === 'video') {
					return false;
				}
			};

			$scope.openPreviousInfo = function (images) {
				if (images.length >= 1) {
					$scope.indexCurrentImage--;
					if (images[$scope.indexCurrentImage] !== undefined) {
						$scope.mainImage = images[$scope.indexCurrentImage].url;
					} else {
						if ($scope.indexCurrentPublication !== 0) {
							$scope.singlePublication = $scope.userPublications[$scope.indexCurrentPublication -= 1];
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
						if ($scope.indexCurrentPublication + 1 !== $scope.userPublications.length) {
							$scope.singlePublication = $scope.userPublications[$scope.indexCurrentPublication += 1];
							if ($scope.singlePublication.images[0] !== undefined) {
								$scope.mainImage = $scope.singlePublication.images[0].url;
								$scope.indexCurrentImage = 0;
							}
						}
					}
				}
			};

			$scope.setMainPubPhoto = function (index) {
				angular.forEach($scope.pubNew.files, function (item) {
					item.isCover = false;
				});

				// TODO: refact!
				$scope.pubNew.files[index].isCover = true;
				$scope.pubNew.files[index].is_cover = true;

				$scope.pubNew.cover = $scope.pubNew.files[index];
			};

			$scope.setNewMainPubPhoto = function (index, isNewFile) {

				angular.forEach($scope.currPub.files, function (item) {
					if (item.isCover) {
						item.isCover = false;
					}
				});
				angular.forEach($scope.editedPubFilesArray, function (item) {
					item.pivot.is_cover = false;
				});

				if (isNewFile) {
					$scope.currPub.files[index].isCover = true;
					$scope.currPub.cover = $scope.currPub.files[index];
				} else {
					$scope.editedPubFilesArray[index].pivot.is_cover = true;
					$scope.currPub.coverId = $scope.editedPubFilesArray[index].id;
				}
			};

			$scope.deletePubFile = function (index) {
				$scope.pubNew.files.splice(index, 1);
				$scope.$broadcast('rebuild:me');
			};

			$scope.publishNewPub = function (pubText) {
				var textToSave = pubText.messagetext;
				if ($scope.pubNew.files === undefined || $scope.pubNew.files.length == 0) {
					$scope.publishNewPubErr = true;
					return;
				}
				$scope.newPubLoader = true;
				var images = [];
				var videos = [];
				var isMain;

				if ($scope.mainPubPhoto) {
					images[0] = '';
				}
				if ($state.current.name === 'feed') {
					isMain = 1;
				} else {
					isMain = 0;
				}

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
				if ($scope.mainPubPhoto) {
					for (var i = 0; i < images.length; i++) {
						if (images[i].name === $scope.mainPubPhoto) {
							var mainPhoto = images.splice(i, 1);
							images[0] = mainPhoto[0];

						}
					}
				}
				PublicationService.createPublication(textToSave, 0, isMain, videos, images, $scope.pubNew).then(function (res) {
						if (res.status) {
							$scope.userPublications.unshift(res.publication);
							$scope.userData.publications_count++;
							ngDialog.closeAll();
						} else {
							console.log('Error');
						}
						$scope.newPubLoader = false;
					},
					function (err) {
						console.log(err);
					});
			};

			$scope.splitText = function (text) {
				if (text != undefined) {
					var mes = text.split(' messagetext: ');
					return mes[1];
				}
			};

			if ($state.current.name === "mobile-pub-view" && $stateParams.id) {
				if ($stateParams.fromChat) {
					$scope.returnToBack = function () {
						$state.go("chat", {fromMobile: true});
					}
				} else {
					$scope.returnToBack = function () {
						$state.go("user", {username: $stateParams.username});
					}
				}
				getSinglePublication($stateParams.id);
			}

			if (!$stateParams.pubView) {
				$stateParams.pubView = 'greed';
			}

			$scope.pubViewStyleChange = function (flag) {
				if (flag) {
					$scope.photosGrid = true;
					storageService.setStorageItem('pubView', 'greed');
				} else {
					$scope.photosGrid = false;
					storageService.setStorageItem('pubView', 'list');
				}
			};

			$scope.showPublication = function (pub, index) {
				$scope.indexCurrentPublication = index;
				getSinglePublication(pub.id, false, index);
			};

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
							pub.files = [];
							if (flag === "userPage") {
								pub.comments.push(response.data.comment);
								pub.comment_count++;
							} else {
								$scope.singlePublication.comments.push(response.data.comment);
								$scope.singlePublication.comment_count++;
							}

						}
					},
					function (error) {
						console.log(error);
					});
			};

			$scope.showMoreImages = function (files) {
				$scope.imagesInPopup = files;
				$scope.mainImageInPopup = files[0].url;
				angular.element(document.querySelector('.view-publication')).addClass('posFixedPopup');
				ngDialog.open({
					template: '../app/User/views/popup-comment-images.html',
					className: 'popup-comment-images ngdialog-theme-default',
					scope: $scope,
					data: {
						images: files
					},
					preCloseCallback: function (value) {
						angular.element(document.querySelector('.view-publication')).removeClass('posFixedPopup');
					}
				});
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

				if (flag === 'list') {
					pub.mainFile = file;
				}
			};

			$scope.addCommentLike = function (comment) {
				PublicationService.addCommentLike(comment.id).then(function (response) {
						comment.like_count = response.like_count;
					},
					function (error) {
						console.log(error);
					});
			};

			$scope.addPublicationLike = function (pub, isCurrentUser) {
				pub.user_like = !pub.user_like;
				pub.like_count = pub.user_like ? ++pub.like_count : --pub.like_count;
				PublicationService.addPublicationLike(pub.id).then(function (response) {
						pub.user_like = response.user_like;
						pub.like_count = response.like_count;
					},
					function (error) {
						console.log(error);
					});
			};

			$scope.deleteComment = function (flag, pub, comment, index) {
				PublicationService.deleteCommentPublication(comment.id).then(function (response) {
						if (response.status) {
							if (flag === "userPage") {
								pub.comments.splice(index, 1);
								pub.comment_count--;
							} else {
								$scope.singlePublication.comments.splice(index, 1);
								$scope.singlePublication.comment_count--;
							}
						}
					},
					function (error) {
						console.log(error);
					});
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

			$scope.getAllCommentsPublication = function (flag, pub, showAllComments) {
				getAllCommentsPublication(flag, pub, showAllComments);
			};

			$scope.loadMorePubFiles = function (key, flag, pub) {

				if (flag === 'list') {
					if (key === false) {
						pub.limit = pub.images.length + pub.videos.length;
					} else {
						pub.limit = 7;
					}
					// pub.morePubFiles = true;
					$scope.$broadcast('loadPubFiles');
				} else {
					if (key === false) {
						$scope.limit = $scope.singlePublication.images.length + $scope.singlePublication.videos.length;
					} else {
						$scope.limit = 7;
					}
					$scope.morePubFiles = true;
					$scope.$broadcast('loadPubFiles');
				}
			};

			$scope.editPub = function (pub) {
				$scope.currPub = pub;
				$scope.currPub.files = [];
				editPubPopup = ngDialog.open({
					template: '../app/User/views/edit-publication.html',
					className: 'user-publication user-publication-edit ngdialog-theme-default',
					scope: $scope,
					name: "edit-publication"
				});
			};

			$scope.editedPubFiles = function (pub) {
				var files = [];
				pub.images.forEach(function (img) {
					var filename = img.url.split('/')[(img.url.split('/')).length - 1];
					img.name = filename.substring(8, filename.length);
					files.push(img);
				});
				pub.videos.forEach(function (video) {
					files.push(video);
				});
				$scope.editedPubFilesArray = files;
			};

			$scope.addedEditedPubFiles = function (files, event, flow) {
				if (files.length > 100) {
					console.log('too much files');
				}
				$scope.$broadcast('rebuild:me');
			};

			$scope.editedPubDeleteFile = function (index, fileId, pivot) {
				$scope.editedPubFilesArray.splice(index, 1);
				if (pivot.image_id) {
					pubEditDeletedPhotos.push(fileId);
				} else if (pivot.video_id) {
					pubEditDeletedVideos.push(fileId);
				}
				$scope.$broadcast('rebuild:me');
			};

			$scope.rebuildScroll = function () {
				$scope.$broadcast('loadPubFiles');
			};

			$scope.saveEditedPub = function (pubId, pubText, files) {
				var textToSave = $(".ngdialog.user-publication-edit .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + pubText.messagetext;

				$scope.updatePubLoader = true;

				var images = [];
				var videos = [];
				var isMain = 0;

				if ($scope.currPub.files) {
					$scope.currPub.files.forEach(function (file) {
						var type = file.type.split('/')[0];
						if (type === 'image') {
							images.push(file);
						} else if (type === 'video') {
							videos.push(file);
						}
					});
				}

				$scope.currPub.inProfile = true;

				PublicationService.updatePublication(pubId, textToSave, 0, isMain, images, videos, pubEditDeletedVideos, pubEditDeletedPhotos, $scope.currPub)
					.then(
						function (res) {
							if (res.status) {
								getUserPubs(storage.userId);
								getSinglePublication(res.publication.id, true);
								editPubPopup.close();
							} else {
								console.log('Error');
							}
							$scope.updatePubLoader = false;
						},
						function (err) {
							console.log(err);
						});
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
				}
			};

			$scope.getPubLink = function (pubId) {
				var hashPubId = md5.createHash(pubId + "");
				$scope.linkToPublication = "http://" + $location.host() + "/p/" + pubId + "/" + hashPubId;
				ngDialog.open({
					template: '../app/User/views/get-link-publication.html',
					className: 'link-publication ngdialog-theme-default',
					scope: $scope
				});
			};

			$scope.alertPub = function (pubId) {
				ngDialog.open({
					template: '../app/User/views/alert-publication.html',
					className: 'alert-publication ngdialog-theme-default',
					scope: $scope,
					data: {
						id: pubId,
						flag: 'pub'
					},
					preCloseCallback: function () {
						$scope.complainIsSend = false;
					}
				});
			};

			$scope.alertPubComment = function (commentId) {
				alertPubCommentModal = ngDialog.open({
					template: '../app/User/views/alert-publication.html',
					className: 'alert-publication ngdialog-theme-default',
					scope: $scope,
					data: {
						id: commentId,
						flag: 'comment'
					},
					preCloseCallback: function () {
						$scope.complainIsSend = false;
						$scope.alerts = {};
					}
				});
			};

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
					PublicationService.complaintCommentAuthor(complainUnitId, complainCategory).then(function (res) {
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
					PublicationService.complaintPubAuthor(complainUnitId, complainCategory)
						.then(
							function (res) {
								if (res.status) {
									$scope.complainIsSend = true;
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




			$scope.confirmSubscriber = function (subscriber) {
				UserService.confirmSubscriber(subscriber.id)
					.then(function (status) {
						subscriber.is_confirmed = status;
					});
			};

			$scope.openModalPublication = function (pub, index) {
				if (isMobile()) {

					$state.go('mobile-pub-view-test', {
						id: pub.id,
						prevState: {
							name: 'user',
							params: {
								username: $stateParams.username
							}
						}
					});

				} else {
					ngDialog.open({
						templateUrl: '../app/common/views/pub-item-modal.html',
						name: 'modal-publication-group',
						className: 'view-publication ngdialog-theme-default',
						data: {
							pub: pub,
							pubList: $scope.userPublications,
							pubIndex: index
						}
					});
				}
			};

			function isMobile() {
				var screenWidth = $window.innerWidth;
				return screenWidth < 768;
			}

			function checkPublicationsViewMode() {
				if (!storage.pubView) {
					storageService.setStorageItem('pubView', 'greed');
					storage = storageService.getStorage();
				} else {
					if (storage.pubView === 'greed') {
						$scope.photosGrid = true;
					} else if (storage.pubView === 'list') {
						$scope.photosGrid = false;
					}
				}
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
				socket.emit("get user rooms", $scope.loggedUserId);
				socket.on("get user rooms", function (response) {
					$scope.groupsChatArr = response;
				});
				groupsService.getGroupList().then(function (response) {
						$scope.groups = response;
					},
					function (error) {
						console.log(error);
					});
				placesService.getPlaces().then(function (response) {
						$scope.places = response;
					},
					function (error) {
						console.log(error);
					});
			}

			function getAllCommentsPublication(flag, pub, showAllComments) {
				PublicationService.getAllCommentsPublication(pub.id).then(function (response) {
						if (showAllComments === true) {
							if (flag === "userPage") {
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

			function getSinglePublication(pubId, flag, index) {
				PublicationService.getSinglePublication(pubId).then(function (response) {
						//getAllCommentsPublication(pubId);
						$scope.limit = 7;
						$scope.singlePublication = response;
						if (response.cover) {
							$scope.mainImage = response.cover;
						} else {
							$scope.mainImage = response.images[0].url;
						}
						if ($window.innerWidth <= 700) {
							$state.go('mobile-pub-view', {username: $stateParams.username, id: pubId});
						} else {
							if (!flag && $state.current.name === 'user') {
								ngDialog.open({
									template: '../app/User/views/view-publication.html',
									className: 'view-publication ngdialog-theme-default',
									scope: $scope,
									name: "view-publication",
									preCloseCallback: function () {
										//$scope.userPublications[index] = response;
										$scope.indexCurrentImage = 0;
									}
								});
								// $state.go('desktop-pub-view', {username: $stateParams.username, id: pubId});
							}
						}
					},
					function (error) {
						console.log(error);
					});
			}

			function resizeImage(image) {
				Upload.imageDimensions(image).then(function (dimensions) {
					console.info('User publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});

				return Upload.resize(image, 700, 395).then(function (resizedFile) {
					Upload.imageDimensions(resizedFile).then(function (dimensions) {
						console.info('User publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
					});
					resizedFile.is_cover = false;
					$scope.pubNew.files.push(resizedFile);
				});
			}

			function resizeImage2(image) {
				return Upload.resize(image, 700, 395).then(function (resizedFile) {
					return resizedFile;
				});
			}

			function openSubscribers(userId) {
				PublicationService.getSubscribers(userId).then(function (response) {
						$scope.subscribers = response;
					},
					function (error) {
						console.log(error);
					});
				if ($window.innerWidth <= 700) {
					$state.go('subscribers', {username: $stateParams.username, id: userId});
				} else {
					ngDialog.open({
						template: '../app/User/views/popup-user-subscribers.html',
						className: 'popup-user-subscribers ngdialog-theme-default',
						scope: $scope
					});
				}
			}

			function removeUserFromList(list, userId) {
				for (var i = list.length - 1; i >= 0; i--) {
					if (list[i].id == userId) {
						list.splice(i, 1);
					}
				}
			}

			function openSubscribe(userId) {
				PublicationService.getSubscription(userId).then(function (response) {
						$scope.subscriptions = response;
					},
					function (error) {
						console.log(error);
					});
				if ($window.innerWidth <= 700) {
					$state.go('subscribes', {username: $stateParams.username, id: userId});
				}
				else {
					ngDialog.open({
						template: '../app/User/views/popup-user-subscribe.html',
						className: 'popup-user-subscribe ngdialog-theme-default',
						scope: $scope
					});
				}
			}

			function getUserPubs(userId, counter) {
				PublicationService.getUserPublications(userId, counter)
					.then(
						function (res) {
							if (res.status) {
								if (!$scope.userPublications) {
									$scope.userPublications = res.publications;
								} else {
									if (res.publications.length > 0) {
										res.publications.forEach(function (pub) {
											$scope.userPublications.push(pub);
										});
									}
								}
							} else {
								if (res.error.code === "8") {

								} else if (res.error.code === "15") {
									$scope.needToLogin = true;
								}
							}
						},
						function (err) {
							console.log(err);
						}
					);
			}

			function setIsMyProfile() {
				$scope.myProfile = profile.login === storage.username;
				if (!$scope.myProfile) {
					$scope.isSigned = profile.is_sub;
					if (!profile.is_sub && !!profile.is_private) {
						$scope.needToSign = true;
					}
				}
			}

		}]);