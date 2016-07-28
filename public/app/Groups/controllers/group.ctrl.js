(function (angular) {
	'use strict';

	angular
		.module('app.groups')
		.controller('GroupCtrl', GroupCtrl);

	GroupCtrl.$inject = ['$filter', '$timeout', '$scope', '$state', '$stateParams', 'group', '$http', '$window',
		'AuthService', 'storageService', 'ngDialog', 'groupsService', 'UserService', 'PublicationService', 'Upload', 'amMoment', 'socket', '$q'];

	function GroupCtrl($filter, $timeout, $scope, $state, $stateParams, group, $http, $window,
					   AuthService, storageService, ngDialog, groupsService, UserService, PublicationService, Upload, amMoment, socket, $q) {

		var vm = this;
		var storage = storageService.getStorage();

		var myId = +storage.userId;
		var myAvatar = storage.loggedUserAva;
		var firstName = storage.firstName;
		var lastName = storage.lastName;

		var modalEditGroup, modalDeleteGroup, modalInviteUsers,
			modalSetCreator, modalNewPublication, modalReviewPublication, modalCropImage;
		var groupName = $stateParams.groupName;

		var newPublicationObj = {
			groupId: group.id,
			text: ''
		};


		vm.firstName = firstName;
		vm.lastName = lastName;
		vm.myAvatar = myAvatar;
		vm.myId = myId;


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

		$scope.myImage = null;
		$scope.myCroppedImage = null;
		$scope.blobImg = null;

		amMoment.changeLocale('ru');

		activate();

		/////////////////////////////////////////////////

		function activate() {
			init();
            checkSearch();
		}

		function init() {
			$scope.$emit('userPoint', 'user');
			var storage = storageService.getStorage();
			vm.loggedUser = storage.username;

			$http.get('/static_page/get/name')
				.success(function (response) {
					vm.staticPages = response;
				})
				.error(function (error) {
					console.log(error);
				});
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
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 21) / 4;
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
		$scope.$on("$stateChangeSuccess", function () {
			var state = $state.current.name;
			if (state === 'group') {
				$state.go('group.publications');
			}
		});
		$scope.$on('ngDialog.opened', function (e, $dialog) {
			if ($dialog.name === "modal-edit-group") {
				$(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML = $filter('colonToSmiley')(vm.groupEdited.description);
			}

			if ($dialog.name === "modal-edit-publication") {
				$(".ngdialog.user-publication-edit .emoji-wysiwyg-editor")[0].innerHTML = $filter('colonToSmiley')(vm.pubEdited.text);
			}
		});


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

		vm.openModalDeleteGroup = function () {
			modalDeleteGroup = ngDialog.open({
				template: '../app/Groups/views/popup-delete-group.html',
				name: 'modal-delete-group',
				className: 'popup-delete-group ngdialog-theme-default',
				scope: $scope
			});
		};

		vm.openModalInviteUsers = function () {
			getSubscribers().then(function () {
				getSubscription().then(function () {
					modalInviteUsers = ngDialog.open({
						template: '../app/Groups/views/popup-invite-group.html',
						name: 'modal-invite-group',
						className: 'popup-invite-group ngdialog-theme-default',
						scope: $scope
					});
				});

			});
		};

		vm.openModalNewPublication = function () {
			modalNewPublication = ngDialog.open({
				template: '../app/Groups/views/popup-add-publication.html',
				name: 'modal-publication-group',
				className: 'user-publication group-pub ngdialog-theme-default',
				scope: $scope,
				preCloseCallback: resetFormNewPublication
			});
		};

		vm.openModalReviewPublication = function (id) {
			getPublication(id).then(function () {
				modalReviewPublication = ngDialog.open({
					template: '../app/Groups/views/popup-view-group-publication.html',
					name: 'modal-publication-group',
					className: 'view-publication ngdialog-theme-default',
					scope: $scope
				});
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
			groupsService.addPublication(vm.newPublication)
				.then(function (data) {
					if (data.status) {
						vm.group.publications.push(data.publication);
						modalNewPublication.close();
					}
				})
		};


		//New publication
		vm.removeAttachFile = function (index) {
			vm.files.splice(index, 1);
			$scope.$broadcast('rebuild:me');
		};

		vm.beforeAttachFileToPublication = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			if (vm.files.length > 4 || files > 4) {
				$scope.$broadcast('rebuild:me');
			}
		};

		vm.addNewComment = function (flag, pub, pubText, files) {
			vm.disableAddComment = true;
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

			PublicationService.addCommentPublication(pub.id, vm.newComment.text, images, videos).then(function (response) {
					vm.showAddComment = false;
					vm.disableAddComment = false;
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
				template: '../app/Feed/views/alert-publication.html',
				className: 'alert-publication ngdialog-theme-default',
				scope: $scope,
				data: {
					id: commentId,
					flag: 'comment'
				}
			});
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
		};

		vm.deletePub = function (pub) {
			vm.pubToDelete = pub.id;
			ngDialog.open({
				template: '../app/Groups/views/delete-publication.html',
				className: 'delete-publication ngdialog-theme-default',
				scope: $scope
			});
		};

		vm.confirmPubDelete = function (pubId) {
			PublicationService.deletePublication(pubId).then(function (res) {
					if (res.status) {
						angular.forEach(vm.group.publications, function (item, index, arr) {
							if (item.id === pubId) {
								arr.splice(index, 1);
							}
						});
					}
					ngDialog.closeAll();
				},
				function (err) {
					console.log(err);
				});
		};

		vm.openPubComplainBlock = function (pubId) {
			ngDialog.open({
				template: '../app/Groups/views/alert-publication.html',
				className: 'alert-publication ngdialog-theme-default',
				scope: $scope,
				data: {
					id: pubId,
					flag: 'pub'
				}
			});
		};

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
								ngDialog.closeAll();
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
				ngDialog.closeAll();
				// 			} else {
				// 				console.log('Error');
				// 			}
				// 		},
				// 		function(err){
				// 			console.log(err);
				// 		});
			}
		};

		vm.getPubLink = function (pub) {
			var pathArray = window.location.href.split('/');
			pathArray.splice(pathArray.length - 1, 1, 'pub');
			pathArray.push(pub.id);

			var newPathname = "";
			for (var i = 0; i < pathArray.length; i++) {
				newPathname += "/";
				newPathname += pathArray[i];
			}
			vm.pubLink = newPathname.substring(1);
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
			if (vm.groupEdited.description !== vm.emoji.emojiMessage.messagetext) {
				vm.forms.editGroup.$setDirty();
			}
			if (vm.forms.editGroup.$pristine) {
				return false;
			}

			if (vm.group.name === vm.groupEdited.name) {
				vm.groupEdited.name = null;
			}
			if (!vm.forms.editGroup.avatar.$dirty) {
				vm.groupEdited.avatar = null;
			}
			vm.groupEdited.description = vm.emoji.emojiMessage.messagetext;
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
									id: myId
								});
								vm.group.count_users += 1;
							} else {
								removeUser({userId: myId});
								vm.group.count_users -= 1;
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

		vm.setAdmin = function (user) {
			if (!vm.group.is_creator || (vm.group.is_creator && user.id === myId)) {
				return false;
			}
			groupsService.setAdmin(group.id, user.id)
				.then(function (data) {
					if (data.status) {
						user.is_admin = data.is_admin;
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
			Upload.resize(file, 700, 240, 1, null, null, true).then(function (resizedFile) {
				vm.groupEdited.avatar = resizedFile;
			});
			onFileSelected(event);
		};

		vm.changeMainFile = function (file, flag, pub) {
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

		vm.addPublicationLike = function (pub) {
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

		$scope.saveCropp = function (img, cropped) {

			var blobFile = blobToFile(cropped);

			blobFile.name = 'image';
			blobFile.lastModifiedDate = new Date();

			Upload.resize(blobFile, 200, 220, 1, null, null, true).then(function (resizedFile) {
				console.log(resizedFile);
				vm.groupEdited.card_avatar = resizedFile;
			});

			//$scope.newGroup.avatarCard = blobFile;

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
					if (data.images[0] !== undefined) {
						vm.mainImage = data.images[0].url;
					}
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
			pathArray[urlNamePos+1] = str;

			var newPathname = '';
			for (var i = 0; i < pathArray.length; i++) {

				newPathname += pathArray[i];
				newPathname += "/";
			}
			window.location = newPathname.substring(0, newPathname.length-1);
		}


		function removeUser(user) {
			var arr = [];
			var indexToRemove;
			for (var i = vm.group.users.length - 1; i >= 0; i--) {
				if (vm.group.users[i].id == user.userId) {
					if (user.isAdmin && vm.group.is_creator || !user.isAdmin && vm.group.is_admin || user.userId === myId) {
						arr.push(user.userId);
						indexToRemove = i;
						groupsService.removeUsers(vm.group.id, arr)
							.then(function (data) {
								if (data.status) {
									vm.group.users.splice(indexToRemove, 1);
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

		function onFileSelected(e) {
			var file = e.currentTarget.files[0];
			if (file) {
				var reader = new FileReader();

				reader.onload = function (e) {
					$scope.$apply(function ($scope) {
						$scope.myImage = e.target.result;
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

		//Chat

		$scope.counter = 0;
		$scope.scrollBottom = function(){
			setTimeout(function(){
				var chatWindow = angular.element(document.querySelector('.group-chat-inner'));
				var height = chatWindow[0].scrollHeight;
				chatWindow.scrollTop(height);
			}, 100);
		};
		$scope.loadMoreMessages = function(){
			var deferred = $q.defer();
			var data = {
				room_id: vm.group.room_id,
				offset: $scope.counter,
				limit: 10
			};
			if($scope.messages !== undefined && $scope.messages.length >= 10){
				socket.emit("load more messages", data);
			}else{
				deferred.reject();
			}
			return deferred.promise;
		};
		socket.on("load more messages", function(response){
			if(response.length === 0){
				$scope.counter = 0;
			}else{
				response.messages.forEach(function(value){
					$scope.messages.unshift(value);
				});
				$scope.counter += 10;
			}
		});
		var getGroupChatDialogue = {
			room_id: vm.group.room_id,
			offset: 0,
			limit: 10
		};
		$scope.beforeChange = function(files){
			$scope.files = files;
		};
		$scope.deleteChatFiles = function(files, index){
			files.splice(index, 1);
		}
		socket.emit("get group chat dialogue", getGroupChatDialogue);
		socket.on("get group chat dialogue", function(response){
			$scope.messages = response.messages.reverse();
		});
		socket.on('updatechat', function(response){
			$scope.messages.push(response);
			vm.group.count_chat_message++;
		});
		$scope.emojiMessage = {
		replyToUser: function(){
			$scope.sendMessage($scope.emojiMessage.messagetext, vm.group.room_id);
			}
		};
		$scope.checkMessageType = function(message){
			var regExp = /^http:\/\/pp.dev\/#\/(\w+)\/pub(lication)?\/(\d+)$/;
			var match = regExp.exec(message.text);
			if(match){
				message.type = 'pub';
				message.pub = {};
				message.pub.username = match[1];					
				message.pub.id = parseInt(match[3]);
			}			
		};
		$scope.loadPubIntoChat = function(message, pubId){
			if(pubId != undefined){
				PublicationService.getSinglePublication(pubId).then(function(response){
					message.pub = response;
				},
				function(error){
					console.log(error);
				});
			}
		};
		$scope.sendMessage = function(messageText, roomId, files){
			if(files !== undefined){
				var imagesObj = {
					imageName: [],
					imageType: [],
					images: files
				};
				files.forEach(function(value){
					imagesObj.imageName.push(value.name);
					imagesObj.imageType.push(value.type);
				});
			}
			var data = {
				userId: vm.myId,
				room_id: roomId,
				message: messageText,
				imagesObj: imagesObj
			};
			socket.emit('send message', data, function(){
				if(files){
					files.length = 0;
				}
				$scope.emojiMessage.rawhtml = "";
			});
		}

		//function getGroup() {
		//    return groupsService.getGroup(groupName)
		//        .then(function (data) {
		//            if (data) {
		//                vm.group = data;
		//                vm.group.is_open = !!vm.group.is_open;
		//                vm.group.avatarIsChange = false;
		//
		//                $scope.emoji.messagetext = data.description;
		//            } else {
		//                showNoticeGroupNotFound();
		//            }
		//        });
		//}

	}

})(angular);
