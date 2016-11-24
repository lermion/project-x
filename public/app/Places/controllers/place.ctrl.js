(function (angular) {
	'use strict';

	angular
		.module('app.places')
		.controller('PlaceCtrl', PlaceCtrl);

	PlaceCtrl.$inject = ['$q', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$filter', 'place', 'storageService', 'placesService', 'UserService', 'PublicationService', 'ngDialog',
		'$http', '$window', 'Upload', 'amMoment', 'socket', '$location', 'groupsService', 'md5', 'ChatService'];

	function PlaceCtrl($q, $rootScope, $scope, $state, $stateParams, $timeout, $filter, place, storageService, placesService, UserService, PublicationService, ngDialog,
					   $http, $window, Upload, amMoment, socket, $location, groupsService, md5, ChatService) {

		var vm = this;
		var storage = storageService.getStorage();

		var myId = +storage.userId;
		var myAvatar = storage.loggedUserAva;
		var firstName = storage.firstName;
		var lastName = storage.lastName;
		var login = storage.username;
		$scope.messageVideos = [];


		var modalEditPlace, modalDeletePlace, modalInviteUsers, modalCropLogoImage, modalMap,
			modalSetCreator, modalNewPublication, modalReviewPublication, map, modalAlertComment;

		var originalCities = [];

		var watchCountry, watchCity;


		vm.firstName = firstName;
		vm.lastName = lastName;
		vm.myAvatar = myAvatar;
		vm.myId = myId;
		vm.loggedUser = storage.username;

		vm.subForm = false;

		vm.inviteNotSend = true;

		vm.countries = [];
		vm.cities = [];

		vm.openModalDeletePlace = function(){
			modalDeletePlace = ngDialog.open({
				template: '../app/Places/views/popup-delete-place.html',
				name: 'modal-edit-group',
				className: 'popup-add-group popup-edit-place ngdialog-theme-default',
				scope: $scope
			});
		};


		vm.place = place;
		vm.placeEdited = angular.copy(vm.place);

		vm.newPublication = {};

		vm.selectedImage = null;
		vm.myCroppedImage = null;
		vm.blobImg = null;
		vm.selectedLogoImageName = '';

		vm.invitedUsers = [];

		vm.creator = {id: null};
		vm.isSend = false;

		vm.emojiMessage = {
			messagetext: '',
			rawhtml: ''
		};

		vm.userName = storage.username;

		vm.newPublicationForm = {};

		vm.files = [];

		vm.geoObject = {
			geometry: {
				type: 'Point',
				coordinates: []
			},
			properties: {}
		};
		vm.newComment = {};
		vm.showFullDescription = false;

		vm.complainIsSend = false;


		amMoment.changeLocale('ru');

		activate();

		///////////////////////////////////////////////////

		// set default tab (view) for place view
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
			var state = $state.current.name;

			if (state === 'place' && fromState.name === 'place.publications') {
				$state.go($rootScope.previousState, $rootScope.previousStateParams);
			}
			if (state === 'place.publications' && !$rootScope.isAuthorized) {
				$state.go('^');
			}
			if (state === 'place' && fromState.name !== 'place.publications' && $rootScope.isAuthorized) {
				$rootScope.previousState = fromState.name;
				$rootScope.currentState = toState.name;
				$rootScope.previousStateParams = fromParams;
				$state.go('place.publications');
			}
			if (state === 'place.edit') {
				setWatchers();
			} else if (state === 'place.files') {
				vm.chatFiles = $state.params.chatFiles;
				vm.mergedChatFiles = [].concat.apply([], vm.chatFiles);
				vm.itemsFiles = vm.mergedChatFiles.slice(0, 21);
			}

			vm.showPubSwitch = (state === 'place.publications' || state === 'group.publications');
		});


		// Modal windows
		vm.openModalEditPlace = function () {
			vm.placeEdited = angular.copy(vm.place);
			modalEditPlace = ngDialog.open({
				template: '../app/Places/views/popup-edit-place.html',
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
						template: '../app/Places/views/popup-invite-place.html',
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

		vm.openModalNewPublication = function () {
			modalNewPublication = ngDialog.open({
				template: '../app/common/views/publication-new.html',
				className: 'user-publication ngdialog-theme-default',
				scope: $scope,
				data: {
					place: vm.place
				},
				preCloseCallback: resetFormNewPublication
			});
		};

		vm.openModalReviewPublication = function (publication, index) {

			if (isMobile()) {

				$state.go('mobile-pub-view-test', {
					id: publication.id,
					prevState: {
						name: 'place',
						params: {
							placeName: vm.place.url_name
						}
					}
				});

			} else {

				$scope.indexCurrentPublication = index;
				getPublication(publication.id).then(function () {
					modalReviewPublication = ngDialog.open({
						template: '../app/common/views/pub-item-modal.html',
						name: 'modal-publication-group',
						className: 'view-publication ngdialog-theme-default',
						scope: $scope,
						data: {
							pub: publication
						},
						preCloseCallback: function () {
							// TODO: появляется дополнительная публикация и сразу пропадает
							//vm.place.publications[index] = vm.activePublication;
						}
					});
				});


			}

		};

		vm.openModalPublication = function (pub, index) {
			if (isMobile()) {

				$state.go('mobile-pub-view-test', {
					id: pub.id,
					prevState: {
						name: 'place',
						params: {
							placeName: vm.place.url_name
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
						pubList: vm.place.publications,
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

		vm.openModalImageFullSize = function (url, isCover) {

			if (!url) {
				url = isCover ? vm.place.cover : vm.place.avatar;
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

		vm.submitNewPublication = function () {
			vm.newPublicationForm.$setSubmitted();
			if (vm.newPublicationForm.$invalid || vm.files && vm.files.length === 0) {
				return false;
			}
			vm.subForm = true;
			vm.newPublication.text = vm.emojiMessage.messagetext;
			vm.newPublication.files = filterAttachFilesByType();
			vm.newPublication.placeId = vm.place.id;

			if (!vm.newPublication.cover) {
				//TODO: separate files by type
				vm.newPublication.cover = vm.files[0];
			}

			placesService.addPublication(vm.newPublication)
				.then(function (data) {
					if (data.status) {
						vm.place.publications.push(data.publication);
						vm.place.count_publications++;
						vm.subForm = false;
						modalNewPublication.close();
					}
				}, function () {
					vm.subForm = false;
				})
		};

		$rootScope.$on('publication:add', function(event, data) {
			vm.place.publications.push(data.publication);
			vm.place.count_publications++;
		});

		$rootScope.$on('publication:update', function(event, data) {
			angular.forEach(vm.place.publications, function (item, index, arr) {
				if (item.id === data.publication.id) {
					arr[index] = data.publication;
				}
			});
		});

		$rootScope.$on('publication:delete', function(event, data) {
			angular.forEach(vm.place.publications, function (item, index, arr) {
				if (item.id === data.pubId) {
					arr.splice(index, 1);
					vm.place.count_publications--;
				}
			});
		});

		vm.updatePlace = function () {

			vm.placeEditedForm.$setSubmitted();

			if (vm.placeEditedForm.$invalid) {
				return false;
			}

			vm.subForm = true;

			var placeEdited = angular.copy(vm.placeEdited);
			place = angular.copy(vm.placeEdited);
			console.log(vm.placeEditedForm.logo);
			if (!vm.placeEditedForm.logo.$dirty) {
				placeEdited.avatar = null;
			}
			if (!vm.placeEditedForm.cover.$dirty) {
				placeEdited.cover = null;
			}
			if (!vm.placeEditedForm.name.$dirty) {
				placeEdited.name = null;
			}

			if (placeEdited.expired_date) {
				placeEdited.expired_date = moment(placeEdited.expired_date).format('YYYY-MM-DD');
			}

			placeEdited.scopes = vm.checkedAreas;

			placesService.updatePlace(placeEdited)
				.then(function (data) {
					if (data.status) {
						if (data.placeData.avatar) {
							place.avatar = data.placeData.avatar;
						}
						if (data.placeData.cover) {
							place.cover = data.placeData.cover;
						}
						vm.place = place;
						if (data.placeData.url_name) {
							place.url_name = data.placeData.url_name;
							changePlaceUrlName(data.placeData.url_name);
						} else {
							originalCities = angular.copy(vm.cities);
							$state.go('place', {'placeName': place.url_name});
							$timeout(function () {
								vm.subForm = false;
							}, 0);
						}
					}
				});
		};

		vm.removeAttachFile = function (index) {
			vm.files.splice(index, 1);
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



		vm.addNewComment = function (flag, pub, pubText, files) {
			vm.commentForm.$setSubmitted();
			if (vm.commentForm.$invalid) {
				return false;
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

			vm.newComment.text = vm.emojiMessage.messagetext;
			if (images.length === 0 && videos.length === 0 && vm.newComment.text === '') {
				return false;
			}
			vm.subForm = true;

			PublicationService.addCommentPublication(pub.id, vm.newComment.text, images, videos).then(function (response) {
					vm.showAddComment = false;
					vm.disableAddComment = false;
					if (response.data.status) {
						$(".emoji-wysiwyg-editor").html("");
						if (flag === "feedPage") {
							pub.files = [];
							vm.newComment.text = '';
							vm.emojiMessage.messagetext = '';
							pub.comments.push(response.data.comment);
							pub.comment_count++;
						}
					}
					vm.commentForm.$setPristine();
					vm.subForm = false;
				},
				function (error) {
					console.log(error);
					vm.subForm = false;
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

		$scope.showFullComment = function (comment) {
			comment.commentLength = comment.text.length;
		};

		$scope.getPubText = function (text) {
			if (text != undefined) {
				var mes = text.split(' messagetext: ');
				return mes[1];
			}
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
				template: '../app/Places/views/alert-publication.html',
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
				template: '../app/Places/views/delete-publication.html',
				className: 'delete-publication place ngdialog-theme-default',
				scope: $scope
			});
		};





		vm.openPubComplainBlock = function (pubId) {
			modalAlertComment = ngDialog.open({
				template: '../app/Places/views/alert-publication.html',
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

			var defer = $q.defer();

			var prom = [];

			prom.push(getSubscribers());
			prom.push(getSubscription());

			$q.all(prom).then(function () {
				ngDialog.open({
					template: '../app/Places/views/popup-sharepub-place.html',
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
			vm.emojiMessage.messagetext = vm.pubEdited.text;

			editPubPopup = ngDialog.open({
				template: '../app/Places/views/popup-edit-publication.html',
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
			console.log(searchParam.indexOf("#"));
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

		vm.saveEditedPub = function (pubId, pubText, files) {
			vm.pubEdited.description = vm.emojiMessage.messagetext;
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

		vm.deletePlace = function () {
			placesService.deletePlace(vm.place.id)
				.then(function (data) {
					if (data.status) {
						$state.go('places');
						modalDeletePlace.close();
					}
				});
		};

		vm.abortUpdatePlace = function () {
			clearWatchers();
			resetFormPlaceEdit();
			$state.go('place', {'placeName': vm.place.url_name});
		};

		function getScopes(){
			placesService.getPlaceScopes(vm.place.id).then(function(data){
				vm.checkedAreas = [];
				vm.scopes = data;
				vm.scopes.forEach(function(value){
					if(value.signed){
						vm.checkedAreas.push(value.id);
						value.active = true;
					}
				});
			},
			function(error){
				console.log(error);
			});
		}

		getScopes();

		vm.openModalMap = function () {
			modalMap = ngDialog.open({
				template: '../app/Places/views/popup-map.html',
				name: 'modal-edit-group',
				className: 'popup-add-group place-map ngdialog-theme-default',
				scope: $scope
			});
		};

		vm.beforeInit = function () {
			var addressStr = vm.placeEdited.country.name + ' ' + vm.placeEdited.city.name;
			ymaps.geocode(addressStr, {results: 1}).then(function (res) {
				// Выбираем первый результат геокодирования.
				var firstGeoObject = res.geoObjects.get(0);
				// Задаем центр карты.
				$scope.$apply(function () {
					vm.center = firstGeoObject.geometry.getCoordinates();
				});
			}, function (err) {
				// Если геокодирование не удалось, сообщаем об ошибке.
				alert(err.message);
			});
		};

		vm.afterInit = function ($map) {
			map = $map;
		};

		vm.mapClick = function (e) {
			var coords = e.get('coords');
			vm.geoObject.geometry.coordinates = coords;

			// Отправим запрос на геокодирование.
			ymaps.geocode(coords).then(function (res) {
				var names = [];
				// Переберём все найденные результаты и
				// запишем имена найденный объектов в массив names.
				res.geoObjects.each(function (obj) {
					names.push(obj.properties.get('text'));
				});
				vm.placeEdited.address = names[0];

				// Добавим на карту метку в точку, по координатам
				// которой запрашивали обратное геокодирование.
				var geoObj = {
					geometry: {
						type: 'Point',
						coordinates: coords
					},
					properties: {
						// В качестве контента иконки выведем
						// первый найденный объект.
						iconContent: names[0],
						// А в качестве контента балуна - подробности:
						// имена всех остальных найденных объектов.
						balloonContent: names.reverse().join(', ')
					}
				};

				vm.placeEdited.coordinates_x = geoObj.geometry.coordinates[0];
				vm.placeEdited.coordinates_y = geoObj.geometry.coordinates[1];
				$scope.$apply(function () {
					vm.geoObject = geoObj;
				});
			});
		};

		vm.abortDeletePlace = function () {
			modalDeletePlace.close();
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
			placesService.inviteUsers(vm.place.id, vm.invitedUsers)
				.then(function (data) {
					if (data.status) {
						vm.inviteNotSend = false;

						angular.forEach(vm.invitedUsers, function (item, i, arr) {
							vm.place.users.push({
								avatar_path: item.avatar,
								first_name: item.firstName,
								id: item.userId,
								is_admin: item.isAdmin,
								last_name: item.lastName
							});
						});
						vm.place.count_users += vm.invitedUsers.length;
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
			if (!vm.place.is_creator || (vm.place.is_creator && user.id === myId)) {
				return false;
			}
			placesService.setAdmin(vm.place.id, user.id)
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
			placesService.setCreator(vm.place.id, vm.creator.id)
				.then(function (data) {
					if (data.status) {
						vm.isSend = true;
						$timeout(function () {
							resetFormSetCreator();
							modalSetCreator.close();
							$state.go('places');
						}, 2000);
					}
				});
		};

		vm.abortSetCreator = function () {
			resetFormSetCreator();
			modalSetCreator.close();
		};

		vm.changePlaceCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			if (file) {
				// For show on the form
				Upload.resize(file, 218, 220, 1, null, null, true).then(function (resizedFile) {
					vm.placeEdited.coverPreviewToShow = resizedFile;
				});

				var isCoverCropMode = true;

				openModalCropAvatarImage(file.name, event, isCoverCropMode);
			}
		};

		vm.changePlaceAvatarFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
			if (file) {
				var isCoverCropMode = false;
				openModalCropAvatarImage(file.name, event, isCoverCropMode);
			}

		};

		vm.saveCropp = function (croppedDataURL, isCoverCrop) {
			console.log(isCoverCrop);
			var blob = Upload.dataUrltoBlob(croppedDataURL, vm.selectedLogoImageName);

			if (isCoverCrop) {
				Upload.imageDimensions(blob).then(function (dimensions) {
					console.info('Place: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				vm.placeEdited.cover = blob;
				vm.placeEdited.coverPreview = vm.placeEdited.coverPreviewToShow;
				vm.placeEditedForm.cover.$setValidity('required', true);
				vm.placeEditedForm.cover.$valid = true;
			} else {
				Upload.imageDimensions(blob).then(function (dimensions) {
					console.info('Place: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				vm.placeEdited.logo = blob;
				vm.placeEditedForm.logo.$setValidity('required', true);
				vm.placeEditedForm.logo.$valid = true;
			}

			modalCropLogoImage.close();
		};

		vm.showUsersForInvite = function (user) {
			var result = true;

			for (var i = 0; i < vm.place.users.length; i++) {
				if (user.id === vm.place.users[i].id) {
					result = false;
					break;
				}
			}

			return result;
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

		vm.addPublicationLike = function () {
			vm.activePublication.user_like = !vm.activePublication.user_like;
			vm.activePublication.like_count = vm.activePublication.user_like ? ++vm.activePublication.like_count : --vm.activePublication.like_count;
			PublicationService.addPublicationLike(vm.activePublication.id).then(function (response) {
					vm.activePublication.user_like = response.user_like;
					vm.activePublication.like_count = response.like_count;
				},
				function (error) {
					console.log(error);
				});
		};


		vm.subscribe = function () {
			if (place.is_creator) {
				openModalSetCreator();
			} else {
				placesService.subscribePlace(vm.place.id)
					.then(function (data) {
						if (data.status) {
							vm.place.is_sub = data.is_sub;
							if (data.is_sub) {
								vm.place.users.push({
									avatar_path: myAvatar,
									first_name: firstName,
									last_name: lastName,
									id: myId,
									is_admin: false,
									login: login
								});
								vm.place.count_users++;
							} else {
								unsubscribe({userId: myId});
								vm.place.count_users--;
							}

						}
					});
			}

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

		vm.loadMoreFiles = function () {
			vm.limitToFiles += 1;
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
				storageService.setStorageItem('pubView', 'greed');
			} else {
				vm.photosGrid = false;
				storageService.setStorageItem('pubView', 'list');
			}
		};

		vm.setMainPubPhoto = function (index) {
			angular.forEach(vm.files, function (item) {
				item.isCover = false;
			});
			vm.files[index].isCover = true;
			vm.newPublication.cover = vm.files[index];
			//resizePubCoverImage(vm.files[index]).then(function (image) {
			//    vm.newPublication.cover = image;
			//});
		};

		vm.isChatState = function () {
			return $state.is('place.chat');
		};


		function activate() {
			init();
			checkPublicationsView();
			getCountries();
			getCities(vm.place.country.id).then(saveOriginalCities);
			getDynamicPlaceType();

			//TODO: refact!
			if (vm.placeEdited.is_dynamic) {
				vm.placeEdited.expired_date = new Date(vm.placeEdited.expired_date);
			}
		}

		function init() {
			$scope.$emit('userPoint', 'user');
			var storage = storageService.getStorage();
			//vm.loggedUser = storage.username;

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
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 42) / 4;
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

		function setWatchers() {
			watchCountry = $scope.$watch(angular.bind(vm, function () {
				return vm.placeEdited.country;
			}), function (newCountry, oldCountry) {
				if (newCountry && oldCountry && newCountry.id !== oldCountry.id) {
					getCities(newCountry.id);
					vm.placeEdited.address = null;
				}
			});
			watchCity = $scope.$watch(angular.bind(vm, function () {
				return vm.placeEdited.city;
			}), function (newCity, oldCity) {
				if (newCity && oldCity && newCity.id !== oldCity.id) {
					vm.placeEdited.address = null;
				}
			});
		}

		function clearWatchers() {
			watchCountry();
			watchCity();
		}

		function saveOriginalCities() {
			originalCities = angular.copy(vm.cities);
		}

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

		function resetFormInviteUsers() {
			vm.invitedUsers = [];
			vm.subscribers = [];
			vm.subscription = [];
			vm.inviteNotSend = true;
		}

		function resetFormSetCreator() {
			vm.adminsList = [];
			vm.creator.id = null;
		}

		function resetFormNewPublication() {
			vm.newPublication = {};
			vm.files = [];
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


		function removeUser(user) {
			var arr = [];
			var indexToRemove;
			for (var i = vm.place.users.length - 1; i >= 0; i--) {
				if (vm.place.users[i].id == user.userId) {
					if (user.isAdmin && vm.place.is_creator || !user.isAdmin && vm.place.is_admin || user.userId === myId) {
						arr.push(user.userId);
						indexToRemove = i;
						placesService.removeUsers(vm.place.id, arr)
							.then(function (data) {
								if (data.status) {
									vm.place.users.splice(indexToRemove, 1);
									vm.place.count_users--;
								}
							});
					}

				}
			}
		}

		function changePlaceUrlName(str) {
			var url = window.location.toString();
			var pathArray = window.location.href.split('/');
			var urlNamePos = pathArray.indexOf('place');
			pathArray[urlNamePos + 1] = str;
			pathArray.splice(pathArray.length - 1, 1);

			var newPathname = '';
			for (var i = 0; i < pathArray.length; i++) {
				newPathname += pathArray[i];
				newPathname += "/";
			}
			window.location = newPathname.substring(0, newPathname.length - 1);
		}

		function getPlace() {
			placesService.getPlace(place.url_name)
				.then(function (data) {
					if (data) {
						vm.place = data;
					}
				});
		}

		function openModalSetCreator() {
			vm.adminsList = getAdminsList();
			modalSetCreator = ngDialog.open({
				template: '../app/Places/views/popup-setcreator-place.html',
				name: 'modal-setcreator-group',
				className: 'popup-setcreator-group ngdialog-theme-default',
				scope: $scope
			});
		}

		function getAdminsList() {
			return vm.place.users.filter(function (item) {
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

		function openModalCropAvatarImage(fileName, e, isCover) {
			var file = e.currentTarget.files[0];
			if (file) {
				var reader = new FileReader();

				reader.onload = function (e) {
					$scope.$apply(function ($scope) {
						vm.selectedLogoImage = e.target.result;
						vm.selectedLogoImageName = fileName;
						modalCropLogoImage = ngDialog.open({
							template: '../app/Places/views/popup-crop-image.html',
							className: 'settings-add-ava ngdialog-theme-default',
							scope: $scope,
							data: {isCover: isCover}
						});
					});
				};

				reader.readAsDataURL(file);
			}
		}

		function resetFormPlaceEdit() {
			vm.placeEdited = angular.copy(vm.place);
			vm.cities = angular.copy(originalCities);
			vm.placeEditedForm.$setPristine();
		}

		function getCities(countryId) {
			return placesService.getCities(countryId).then(
				function (data) {
					vm.cities = data;
				}
			);
		}

		function getCountries() {
			placesService.getCountries().then(
				function (data) {
					vm.countries = data;
				}
			);
		}

		function getDynamicPlaceType() {
			placesService.getPlaceTypeDynamic()
				.then(function (data) {
					vm.typeDynamic = data;
				});
		}

		function unsubscribe(user) {
			for (var i = vm.place.users.length - 1; i >= 0; i--) {
				if (vm.place.users[i].id == user.userId) {
					vm.place.users.splice(i, 1);
					vm.place.count_users--;
					break;
				}
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

			angular.forEach(vm.place.users, function (el, i) {
				groupUsersIds[el.id] = vm.place.users[i];
			});

			for (var prop in subUsersIds) {
				if (!groupUsersIds.hasOwnProperty(prop)) {
					result.push(subUsersIds[prop]);
				}
			}

			return result.length > 0;
		}

		function isMobile() {
			var screenWidth = $window.innerWidth;
			return screenWidth < 768;
		}

		function checkPublicationsView() {
			if (!storage.pubView) {
				storageService.setStorageItem('pubView', 'greed');
				storage = storageService.getStorage();
			} else {
				if (storage.pubView === 'greed') {
					vm.photosGrid = true;
				} else if (storage.pubView === 'list') {
					vm.photosGrid = false;
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

		vm.citySelected = function (city) {
			if (city) {
				var cityObj = {
					countryId: vm.placeEdited.country.id,
					name: city.title
				};
				placesService.addCity(cityObj)
					.then(function (data) {
						if (data.status) {
							vm.placeEdited.city = {};
							vm.placeEdited.city.id = data.city_id;
							vm.placeEdited.city.name = city.title;
						}
					});
			}
		};

		function getCity(str) {
			return $http({
				method: 'GET',
				url: 'https://geocode-maps.yandex.ru/1.x/?format=json&results=5&geocode=' + vm.placeEdited.country.name + ', ' + str,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
				data: null,
				timeout: 1000
			})
				.then(getPublicationsComplete)
				.catch(getPublicationsFailed);

			function getPublicationsComplete(response) {
				return response.data;
			}

			function getPublicationsFailed(error) {
				console.error('XHR Failed for getPublications. ' + error.data);
			}
		}

		function resizeImage(image) {
			Upload.imageDimensions(image).then(function (dimensions) {
				console.info('Place publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
			});

			return Upload.resize(image, 700, 395).then(function (resizedFile) {
				Upload.imageDimensions(resizedFile).then(function (dimensions) {
					console.info('Place publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
				});
				vm.files.push(resizedFile);
			});
		}


		vm.searchCity = function (str) {

			var def = $q.defer();

			var matches = [];

			vm.cities.forEach(function (city) {
				if ((city.name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
					matches.push(city);
				}
			});

			if (matches.length === 0) {
				getCity(str)
					.then(function (data) {

						var arr = data.response.GeoObjectCollection.featureMember;

						arr.forEach(function (item) {
							var data = item.GeoObject.metaDataProperty.GeocoderMetaData;
							if (data.kind === 'locality') {
								var cityName = data.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName;
								matches.push({
									name: cityName
								});
							}
						});

						def.resolve(matches);
					})
			} else {
				def.resolve(matches);
			}

			return def.promise;


		};

		$scope.indexCurrentImage = 0;
		$scope.openPreviousInfo = function (images) {
			if (images.length >= 1) {
				$scope.indexCurrentImage--;
				if (images[$scope.indexCurrentImage] !== undefined) {
					vm.mainImage = images[$scope.indexCurrentImage].url;
				} else {
					if ($scope.indexCurrentPublication !== 0) {
						vm.place.publications.sort(dynamicSort("created_at"));
						vm.activePublication = vm.place.publications[$scope.indexCurrentPublication -= 1];
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
					if ($scope.indexCurrentPublication + 1 !== vm.place.publications.length) {
						vm.place.publications.sort(dynamicSort("created_at"));
						vm.activePublication = vm.place.publications[$scope.indexCurrentPublication += 1];
						if (vm.activePublication.images[0] !== undefined) {
							vm.mainImage = vm.activePublication.images[0].url;
							$scope.indexCurrentImage = 0;
						}
					}
				}
			}
		};

		//chat

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
			$scope.isNeededScroll = function(){
				return false;
			};
			var deferred = $q.defer();
			var members = [];
			members[0] = vm.myId;
			var data = {
				room_id: vm.place.room_id,
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
				var mesId = $scope.messages[$scope.messages.length - 1].id;
				var elemContainer = angular.element(document).find('.group-chat-inner')[0];
				var elem = angular.element(document).find('#' + mesId)[0];
				response.messages.forEach(function(value){
					$scope.messages.unshift(value);
				});
				angular.element(elemContainer)[0].scrollTop = ($scope.messages.length - 1) * elem.offsetHeight;
				$scope.counter += 10;
			}
		});
		var getPlaceChatDialogue = {
			room_id: vm.place.room_id,
			offset: 0,
			limit: 10
		};
		$scope.beforeChange = function (files) {
			$scope.files = files;
		};
		$scope.limit = 6;
		$scope.deleteChatFiles = function (files, index) {
			files.splice(index, 1);
		}
		socket.emit("get group chat dialogue", getPlaceChatDialogue);
		socket.forward('get group chat dialogue', $scope);
		$scope.$on("socket:get group chat dialogue", function(event, response){
			$scope.messages = response.messages.reverse();
			$scope.isNeededScroll = function(){
				return $scope.messages;
			}
		});
		socket.forward('updatechat', $scope);
		$scope.$on('socket:updatechat', function (event, data) {
			if(data.isRead){
				if (data.userId !== $scope.loggedUserId) {
					$scope.messages.forEach(function (value) {
						value.isRead = false;
					});
				}
			}else{
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
							$scope.isNeededScroll = function(){
								return $scope.messages;
							};
							if (data.images.length > 0) {
								vm.place.count_chat_files += data.images.length;
							}
							vm.place.count_chat_message++;
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
					$scope.isNeededScroll = function(){
						return $scope.messages;
					};
					if (data.images.length > 0) {
						vm.place.count_chat_files += data.images.length;
					}
					vm.place.count_chat_message++;
				}
			}
		});
		$scope.emojiMessage = {
			replyToUser: function () {
				$scope.sendMessage($scope.emojiMessage.messagetext, vm.place.room_id, $scope.files);
			}
		};
		$scope.checkMessageType = function (message) {
			var regExp = "^" + $location.protocol() + "://" + $location.host();
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
						message.pub.files = response.images.concat(response.videos);
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
		}

		//pub share
		var sharePublication;
		$scope.sharePub = function (pubId) {
			sharePublication = ngDialog.open({
				template: '../app/Places/views/popup-sharepub-place.html',
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

})
(angular);