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
								  socket, md5, $filter, $q, $http, Upload, $window) {
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

				ctrl.groupsChecked = [];
				ctrl.placesChecked = [];
				ctrl.groupsChatArray = [];
				ctrl.subscribersArray = [];
				ctrl.subscriptionsArray = [];
				ctrl.sharePubPopup = null;

				ctrl.active = false;

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
							var element = $window.document.querySelectorAll('#pub' + ctrl.pub.id);
							if (element.length > 1)
								element[1].focus();
						});


						// если в публикации есть видеофайлы, то проверим не является ли один из них обложкой
						if (ctrl.pub.videos.length > 0) {
							var videoIsCoded = false;
							var videoCover = ctrl.pub.videos.filter(function (file, index, videos) {
								return file.pivot.is_cover == true;
							});

							if (videoCover[0]) {
								ctrl.mainVideo = videoCover[0].url;
								videoIsCoded = !!videoCover[0].is_coded;
								if (!videoIsCoded) {
									$http.get('chat/get_video/' + videoCover[0].id).then(function (resp) {
										ctrl.showVideo = !!resp.data.is_coded;
									});
								} else {
									ctrl.showVideo = true;
								}
							} else {
								ctrl.mainVideo = false;
							}
						}

						if (ctrl.pub.images.length > 0) {
							var imgCover = ctrl.pub.images.filter(function (file, index, images) {
								return file.pivot.is_cover == true;
							});

							if (imgCover[0]) {
								ctrl.mainImage = imgCover[0].original_img_url;
							}
						}

					} else {
						ctrl.mainImage = ctrl.pub.cover;
					}



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
					ctrl.showImagePreloader = true;
					if (file.pivot.video_id) {
						ctrl.showImagePreloader = false;
						ctrl.mainImage = null;
						ctrl.mainVideo = file.url;

						$http.get('chat/get_video/' + file.id).then(function (resp) {
							ctrl.showVideo = !!resp.data.is_coded;
						});

						if (ctrl.isModal) {
							ctrl.indexCurrentImage = index;
						}
					} else if (file.pivot.image_id) {
						ctrl.mainVideo = null;
						ctrl.mainImage = file.url;
						if (ctrl.isModal) {
							ctrl.indexCurrentImage = index;
							ctrl.mainImage = file.original_img_url;
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
								--pub.comment_count;
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
					var editor;
					$timeout(function () {

						var element = $window.document.querySelectorAll('#pub' + ctrl.pub.id);

						//если найдено две одинаковых публикации (список и модальное окно), установим фокус на втором элементе (модальное окно)
						if (element.length > 1 && ctrl.isModal) {
							editor = element[1];
							editor.getElementsByClassName('emoji-wysiwyg-editor')[0].focus();

							// если это не модальное окно, а публикация списка, установим на фокус на первом элементе
						} else {
							editor = element[0];
							editor.getElementsByClassName('emoji-wysiwyg-editor')[0].focus();
						}

					});
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
						ctrl.showAddComment = false;
						ctrl.toClick(ctrl.pub, ctrl.index);
					} else {
						showNextInfo();
					}
				};

				ctrl.sharePub = function(pubId){
					ctrl.sharePubPopup = ngDialog.open({
						template: '../app/common/components/publication-list-item/share-publication.html',
						className: 'share-publication ngdialog-theme-default',
						scope: $scope,
						data: {
							pubId: pubId
						}
					});
					loadUserContacts();
				};

				ctrl.closeSharePopup = function(){
					ctrl.sharePubPopup.close();
				};

				ctrl.sendSharePublication = function (pubId) {
					var isMembers = false;
					var isAnotherPlace = false;
					var data;
					if (ctrl.shareData.length > 0) {
						var membersLength = [];
						ctrl.shareData.forEach(function (value) {
							if (value.type === "members") {
								membersLength.push(value);
								var members = [];
								members[0] = $rootScope.user.userId;
								members[1] = value.id;
								data = {
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
										data = {
											userId: $rootScope.user.userId,
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
									userId: $rootScope.user.userId,
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
				ctrl.change = function (data, active, type) {
					if (active) {
						ctrl.shareData.push(data);
						if (type === "subscription") {
							ctrl.subscriptionsArray.push(data.id);
							ctrl.subscribers.forEach(function (value) {
								if (value.id === data.id) {
									ctrl.subscribersArray.push(value.id);
								}
							});
						} else if (type === "subscriber") {
							ctrl.subscribersArray.push(data.id);
							ctrl.subscriptions.forEach(function (value) {
								if (value.id === data.id) {
									ctrl.subscriptionsArray.push(value.id);
								}
							});
						} else if (type === "group") {
							ctrl.groupsChecked.push(data.id);
						} else if (type === "place") {
							ctrl.placesChecked.push(data.id);
						} else if (type === "group-chat") {
							ctrl.groupsChatArray.push(data.room_id);
						}
					} else {
						ctrl.shareData.splice(ctrl.shareData.indexOf(data), 1);
						if (type === "subscription") {
							ctrl.subscriptionsArray.splice(ctrl.subscriptionsArray.indexOf(data.id), 1);
							ctrl.subscribers.forEach(function (value) {
								if (value.id === data.id) {
									ctrl.subscribersArray.splice(ctrl.subscribersArray.indexOf(value.id), 1);
								}
							});
						} else if (type === "subscriber") {
							ctrl.subscribersArray.splice(ctrl.subscribersArray.indexOf(data.id), 1);
							ctrl.subscriptions.forEach(function (value) {
								if (value.id === data.id) {
									ctrl.subscriptionsArray.splice(ctrl.subscriptionsArray.indexOf(value.id), 1);
								}
							});
						} else if (type === "group") {
							ctrl.groupsChecked.splice(ctrl.groupsChecked.indexOf(data.id), 1);
						} else if (type === "place") {
							ctrl.placesChecked.splice(ctrl.placesChecked.indexOf(data.id), 1);
						} else if (type === "group-chat") {
							ctrl.groupsChatArray.splice(ctrl.groupsChatArray.indexOf(data.room_id), 1);
						}
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
						socket.emit("get user rooms", $rootScope.user.userId);
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
					var linkToPublication = $location.protocol() + "://" + $location.host() + "/p/" + pubId + "/" + hashPubId;
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

				ctrl.openModalEditPub = function () {
					var original = angular.copy(ctrl.pub);
					ngDialog.open({
						template: '../app/common/views/publication-edit.html',
						className: 'user-publication user-publication-edit ngdialog-theme-default ',
						scope: $scope,
						name: 'modal-edit-publication',
						data: {
							pub: ctrl.pub
						},
						preCloseCallback: function () {
							
						}
					});
				};


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

				ctrl.mainImageChanged = function(){
					ctrl.showImagePreloader = false;
				};

				ctrl.limit = 6;

				ctrl.loadMorePubFiles = function(key){
					if(key === false){
						ctrl.limit = ctrl.pub.images.length + ctrl.pub.videos.length;
					}else{
						ctrl.limit = 6;
					}
				};

				ctrl.openPreviousInfo = function () {
					$timeout(function () {
						var element = $window.document.querySelectorAll('#pub' + ctrl.pub.id);
						if (element.length > 1)
							element[1].focus();
					});
					var imagesLength = ctrl.pub.files.length;
					if (imagesLength >= 1) {
						if (ctrl.pub.files[ctrl.indexCurrentImage - 1] !== undefined) {
							ctrl.showImagePreloader = true;
							ctrl.indexCurrentImage--;
							if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.image_id) {
								ctrl.mainImage = ctrl.pub.files[ctrl.indexCurrentImage].original_img_url;
								ctrl.mainVideo = null;
							} else if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id) {
								$http.get('chat/get_video/' + ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id).then(function(resp){
									ctrl.showVideo = !!resp.data.is_coded;
									ctrl.mainVideo = ctrl.pub.files[ctrl.indexCurrentImage].url;
									ctrl.mainImage = null;
									ctrl.showImagePreloader = false;
								});
							}
						} else {
							var prevPub = ctrl.pubList[ctrl.pubIndex - 1];
							if (prevPub) {
								ctrl.pubIndex--;
								ctrl.pub = prevPub;
								imagesLength = ctrl.pub.files.length;
								ctrl.indexCurrentImage = ctrl.pub.files.length - 1;
								if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.image_id) {
									ctrl.mainImage = ctrl.pub.files[ctrl.indexCurrentImage].original_img_url;
									ctrl.mainVideo = null;
								} else if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id) {
									$http.get('chat/get_video/' + ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id).then(function(resp){
										ctrl.showVideo = !!resp.data.is_coded;
										ctrl.mainVideo = ctrl.pub.files[ctrl.indexCurrentImage].url;
										ctrl.mainImage = null;
										ctrl.showImagePreloader = false;
									});
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
							ctrl.showImagePreloader = true;
							if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.image_id) {
								ctrl.mainImage = ctrl.pub.files[ctrl.indexCurrentImage].original_img_url;
								ctrl.mainVideo = null;
							} else if (ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id) {
								$http.get('chat/get_video/' + ctrl.pub.files[ctrl.indexCurrentImage].pivot.video_id).then(function(resp){
									ctrl.showVideo = !!resp.data.is_coded;
									ctrl.mainVideo = ctrl.pub.files[ctrl.indexCurrentImage].url;
									ctrl.mainImage = null;
									ctrl.showImagePreloader = false;
								});
							}
						} else {
							var nextPub = ctrl.pubList[ctrl.pubIndex + 1];
							if (nextPub) {
								ctrl.pubIndex++;
								ctrl.pub = nextPub;
								if (ctrl.pub.files[0] !== undefined) {
									if (ctrl.pub.files[0].pivot.image_id) {
										ctrl.mainImage = ctrl.pub.files[0].original_img_url;
										ctrl.mainVideo = null;
									} else if (ctrl.pub.files[0].pivot.video_id) {
										$http.get('chat/get_video/' + ctrl.pub.files[0].pivot.video_id).then(function (resp) {
											ctrl.showVideo = !!resp.data.is_coded;
											ctrl.mainVideo = ctrl.pub.files[0].url;
											ctrl.mainImage = null;
											ctrl.showImagePreloader = false;
										});
									}
									ctrl.indexCurrentImage = 0;
								}
							}
						}
					}
				}

				function getIndexCurrentImage() {
					var index;
					if(ctrl.pub.files !== undefined){
						ctrl.pub.files.forEach(function (file, i, files) {
							if (file.pivot.is_cover) {
								index = i;
							}
						});
						return index;
					}
				}
			}
		});
})(angular);