angular.module('placePeopleApp')
	.controller('userCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'StaticService', 'AuthService',
		'UserService', '$window', '$http', 'storageService', 'ngDialog', 'PublicationService', 'amMoment',
		'$q', '$timeout', 'Upload', 'socket',
		'groupsService', 'placesService', '$location',
		function ($scope, $rootScope, $state, $stateParams, StaticService, AuthService,
				  UserService, $window, $http, storageService, ngDialog, PublicationService, amMoment,
				  $q, $timeout, Upload, socket, groupsService, placesService, $location) {
			/* Service info*/
			amMoment.changeLocale('ru');
			$scope.$emit('userPoint', 'user');
			var storage = storageService.getStorage();
			$scope.loggedUser = storage.username;
			$scope.loggedUserId = +storage.userId;
			$scope.shareData = [];
			var sharePublication = null;
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
			$scope.images = {};
			$scope.commentModel = {pubText: ''};
			$http.get('/static_page/get/name').success(function (response) {
				$scope.staticPages = response;
			}).error(function (error) {
				console.log(error);
			});

			$scope.closeSharePopup = function () {
				sharePublication.close();
			};
			$scope.sendSharePublication = function (pubId) {
				if ($scope.shareData.length > 0) {
					var membersLength = [];
					$scope.shareData.forEach(function (value) {
						if(value.type === "members"){
							membersLength.push(value);
							var members = [];
							members[0] = parseInt($scope.loggedUserId);
							members[1] = value.id;
							var data = {
								members: members,
								is_group: false,
								share: true
							};
							socket.emit('create room', data, function(response){
								if(Object.prototype.toString.call(response) === '[object Array]'){
									console.log(response);
    								if(response.length === membersLength.length){
										response.forEach(function(value){
											var data = {
												userId: $scope.loggedUserId,
												room_id: value.room_id,
												message: $location.absUrl() + "/publication/" + pubId
											};
											socket.emit('send message', data);
										});
									}
								}else{
									var data = {
										userId: $scope.loggedUserId,
										room_id: response.room_id,
										message: $location.absUrl() + "/publication/" + pubId
									};
									socket.emit('send message', data);
								}
							});
						}else{
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
									popupNotification.close();
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
			var photosBlock = angular.element(document.querySelector('#user-page .my-photos'))[0];

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

			/*User info*/

			var counter = 0;
			UserService.getUserData($stateParams.username)
				.then(
					function (res) {
						if (res.login === storage.username) {
							$scope.myProfile = true;
							storageService.setStorageItem('loggedUserAva', res.avatar_path);
							storageService.setStorageItem('firstName', res.first_name);
							storageService.setStorageItem('lastName', res.last_name);
							$scope.loggedUserAva = res.avatar_path;
						} else {
							$scope.myProfile = false;
						}
						if (!$scope.myProfile) {
							$scope.isSigned = res.is_sub;
							if (!res.is_sub && !!res.is_private) {
								$scope.needToSign = true;
							}
						}
						$scope.userData = res;
						getUserPubs(res.id, counter);
					},
					function (err) {
						console.log(err);
					}
				);

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
					.then(function(data) {
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
					.then(function(data) {
						if (data.status) {
							user.is_sub = data.is_sub;
						}
					});
			};

			function removeUserFromList(list, userId) {
				for (var i = list.length - 1; i >= 0; i--) {
					if (list[i].id == userId) {
						list.splice(i, 1);
					}
				}
			}

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

			$scope.openSubscribers = function (userId) {
				openSubscribers(userId);
			};
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

			$scope.openSubscribe = function (userId) {
				openSubscribe(userId);
			};

			$scope.createPublication = function () {
				ngDialog.open({
					template: '../app/User/views/create-publication.html',
					className: 'user-publication ngdialog-theme-default',
					scope: $scope,
					name: "create-publication"
				});
			};

			$scope.closePopup = function () {
				ngDialog.closeAll();
			};

			$scope.openPublicationPreviewBlock = function (files) {
				if (!$scope.showPubAdd) {
					$scope.showPubAdd = !$scope.showPubAdd;
				}

			};

			$scope.pubFiles = function (files, event, flow) {
				if (files.length > 4) {
					$scope.pubFilesNeedScroll = true;
				} else if (files.length > 100) {
					console.log('too much files');
				}
				$scope.$broadcast('rebuild:me');
			};

			$scope.fileTypeCheck = function (filetype) {
				var type = filetype.split('/')[0];
				if (type === 'image') {
					return true;
				} else if (type === 'video') {
					return false;
				}
			};

			$scope.setMainPubPhoto = function (target) {
				$scope.mainPubPhoto = target.file.name;
			};

			$scope.deletePubFile = function (files, index) {
				files.splice(index, 1);
			};
			$scope.emojiMessage = {};
			$scope.$on('ngDialog.opened', function (e, $dialog) {
				if ($dialog.name === "view-publication") {
					window.emojiPicker = new EmojiPicker({
						emojiable_selector: '.view-publication-pub-text',
						assetsPath: 'lib/img/',
						popupButtonClasses: 'fa fa-smile-o'
					});
					window.emojiPicker.discover();
					$(".emoji-button").text("");
				} else if ($dialog.name === "edit-publication") {
					window.emojiPicker = new EmojiPicker({
						emojiable_selector: '.edit-publication-pub-text',
						assetsPath: 'lib/img/',
						popupButtonClasses: 'fa fa-smile-o'
					});
					window.emojiPicker.discover();
					$(".emoji-button").text("");
					$(".ngdialog .emoji-wysiwyg-editor")[1].innerHTML = $scope.currPub.text.split(' messagetext: ')[0];
				} else if ($dialog.name === "create-publication") {
					window.emojiPicker = new EmojiPicker({
						emojiable_selector: '.create-publication-pub-text',
						assetsPath: 'lib/img/',
						popupButtonClasses: 'fa fa-smile-o'
					});
					window.emojiPicker.discover();
					$(".emoji-button").text("");
				}
			});
			$scope.publishNewPub = function (files, pubText) {
				var textToSave = $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + pubText.messagetext;
				if (files === undefined || files.length == 0) {
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
				files.forEach(function (file) {
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
				PublicationService.createPublication(textToSave, 0, isMain, videos, images).then(function (res) {
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
				getSinglePublication($stateParams.id);
				$scope.returnToBack = function () {
					$state.go("user", {username: $stateParams.username});
				}
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
			}


			function getSinglePublication(pubId, flag) {
				PublicationService.getSinglePublication(pubId).then(function (response) {
						//getAllCommentsPublication(pubId);
						$scope.limit = 6;
						$scope.singlePublication = response;
						if (response.images[0] !== undefined) {
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
									name: "view-publication"
								});
								// $state.go('desktop-pub-view', {username: $stateParams.username, id: pubId});
							}
						}
					},
					function (error) {
						console.log(error);
					});
			}

			$scope.showPublication = function (pub, index) {
				$scope.indexCurrentPublication = index;
				getSinglePublication(pub.id);
			};
			$scope.showAddCommentBlock = function (pub) {
				if (pub.showAddComment) {
					pub.showAddComment = false;
				} else {
					pub.showAddComment = true;
				}
			}
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
			}

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
			}
			$scope.changeMainFile = function (file, flag, pub) {
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
			}
			$scope.addCommentLike = function (comment) {
				PublicationService.addCommentLike(comment.id).then(function (response) {
						comment.like_count = response.like_count;
					},
					function (error) {
						console.log(error);
					});
			}
			$scope.addPublicationLike = function (pub, isCurrentUser) {
				PublicationService.addPublicationLike(pub.id).then(function (response) {
						pub.user_like = response.user_like;
						pub.like_count = response.like_count;
					},
					function (error) {
						console.log(error);
					});
			}
			$scope.deleteComment = function (flag, pub, comment, index) {
				PublicationService.deleteCommentPublication(comment.id).then(function (response) {
						if (response.status) {
							if (flag === "userPage") {
								pub.comments = pub.comments.reverse();
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
			}
			$scope.getAllCommentsPublication = function (flag, pub, showAllComments) {
				getAllCommentsPublication(flag, pub, showAllComments);
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

			$scope.loadMorePubFiles = function (key, flag, pub) {

				if (flag === 'list') {
					if (key === false) {
						pub.limit = pub.images.length + pub.videos.length;
					} else {
						pub.limit = 6;
					}
					// pub.morePubFiles = true;
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
			var editPubPopup;
			$scope.editPub = function (pub) {
				$scope.currPub = pub;
				editPubPopup = ngDialog.open({
					template: '../app/User/views/edit-publication.html',
					className: 'user-publication user-publication-edit ngdialog-theme-default',
					scope: $scope,
					name: "edit-publication"
				});
			};

			function getBlobFromUrl(item, callback) {
				var url = item.url;
				return $http({
					url: url,
					method: "GET",
					responseType: "blob"
				}).success(function (value) {
					return callback(value);
				});
			}

			function createBlobFromURL(images) {
				var prom = [];
				var arr = [];
				angular.forEach(images, function (item) {
					prom.push(getBlobFromUrl(item, function (value) {
						arr.push(value);
					}));
				});
				return $q.all(prom).then(function () {
					return arr;
				});

			}

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

			var pubEditDeletedPhotos = [];
			var pubEditDeletedVideos = [];


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
				var isMain;
				if ($state.current.name === 'feed') {
					isMain = 1;
				} else {
					isMain = 0;
				}
				if (files) {
					files.forEach(function (file) {
						var type = file.type.split('/')[0];
						if (type === 'image') {
							images.push(file);
						} else if (type === 'video') {
							videos.push(file);
						}
					});
				}
				PublicationService.updatePublication(pubId, textToSave, 0, isMain, images, videos, pubEditDeletedVideos, pubEditDeletedPhotos)
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
					data: {pubId: pubId}
				});
				loadUserContacts();
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

			$scope.getPubLink = function (pubId) {
				$scope.linkToPublication = $location.absUrl() + "/publication/" + pubId;
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
					}
				});
			};

			$scope.alertPubComment = function (commentId) {
				ngDialog.open({
					template: '../app/User/views/alert-publication.html',
					className: 'alert-publication ngdialog-theme-default',
					scope: $scope,
					data: {
						id: commentId,
						flag: 'comment'
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
								ngDialog.closeAll();
							} else {
								onsole.log('Error');
							}
						},
						function (err) {
							console.log(err);
						});
				} else if (flag === 'pub') {
					// PublicationService.complaintPubAuthor(complainUnitId, complainCategory)
					//  .then(
					//      function(res){
					//          if (res.status) {
					ngDialog.closeAll();
					//          } else {
					//              console.log('Error');
					//          }
					//      },
					//      function(err){
					//          console.log(err);
					//      });
				}
			};

			$scope.deletePub = function (pub) {
				$scope.pubToDelete = pub.id;
				ngDialog.open({
					template: '../app/User/views/delete-publication.html',
					className: 'delete-publication ngdialog-theme-default',
					scope: $scope
				});
			};

			$scope.confirmPubDelete = function (pubToDelete) {
				PublicationService.deletePublication(pubToDelete).then(function (res) {
						if (res.status) {
							$scope.userPublications.splice($scope.indexCurrentPublication, 1);
							$scope.userData.publications_count--;
							getUserPubs(storage.userId);
						}
						ngDialog.closeAll();
					},
					function (err) {
						console.log(err);
					});
			};
		}]);