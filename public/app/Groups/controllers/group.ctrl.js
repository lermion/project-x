(function (angular) {
	'use strict';

	angular
		.module('app.groups')
		.controller('GroupCtrl', GroupCtrl);

	GroupCtrl.$inject = ['$filter', '$timeout', '$rootScope', '$scope', '$state', '$stateParams', 'group', '$http', '$window',
		'AuthService', 'storageService', 'ngDialog', 'groupsService', 'UserService', 'PublicationService',
		'Upload', 'amMoment', 'socket', '$q', '$location', 'placesService', 'md5', 'ChatService'];

	function GroupCtrl($filter, $timeout, $rootScope, $scope, $state, $stateParams, group, $http, $window,
					   AuthService, storageService, ngDialog, groupsService, UserService, PublicationService,
					   Upload, amMoment, socket, $q, $location, placesService, md5, ChatService) {

		var vm = this;
		var storage = storageService.getStorage();

		var myId = +storage.userId;
		var myAvatar = storage.loggedUserAva;
		var firstName = storage.firstName;
		var lastName = storage.lastName;
		var login = storage.username;
		$scope.messageVideos = [];

		var modalEditGroup, modalDeleteGroup, modalInviteUsers,
			modalSetCreator, modalNewPublication, modalReviewPublication, modalCropImage,
			modalAlertComment;
		var groupName = $stateParams.groupName;

		var newPublicationObj = {
			groupId: group.id,
			text: ''
		};


		vm.firstName = firstName;
		vm.lastName = lastName;
		vm.myAvatar = myAvatar;
		vm.myId = myId;
		vm.loggedUser = storage.username;

		vm.isMobile = false;


		vm.group = group;
		vm.groupEdited = {};
		vm.newPublication = angular.copy(newPublicationObj);
		vm.pubEdited = {};

		vm.newComment = {};

		vm.forms = {
			editGroup: {},
			newPublication: {}
		};

		vm.showGroupMenu = false;
		vm.subscribers = [];
		vm.invitedUsers = [];
		vm.adminsList = [];
		vm.creator = {id: null};

		vm.inviteNotSend = true;
		vm.isSend = false;

		vm.emoji = {
			emojiMessage: {
				messagetext: '',
				rawhtml: ''
			}
		};

		vm.userName = storage.username;

		vm.files = [];

		vm.subForm = false;

		vm.showFullDescription = false;

		vm.complainIsSend = false;

		$scope.myImage = null;
		$scope.myCroppedImage = null;
		$scope.blobImg = null;

		amMoment.changeLocale('ru');

		activate();

		/////////////////////////////////////////////////

		function activate() {
			init();
			checkSearch();
			checkPublicationsView();
		}

		function init() {
			$scope.$emit('userPoint', 'user');
			var storage = storageService.getStorage();

			vm.logOut = function () {
				AuthService.userLogOut()
					.then(function (res) {
						storageService.deleteStorage();
						$state.go('login');
					}, function (err) {
						console.log(err);
					});
			};

			vm.openMenu = function () {
				if ($window.innerWidth <= 800) {
					vm.showMenu = !vm.showMenu;
				} else {
					vm.showMenu = true;
				}
			};

			vm.openBottomMenu = function () {
				if ($window.innerWidth <= 650) {
					vm.showBottomMenu = !vm.showBottomMenu;
				} else {
					vm.showBottomMenu = false;
				}
			};

			var w = angular.element($window);
			$scope.$watch(
				function () {
					return $window.innerWidth;
				},
				function (value) {
					if (value <= 800) {
						vm.showMenu = false;
					} else {
						vm.showMenu = true;
					}

					if (value <= 650) {
						vm.showBottomMenu = false;
					} else {
						vm.showBottomMenu = true;
					}

					if (value < 520) {
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 42) / 4;
						console.log(1);
						vm.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
						vm.resizeHeight = 'height:' + blockThirdthLength + 'px;';
					} else {
						vm.resizeSizes = '';
						vm.resizeHeight = '';
					}
				},
				true
			);
			w.bind('resize', function () {
				$scope.$apply();
			});
		}

		// set default tab (view) for group view
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
			if (toState.name === "group.chat") {
				var data = {
					room_id: vm.group.room_id,
					userId: $scope.loggedUserId
				};
				socket.emit("connection to chat", data);
			}
			var state = $state.current.name;

			if (state === 'group' && fromState.name === 'group.publications') {
				$state.go(toParams.prevState);
			}
			if (state === 'group.publications' && !$rootScope.isAuthorized) {
				$state.go('^');
			}
			if (state === 'group' && fromState.name !== 'group.publications' && $rootScope.isAuthorized) {
				$state.go('group.publications');
			}

			if (state !== 'group.mob-pub') {
				vm.isMobile = false;
			}
			if (state === 'group.files') {
				vm.chatFiles = $state.params.chatFiles;
				vm.mergedChatFiles = [].concat.apply([], vm.chatFiles);
				vm.itemsFiles = vm.mergedChatFiles.slice(0, 21);
			}

			vm.showPubSwitch = (state === 'place.publications' || state === 'group.publications');
		});

		//$scope.$on('ngDialog.opened', function (e, $dialog) {
		//    if ($dialog.name === "modal-publication-group") {
		//        var mainImagePublication = $(".main-image-publication");
		//        setTimeout(function () {
		//            mainImagePublication.focus();
		//        }, 0);
		//        $scope.keyPress = function (event, images) {
		//            if (event.keyCode === 39) {
		//                $scope.openNextInfo(images);
		//            } else if (event.keyCode === 37) {
		//                $scope.openPreviousInfo(images);
		//            }
		//        };
		//    }
		//    if ($dialog.name === "modal-edit-group") {
		//        $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML = $filter('colonToSmiley')(vm.groupEdited.description);
		//    }
		//
		//    if ($dialog.name === "modal-edit-publication") {
		//        $(".ngdialog.user-publication-edit .emoji-wysiwyg-editor")[0].innerHTML = $filter('colonToSmiley')(vm.pubEdited.text);
		//    }
		//});


		// Modal windows
		vm.openModalEditGroup = function () {
			vm.groupEdited = angular.copy(vm.group);
			vm.groupEdited.is_open = !!vm.groupEdited.is_open;
			vm.emoji.emojiMessage.messagetext = vm.groupEdited.description;
			modalEditGroup = ngDialog.open({
				template: '../app/Groups/views/popup-edit-group.html',
				name: 'modal-edit-group',
				className: 'popup-add-group popup-edit-group ngdialog-theme-default',
				scope: $scope
			});
		};

		vm.openModalInviteUsers = function () {
			getSubscribers().then(function () {
				getSubscription().then(function () {
					vm.canInviteUsers = canInviteUsers();
					modalInviteUsers = ngDialog.open({
						template: '../app/Groups/views/popup-invite-group.html',
						name: 'modal-invite-group',
						className: 'popup-invite-group ngdialog-theme-default',
						scope: $scope,
						preCloseCallback: function () {
							vm.invitedUsers = [];
						}
					});
				});

			});
		};

		//vm.openModalNewPublication = function () {
		//    modalNewPublication = ngDialog.open({
		//        template: '../app/Groups/views/popup-add-publication.html',
		//        name: 'modal-publication-group',
		//        className: 'user-publication group-pub ngdialog-theme-default',
		//        scope: $scope,
		//        preCloseCallback: resetFormNewPublication
		//    });
		//};

		vm.openModalNewPublication = function () {
			modalNewPublication = ngDialog.open({
				template: '../app/common/views/publication-new.html',
				className: 'user-publication ngdialog-theme-default',
				scope: $scope,
				data: {
				  group: vm.group
				},
				preCloseCallback: resetFormNewPublication
			});
		};

		vm.openModalReviewPublication = function (id, index) {
			$scope.indexCurrentPublication = index;
			getPublication(id).then(function () {
				var screenWidth = $window.innerWidth;
				if (screenWidth < 768) {
					vm.isMobile = true;
					$state.go('group.mob-pub');
				} else if (screenWidth >= 768) {
					vm.isMobile = false;
					modalReviewPublication = ngDialog.open({
						template: '../app/Groups/views/popup-view-group-publication.html',
						name: 'modal-publication-group',
						className: 'view-publication ngdialog-theme-default',
						scope: $scope,
						preCloseCallback: function () {
							// TODO: появляется "лишняя" публикация после текущей и сразу пропадает
							//vm.group.publications[index] = vm.activePublication;
						}
					});
				}

			});
		};

		vm.openModalPublication = function (pub, index) {
			if (isMobile()) {

				$state.go('mobile-pub-view-test', {
					id: pub.id,
					prevState: {
						name: 'group',
						params: {
							groupName: vm.group.url_name
						}
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
						pubList: vm.group.publications,
						pubIndex: index
					}
				});
			}
		};

		vm.openModalMediaFile = function (file) {
			ngDialog.open({
				templateUrl: '../app/common/components/media-file/modal-media-file.html',
				className: 'popup-comment-images ngdialog-theme-default',
				data: {
					file: file
				},
				preCloseCallback: function () {
				}
			});
		};

		vm.openModalImageFullSize = function (url) {
			if (!url) {
				url = vm.group.avatar;
			}
			ngDialog.open({
				templateUrl: '../app/common/views/modal-image-fullsize.html',
				className: 'popup-comment-images ngdialog-theme-default',
				data: {
					image: {
						src: url
					}
				},
				preCloseCallback: function () {
				}
			});
		};


		// Submit forms
		vm.submitNewPublication = function () {
			vm.forms.newPublication.$setSubmitted();
			if (vm.forms.newPublication.$invalid || vm.files.length === 0) {
				return false;
			}
			vm.newPublication.text = vm.emoji.emojiMessage.messagetext;
			vm.newPublication.files = filterAttachFilesByType();

			if (!vm.newPublication.cover) {
				//TODO: separate files by type
				vm.newPublication.cover = vm.files[0];
			}

			groupsService.addPublication(vm.newPublication)
				.then(function (data) {
					if (data.status) {
						vm.group.publications.push(data.publication);
						vm.group.count_publications++;
						modalNewPublication.close();
					}
				})
		};

		$rootScope.$on('publication:add', function(event, data) {
			vm.group.publications.push(data.publication);
			vm.group.count_publications++;
		});

		$rootScope.$on('publication:update', function(event, data) {
			angular.forEach($scope.userPublications, function (item, index, arr) {
				if (item.id === data.publication.id) {
					arr[index] = data.publication;
				}
			});
		});


		//New publication
		vm.removeAttachFile = function (index, mode) {
			if (mode === 'edit') {
				vm.editedPubFilesArray.splice(index, 1);
			} else {
				vm.files.splice(index, 1);
			}
			$scope.$broadcast('rebuild:me');
		};

		vm.removeAttachFileComments = function (index, mode) {
			vm.activePublication.files.splice(index, 1);
			$scope.$broadcast('rebuild:me');
		};

		vm.beforeAttachFileToPublication = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			var defer = $q.defer();
			var prom = [];
			newFiles.forEach(function (image) {
				prom.push(resizeImage(image));
			});
			$q.all(prom).then(function () {
				$scope.$broadcast('rebuild:me');
			});
		};

		function resizeImage(image) {
			Upload.imageDimensions(image).then(function (dimensions) {
				console.info('Group publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
			});

			return Upload.resize(image, 700, 395).then(function (resizedFile) {
				Upload.imageDimensions(resizedFile).then(function (dimensions) {
					console.info('Group publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				vm.files.push(resizedFile);
			});
		}

		vm.beforeAttachFileToPublicationComments = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			if (vm.activePublication.files.length > 4 || files.length > 4) {
				$scope.$broadcast('rebuild:me');
			}
		};

		vm.addNewComment = function (flag, pub, pubText, files) {
			vm.subForm = true;
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

			vm.newComment.text = vm.emoji.emojiMessage.messagetext;

			if (!vm.newComment.text) {
				vm.subForm = false;
				return false;
			}

			PublicationService.addCommentPublication(pub.id, vm.newComment.text, images, videos).then(function (response) {
					vm.showAddComment = false;
					vm.subForm = false;
					if (response.data.status) {
						$(".emoji-wysiwyg-editor").html("");
						if (flag === "feedPage") {
							pub.files = [];
							vm.newComment.text = '';
							pub.comments.push(response.data.comment);
							pub.comment_count++;
						}
					}
				},
				function (error) {
					console.log(error);
				});
		};

		vm.addCommentLike = function (comment) {
			PublicationService.addCommentLike(comment.id).then(function (response) {
					comment.like_count = response.like_count;
				},
				function (error) {
					console.log(error);
				});
		};

		vm.getAllCommentsPublication = function (flag, pub, showAllComments) {
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

		vm.deleteComment = function (flag, pub, comment, index) {
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

		vm.openCommentComplainBlock = function (commentId) {
			ngDialog.open({
				template: '../app/Groups/views/alert-publication.html',
				className: 'alert-publication ngdialog-theme-default',
				scope: $scope,
				data: {
					id: commentId,
					flag: 'comment'
				},
				preCloseCallback: function () {
					vm.complainIsSend = false;
				}
			});
		};

		$scope.showFullComment = function (comment) {
			comment.commentLength = comment.text.length;
		};

		$scope.getPubText = function (text) {
			if (text != undefined) {
				var mes = text.split(' messagetext: ');
				return mes[1];
			}
		};

		vm.showMoreImages = function (images, currImg) {
			if (currImg != null) {
				vm.mainImageInPopup = currImg.url;
			} else {
				vm.mainImageInPopup = images[0].url;
			}

			ngDialog.open({
				template: '../app/Groups/views/popup-comment-images.html',
				className: 'popup-comment-images ngdialog-theme-default',
				scope: $scope,
				data: {
					images: images
				}
			});
		};

		vm.deletePubFile = function (files, index) {
			files.splice(index, 1);
			$scope.$broadcast('rebuild:me');
		};


		$rootScope.$on('publication:delete', function(event, data) {
			angular.forEach(vm.group.publications, function (item, index, arr) {
				if (item.id === data.pubId) {
					arr.splice(index, 1);
					vm.group.count_publications--;
				}
			});
		});

		vm.openPubComplainBlock = function (pubId) {
			modalAlertComment = ngDialog.open({
				template: '../app/Groups/views/alert-publication.html',
				className: 'alert-publication ngdialog-theme-default',
				scope: $scope,
				data: {
					id: pubId,
					flag: 'pub'
				},
				preCloseCallback: function () {
					vm.complainIsSend = false;
					vm.alerts = {};
				}
			});
		};

		vm.alerts = {};
		vm.sendComplain = function (complainUnitId, flag, cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8) {
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
								vm.complainIsSend = true;
								$timeout(function () {
									modalAlertComment.close();
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
								vm.complainIsSend = true;
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

		vm.getPubLink = function (pub) {
			var hashPubId = md5.createHash(pub.id + "");
			vm.pubLink = "http://" + $location.host() + "/p/" + pub.id + "/" + hashPubId;
			ngDialog.open({
				template: '../app/Groups/views/get-link-publication.html',
				className: 'link-publication ngdialog-theme-default',
				scope: $scope
			});
		};

		vm.sharePub = function (pubId) {
			getSubscribers()
				.then(function (data) {
					ngDialog.open({
						template: '../app/Groups/views/popup-sharepub-group.html',
						className: 'popup-invite-group ngdialog-theme-default',
						scope: $scope,
						preCloseCallback: resetFormInviteUsers
					});
				});

		};

		vm.returnToPubList = function () {
			if (vm.isMobile) {
				vm.isMobile = false;
				$state.go('group.publications');
			}
		};

		var editPubPopup;
		var pubEditDeletedPhotos = [];
		var pubEditDeletedVideos = [];
		vm.editPub = function (pub) {
			vm.pubEdited = angular.copy(vm.activePublication);
			vm.emoji.emojiMessage.messagetext = vm.pubEdited.text;

			editPubPopup = ngDialog.open({
				template: '../app/Groups/views/popup-edit-publication.html',
				className: 'user-publication user-publication-edit ngdialog-theme-default',
				scope: $scope,
				name: "modal-edit-publication",
				preCloseCallback: resetFormNewPublication
			});
		};

		vm.editedPubFiles = function (pub) {
			var files = [];
			pub.images.forEach(function (img) {
				var filename = img.url.split('/')[(img.url.split('/')).length - 1];
				img.name = filename.substring(8, filename.length);
				files.push(img);
			});
			pub.videos.forEach(function (video) {
				files.push(video);
			});
			vm.editedPubFilesArray = files;
		};

		vm.editedPubDeleteFile = function (index, fileId, pivot) {
			vm.editedPubFilesArray.splice(index, 1);
			if (pivot.image_id) {
				pubEditDeletedPhotos.push(fileId);
			} else if (pivot.video_id) {
				pubEditDeletedVideos.push(fileId);
			}
			$scope.$broadcast('rebuild:me');
		};

		vm.rebuildScroll = function () {
			$scope.$broadcast('loadPubFiles');
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

		vm.saveEditedPub = function (pubId, pubText, files) {
			vm.pubEdited.description = vm.emoji.emojiMessage.messagetext;
			vm.updatePubLoader = true;
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
			PublicationService.updatePublication(pubId, vm.pubEdited.description, 0, isMain, images, videos, pubEditDeletedVideos, pubEditDeletedPhotos)
				.then(
					function (res) {
						if (res.status) {
							ngDialog.closeAll();
						} else {
							console.log('Error');
						}
						vm.updatePubLoader = false;
					},
					function (err) {
						console.log(err);
					});
		};


		vm.deleteGroup = function () {
			groupsService.deleteGroup(vm.group.id)
				.then(function (data) {
					if (data.status) {
						$state.go('groups');
						modalDeleteGroup.close();
					}
				});
		};

		vm.updateGroup = function () {
			if (vm.subForm) {
				return false;
			}

			if (vm.groupEdited.description === vm.emoji.emojiMessage.messagetext && vm.forms.editGroup.$pristine) {
				return false;
			}

			vm.forms.editGroup.$setSubmitted();

			if (vm.forms.editGroup.$invalid) {
				return false;
			}

			if (vm.group.name === vm.groupEdited.name) {
				vm.groupEdited.name = null;
			}
			if (!vm.forms.editGroup.avatar.$dirty) {
				vm.groupEdited.avatar = null;
			}

			groupsService.updateGroup(vm.groupEdited)
				.then(function (data) {
					if (data.status) {
						vm.group.name = data.groupData.name || vm.group.name;
						vm.group.description = data.groupData.description || vm.group.description;
						vm.group.is_open = data.groupData.is_open == true;
						vm.group.avatar = data.groupData.avatar || vm.group.avatar;
						vm.group.card_avatar = data.groupData.card_avatar || vm.group.card_avatar;

						if (data.groupData.url_name) {
							changeGroupUrlName(data.groupData.url_name);
						}

						modalEditGroup.close();
					}
				});
		};

		vm.abortDeleteGroup = function () {
			modalDeleteGroup.close();
		};

		vm.subscribe = function () {
			if (group.is_creator) {
				openModalSetCreator();
			} else {
				groupsService.subscribeGroup(vm.group.id)
					.then(function (data) {
						if (data.status) {
							vm.group.is_sub = data.is_sub;
							if (data.is_sub) {
								vm.group.users.push({
									avatar_path: myAvatar,
									first_name: firstName,
									last_name: lastName,
									id: myId,
									is_admin: false,
									login: login
								});
								vm.group.count_users++;
							} else {
								unsubscribe({userId: myId});
								vm.group.count_users--;
							}

						}
					});
			}

		};

		vm.onItemSelected = function (user) {
			var isExist = $filter('getById')(vm.invitedUsers, user.id);

			if (!isExist) {
				var item = {
					userId: user.id,
					firstName: user.first_name,
					lastName: user.last_name,
					avatar: user.avatar_path,
					login: user.login,
					user_quote: user.user_quote,
					is_online: user.is_online,

					isAdmin: false
				};
				vm.invitedUsers.push(item);
			}
		};

		vm.removeUserFromInviteList = function (user) {
			for (var i = vm.invitedUsers.length - 1; i >= 0; i--) {
				if (vm.invitedUsers[i].userId == user.userId) {
					vm.invitedUsers.splice(i, 1);
				}
			}
		};

		vm.removeUser = function (user) {
			removeUser({
				userId: user.id,
				isAdmin: user.is_admin
			});
		};

		vm.submitInviteUsers = function () {
			if (!vm.inviteNotSend) {
				return false;
			}
			groupsService.inviteUsers(group.id, vm.invitedUsers)
				.then(function (data) {
					if (data.status) {
						vm.inviteNotSend = false;

						angular.forEach(vm.invitedUsers, function (item, i, arr) {
							vm.group.users.push({
								avatar_path: item.avatar,
								first_name: item.firstName,
								id: item.userId,
								is_admin: item.isAdmin,
								last_name: item.lastName
							});
						});
						vm.group.count_users += vm.invitedUsers.length;
						$timeout(function () {
							resetFormInviteUsers();
							modalInviteUsers.close();
						}, 2000);
					}
				});
		};

		vm.abortInviteUsers = function () {
			resetFormInviteUsers();
			modalInviteUsers.close();
		};

		vm.setAdmin = function (user, showAdmin) {
			if (!vm.group.is_creator || (vm.group.is_creator && user.id === myId)) {
				return false;
			}
			groupsService.setAdmin(group.id, user.id)
				.then(function (data) {
					if (data.status) {
						user.is_admin = +data.is_admin;
						showAdmin.status = false;
					}
				});
		};

		vm.setCreator = function () {
			if (vm.isSend) {
				return false;
			}
			groupsService.setCreator(group.id, vm.creator.id)
				.then(function (data) {
					if (data.status) {
						vm.isSend = true;
						$timeout(function () {
							resetFormSetCreator();
							modalSetCreator.close();
							$state.go('groups');
						}, 2000);
					}
				});
		};

		vm.abortSetCreator = function () {
			resetFormSetCreator();
			modalSetCreator.close();
		};

		vm.changeGroupCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			var originalFile;
			if (file) {
				originalFile = event.currentTarget.files[0];
				Upload.imageDimensions(file).then(function (dimensions) {
					console.info('Group: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				Upload.resize(file, 700).then(function (resizedFile) {
					Upload.imageDimensions(resizedFile).then(function (dimensions) {
						console.info('Group: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
					});
					vm.groupEdited.avatar = resizedFile;
				});
				onFileSelected(file.name, originalFile);
			}


		};

		vm.changeMainFile = function (file, flag, pub, index) {
			$scope.indexCurrentImage = index;
			if (file.pivot.video_id) {
				vm.mainImage = "";
				vm.mainVideo = file.url;
			} else if (file.pivot.image_id) {
				if (flag) {
					vm.mainImageInPopup = file.url;
				} else {
					vm.mainVideo = "";
					vm.mainImage = file.url;
				}
			}
		};

		$scope.changeMainFile = function(file, flag, pub){
			if(flag){
				if(file.video_url){
					ChatService.getVideo(file.id).then(function(response){
						if(response.status && response.is_coded){
							$scope.mainImageInPopup = null;
							$scope.mainVideoInPopup = file.video_url;
							$scope.notCodedmessage = false;
						}else{
							$scope.mainVideoInPopup = null;
							$scope.mainImageInPopup = null;
							$scope.notCodedmessage = true;
						}
					},
					function(error){
						console.log(error);
					});
				}else{
					$scope.notCodedmessage = false;
					$scope.mainVideoInPopup = null;
					$scope.mainImageInPopup = file.url;
				}
			}else{
				$scope.mainVideo = "";
				$scope.mainImage = file.url;
			}
			if(flag === 'list'){
				pub.mainFile = file;
			}
		};

		vm.addPublicationLike = function (pub) {
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


		vm.showUsersForInvite = function (user) {
			var result = true;

			for (var i = 0; i < vm.group.users.length; i++) {
				if (user.id === vm.group.users[i].id) {
					result = false;
					break;
				}
			}

			return result;
		};

		vm.getMonthYear = function (date) {
			var newDate = moment(date).format("MMMM YYYY");
			newDate = newDate[0].toUpperCase() + newDate.substr(1);
			return newDate;
		};

		vm.getMonth = function (date) {
			return moment(date).month();
		};

		vm.limitToFiles = 3;

		vm.itemsFiles = [];

		vm.loadMoreFiles = function () {
			console.info('Load more');
			var last = vm.itemsFiles.length - 1;
			for (var i = last; i <= last + 21; i++) {
				if (vm.mergedChatFiles[i]) {
					vm.itemsFiles.push(vm.mergedChatFiles[i]);
				}
			}
		};

		var moreItems = true;
		vm.postLoading = false;

		vm.nextPage = function () {
			if (vm.postLoading !== true && vm.itemsFiles.length !== 0 && moreItems === true) {
				vm.postLoading = true;
				var last = vm.itemsFiles.length - 1;
				var arr = [];
				for (var i = last + 1; i <= last + 20; i++) {
					if (vm.mergedChatFiles[i]) {
						arr.push(vm.mergedChatFiles[i]);
					} else {
						moreItems = false;
					}
				}
				console.info('Files list load, length - ' + vm.itemsFiles.length + ', moteItems = ' + moreItems);
				vm.itemsFiles = vm.itemsFiles.concat(arr);
				vm.postLoading = false;
			}
		};

		vm.closeThis = function () {
			vm.showGroupMenu = false;
		};

		vm.pubViewStyleChange = function (flag) {
			if (flag) {
				vm.photosGrid = true;
				storageService.setStorageItem('groupPubView', 'greed');
			} else {
				vm.photosGrid = false;
				storageService.setStorageItem('groupPubView', 'list');
			}
		};

		vm.setMainPubPhoto = function (index) {
			angular.forEach(vm.files, function (item) {
				item.isCover = false;
			});
			vm.files[index].isCover = true;
			vm.newPublication.cover = vm.files[index];
			//resizePubCoverImage(vm.files[index]).then(function (image) {
			//	vm.newPublication.cover = image;
			//});
		};

		vm.clickclick = function () {
			alert(1);
		}


		$scope.saveCropp = function (croppedDataURL) {

			var blob = Upload.dataUrltoBlob(croppedDataURL, $scope.myImageName);

			Upload.resize(blob, 218, 220, 1, null, null, true).then(function (resizedFile) {
				vm.groupEdited.card_avatar = resizedFile;
			});

			modalCropImage.close();
		};


		function getSubscribers() {
			return UserService.getSubscribers(myId)
				.then(function (subscribers) {
					vm.subscribers = subscribers;
				});
		}

		function getSubscription() {
			return PublicationService.getSubscription(myId)
				.then(function (data) {
					vm.subscription = data;
				});
		}

		function getPublication(id) {
			return PublicationService.getSinglePublication(id)
				.then(function (data) {
					vm.activePublication = data;
					if (data.cover) {
						vm.mainImage = data.cover;
					} else {
						vm.mainImage = data.images[0].url;
					}
				});
		}

		function unsubscribe(user) {
			for (var i = vm.group.users.length - 1; i >= 0; i--) {
				if (vm.group.users[i].id == user.userId) {
					vm.group.users.splice(i, 1);
					vm.group.count_users--;
					break;
				}
			}
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

		// Reset Forms
		function resetFormInviteUsers() {
			vm.invitedUsers = [];
			vm.subscribers = [];
			vm.inviteNotSend = true;
		}

		function resetFormSetCreator() {
			vm.adminsList = [];
			vm.creator.id = null;
		}

		function resetFormNewPublication() {
			vm.newPublication = angular.copy(newPublicationObj);
			vm.emoji.emojiMessage.messagetext = '';
			vm.files = [];
		}

		function resetFormEditPublication() {
			vm.pubEdited = {};
			vm.emoji.emojiMessage.messagetext = '';
			vm.files = [];
		}


		function changeGroupUrlName(str) {
			var url = window.location.toString();
			var pathArray = window.location.href.split('/');
			var urlNamePos = pathArray.indexOf('group');
			pathArray[urlNamePos + 1] = str;

			var newPathname = '';
			for (var i = 0; i < pathArray.length; i++) {

				newPathname += pathArray[i];
				newPathname += "/";
			}
			window.location = newPathname.substring(0, newPathname.length - 1);
		}

		function isMobile() {
			var screenWidth = $window.innerWidth;
			return screenWidth < 768;
		}

		function removeUser(user) {
			var arr = [];
			var indexToRemove;
			for (var i = vm.group.users.length - 1; i >= 0; i--) {
				if (vm.group.users[i].id == user.userId) {
					if (user.isAdmin && vm.group.is_creator && user.userId !== myId || !user.isAdmin && vm.group.is_admin) {

						arr.push(user.userId);
						indexToRemove = i;
						groupsService.removeUsers(vm.group.id, arr)
							.then(function (data) {
								if (data.status) {
									vm.group.users.splice(indexToRemove, 1);
									vm.group.count_users--;
								}
							});
					}

				}
			}
		}

		function openModalSetCreator() {
			vm.adminsList = getAdminsList();
			modalSetCreator = ngDialog.open({
				template: '../app/Groups/views/popup-setcreator-group.html',
				name: 'modal-setcreator-group',
				className: 'popup-setcreator-group ngdialog-theme-default',
				scope: $scope
			});
		}

		function getAdminsList() {
			return group.users.filter(function (item) {
				return (!!item.is_admin === true && item.id !== myId);
			});
		}

		function filterAttachFilesByType() {
			var filesByType = {
				images: [],
				videos: []
			};
			if (vm.files && vm.files.length > 0) {
				angular.forEach(vm.files, function (file) {
					if (~file.type.indexOf('image')) {
						filesByType.images.push(file);
					} else if (~file.type.indexOf('video')) {
						filesByType.videos.push(file);
					}
				});
			}

			return filesByType;
		}

		function onFileSelected(fileName, originalFile) {
			var file = originalFile;
			if (file) {
				var reader = new FileReader();

				reader.onload = function (e) {
					$scope.$apply(function ($scope) {
						$scope.myImage = e.target.result;
						$scope.myImageName = fileName;
						modalCropImage = ngDialog.open({
							template: '../app/Groups/views/popup-crop-image.html',
							className: 'settings-add-ava ngdialog-theme-default',
							scope: $scope
						});
					});
				};

				reader.readAsDataURL(file);
			}

		}

		function blobToFile(dataURI) {
			var byteString = atob(dataURI.split(',')[1]);
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ab], {type: 'image/jpeg'});
		}

		function checkSearch() {
			if ($stateParams.isOpenModal) {
				vm.openModalReviewPublication($stateParams.modalId);
			}
		}

		function canInviteUsers() {

			var arr = vm.subscribers.concat(vm.subscription);


			var uniqueUsers = [],
				result = [];

			var subUsersIds = {};
			var groupUsersIds = {};

			for (var i = 0; i < arr.length; i++) {
				if (($.inArray(arr[i].id, uniqueUsers)) == -1) {
					uniqueUsers.push(arr[i]);
				}
			}

			angular.forEach(uniqueUsers, function (el, i) {
				subUsersIds[el.id] = uniqueUsers[i];
			});

			angular.forEach(vm.group.users, function (el, i) {
				groupUsersIds[el.id] = vm.group.users[i];
			});

			for (var prop in subUsersIds) {
				if (!groupUsersIds.hasOwnProperty(prop)) {
					result.push(subUsersIds[prop]);
				}
			}

			return result.length > 0;
		}

		function checkPublicationsView() {
			if (!storage.groupPubView) {
				storageService.setStorageItem('groupPubView', 'greed');
				storage = storageService.getStorage();
			} else {
				if (storage.groupPubView === 'greed') {
					vm.photosGrid = true;
				} else if (storage.groupPubView === 'list') {
					vm.photosGrid = false;
				}
			}
		}

		$scope.indexCurrentImage = 0;
		$scope.openPreviousInfo = function (images) {
			if (images.length >= 1) {
				$scope.indexCurrentImage--;
				if (images[$scope.indexCurrentImage] !== undefined) {
					vm.mainImage = images[$scope.indexCurrentImage].url;
				} else {
					if ($scope.indexCurrentPublication !== 0) {
						vm.group.publications.sort(dynamicSort("created_at"));
						vm.activePublication = vm.group.publications[$scope.indexCurrentPublication -= 1];
						if (vm.activePublication.images[0] !== undefined) {
							vm.mainImage = vm.activePublication.images[0].url;
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
					vm.mainImage = images[$scope.indexCurrentImage].url;
				} else {
					if ($scope.indexCurrentPublication + 1 !== vm.group.publications.length) {
						vm.group.publications.sort(dynamicSort("created_at"));
						vm.activePublication = vm.group.publications[$scope.indexCurrentPublication += 1];
						if (vm.activePublication.images[0] !== undefined) {
							vm.mainImage = vm.activePublication.images[0].url;
							$scope.indexCurrentImage = 0;
						}
					}
				}
			}
		};

		//Chat

		$scope.counter = 10;
		$scope.loadMorePubFiles = function (key, flag, pub) {
			if (flag === 'list') {
				if (key === false) {
					$scope.limit = pub.images.length + pub.videos.length;
				} else {
					$scope.limit = 7;
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
		$scope.showFileAdd = function () {
			if ($scope.showFileAddMenu) {
				$scope.showFileAddMenu = false;
				$scope.hideFileAdd = undefined;
			} else {
				$scope.showFileAddMenu = true;
				setTimeout(function () {
					$scope.hideFileAdd = hideFileAdd;
				}, 0);
			}
		};
		var hideFileAdd = function () {
			if ($scope.showFileAddMenu) {
				$scope.showFileAddMenu = false;
				$scope.hideFileAdd = undefined;
			}
		}
		$scope.showPopupWithFiles = function (files) {
			if(files[0].video_url){
				ChatService.getVideo(files[0].id).then(function(response){
					if(response.status && response.is_coded){
						$scope.mainImageInPopup = null;
						$scope.mainVideoInPopup = files[0].video_url;
						$scope.notCodedmessage = false;
					}else{
						$scope.mainImageInPopup = null;
						$scope.mainVideoInPopup = null;
						$scope.notCodedmessage = true;
					}
				},
				function(error){
					console.log(error);
				});
			}else{
				$scope.notCodedmessage = false;
				$scope.mainVideoInPopup = null;
				$scope.mainImageInPopup = files[0].url;
			}
			$scope.imagesInPopup = files;
			angular.element(document.querySelector('.view-publication')).addClass('posFixedPopup');
			ngDialog.open({
				template: '../app/User/views/popup-comment-images.html',
				className: 'popup-comment-images ngdialog-theme-default',
				scope: $scope,
				data: {
					files: files
				},
				preCloseCallback: function (value) {
					angular.element(document.querySelector('.view-publication')).removeClass('posFixedPopup');
				}
			});
		};

		$scope.statusLoading = true;
		$scope.busyMessages = false;
		$scope.loadMoreMessages = function () {
			var deferred = $q.defer();
			var members = [];
			members[0] = vm.myId;
			var data = {
				room_id: vm.group.room_id,
				offset: $scope.counter,
				limit: 10,
				members: members
			};
			if ($scope.messages !== undefined && $scope.messages.length !== 0 && $scope.busyMessages !== true && $scope.statusLoading) {
				$scope.busyMessages = true;
				socket.emit("load more messages", data);
			} else {
				deferred.reject();
			}
			return deferred.promise;
		};
		socket.on("load more messages", function (response) {
			if (response.messages.length === 0) {
				$scope.statusLoading = false;
				$scope.counter = 0;
			} else {
				$scope.busyMessages = false;
				response.messages.forEach(function (value) {
					$scope.messages.unshift(value);
				});
				$scope.returnToBack(response.messages[0].id);
				$scope.counter += 10;
			}
		});
		var getGroupChatDialogue = {
			room_id: vm.group.room_id,
			offset: 0,
			limit: 10,
			userId: $scope.loggedUserId
		};
		$scope.beforeChange = function (files) {
			$scope.files = files;
		};
		$scope.limit = 6;
		$scope.returnToBack = function (messageId) {
			$location.hash(messageId + "");
		};
		$scope.deleteChatFiles = function (files, index) {
			files.splice(index, 1);
		}
		socket.emit("get group chat dialogue", getGroupChatDialogue);
		socket.forward('get group chat dialogue', $scope);
		$scope.$on("socket:get group chat dialogue", function(event, response){
			$scope.messages = response.messages.reverse();
		});
		socket.forward('updatechat', $scope);
		$scope.$on('socket:updatechat', function (event, data) {
			if (data.isRead) {
				if (data.userId !== $scope.loggedUserId) {
					$scope.messages.forEach(function (value) {
						value.isRead = false;
					});
				}
			} else {
				if($scope.messageVideos.length > 0){
					ChatService.sendVideos(data.id, $scope.messageVideos).then(function(response){
						$scope.messageVideos = [];
						if(response.data.status){
							$scope.sendMessageLoader = false;
							data.videos = [];
							Object.keys(response.data).forEach(function(value){
								if(response.data[value] !== true){
									data.videos.push(response.data[value]);
								}
							});
							if(data.login === vm.loggedUser){
								data.isRead = true;
							}else{
								$scope.messages.forEach(function (value) {
									value.isRead = false;
								});
							}
							$scope.messages.push(data);
							if (data.images.length > 0) {
								vm.group.count_chat_files += data.images.length;
							}
							vm.group.count_chat_message++;
						}
					},
					function(error){
						console.log(error);
					});
				}else{
					data.videos = [];
					if (data.login === vm.loggedUser) {
						data.isRead = true;
					} else {
						$scope.messages.forEach(function (value) {
							value.isRead = false;
						});
					}
					$scope.messages.push(data);
					if (data.images.length > 0) {
						vm.group.count_chat_files += data.images.length;
					}
					vm.group.count_chat_message++;
				}
			}
		});
		$scope.emojiMessage = {
			replyToUser: function () {
				$scope.sendMessage($scope.emojiMessage.messagetext, vm.group.room_id, $scope.files);
			}
		};

		$scope.checkMessageType = function (message) {
			var regExp = "^http://" + $location.host();
			var match = (new RegExp(regExp)).exec(message.text);
			if (match) {
				var publicationUrl = match.input.split("/publication/");
				if (publicationUrl[1]) {
					message.pub = {};
					message.type = 'pub';
					message.pub.username = message.login;
					message.pub.id = parseInt(publicationUrl[1]);
				}
			}
		};

		$scope.loadPubIntoChat = function (message, pubId) {
			if (pubId != undefined) {
				PublicationService.getSinglePublication(pubId).then(function (response) {
						message.pub = response;
					},
					function (error) {
						console.log(error);
					});
			}
		};
		function checkURL(url){
			return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
		}
		$scope.sendMessage = function (messageText, roomId, files) {
			$scope.disabledSendMessage = true;
			if (files !== undefined) {
				var imagesObj = {
					imageName: [],
					imageType: [],
					images: []
				};
				files.forEach(function (value) {
					if(checkURL(value.name)){
						imagesObj.imageName.push(value.name);
						imagesObj.imageType.push(value.type);
						imagesObj.images.push(value);
					}else{
						$scope.sendMessageLoader = true;
						$scope.messageVideos.push(value);
					}
				});
			}
			var data = {
				userId: vm.myId,
				room_id: roomId,
				message: messageText ? messageText : "",
				imagesObj: imagesObj !== "" ? imagesObj : undefined
			};
			socket.emit('send message', data, function () {
				if (files) {
					files.length = 0;
				}
				$scope.emojiMessage.rawhtml = "";
				data.message = "";
				imagesObj = {
					imageName: [],
					imageType: [],
					images: []
				};
				if (data.message === "" && $scope.emojiMessage.rawhtml === "") {
					setTimeout(function () {
						$scope.disabledSendMessage = false;
					}, 200);
				}
			});
		};

		//pub share
		var sharePublication;
		$scope.sharePub = function (pubId) {
			sharePublication = ngDialog.open({
				template: '../app/Groups/views/popup-sharepub-group.html',
				className: 'share-publication ngdialog-theme-default',
				scope: $scope,
				preCloseCallback: resetFormInviteUsers,
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
						console.log(response);
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

		$scope.shareData = [];
		$scope.change = function (data, active) {
			if (active) {
				$scope.shareData.push(data);
			} else {
				$scope.shareData.splice($scope.shareData.indexOf(data), 1);
			}
		};
		$scope.closeSharePopup = function () {
			sharePublication.close();
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
		//end of pub share

	}

})(angular);
