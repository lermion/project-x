(function (angular) {

	'use strict';

	angular
		.module('app.components')
		.component('pubEdit', {
			bindings: {
				pubData: '<'
			},
			templateUrl: '../app/common/components/publication-edit/publication-edit.html',
			controller: function ($rootScope, $scope, $q, $state, $filter, $timeout, PublicationService, groupsService, placesService, storageService, ngDialog, Upload, $http) {
				var ctrl = this;

				ctrl.pub = {};
				ctrl.files = [];
				ctrl.newFiles = [];
				ctrl.checkedAreas = [];
				ctrl.newPub = {
					deleteImages: [],
					deleteVideos: []
				};

				ctrl.subForm = false;
				ctrl.isAnonym = false;

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

				ctrl.emojiMessage = {
					messagetext: '',
					rawhtml: ''
				};

				// Lifecycle hooks
				ctrl.$onInit = function (args) {

					ctrl.pub = angular.copy(ctrl.pubData);

					ctrl.avatar = getAvatarPath();
					ctrl.authorName = getAuthorName();
					ctrl.isFeed = $state.is('feed');
					ctrl.files = ctrl.pub.images.concat(ctrl.pub.videos);

					$timeout(function () {
						$(".ngdialog.user-publication-edit .emoji-wysiwyg-editor")[0].innerHTML = $filter('colonToSmiley')(ctrl.pub.text);
						ctrl.emojiMessage.messagetext = $filter('colonToSmiley')(ctrl.pub.text);
					}, 0);


				};

				ctrl.$onChanges = function (args) {
					//console.log('OnChanges');
				};

				ctrl.$onDestroy = function (args) {
					//console.log('OnDestroy');
				};

				ctrl.$postLink = function () {

				};




				ctrl.emojiMessage = {
					messagetext: ''
				};

				ctrl.ngDialog = ngDialog;


				ctrl.attachFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
					var defer = $q.defer();
					var prom = [];
					newFiles.forEach(function (image) {
						prom.push(resizeImage(image));
					});
					$q.all(prom).then(function (data) {
						angular.forEach(data, function (item) {
							ctrl.newFiles.push(item);
						});
						$scope.$broadcast('rebuild:me');
					});
				};

				ctrl.removeFile = function (index, isNewFile) {

					if (isNewFile) {
						ctrl.newFiles.splice(index, 1);
						ctrl.newPub.cover = null;

					} else {
						var file = ctrl.files[index];



						if (file.pivot.image_id) {
							ctrl.newPub.deleteImages.push(file.id);
						} else if (file.pivot.video_id) {
							ctrl.newPub.deleteVideos.push(file.id);
						}
						if (file.pivot.is_cover) {
							ctrl.pub.cover = null;
						}
						ctrl.files.splice(index, 1);
						ctrl.newPub.coverId = null;
					}
					$scope.$broadcast('rebuild:me');
				};

				function getScopes(){
					PublicationService.getScopes().then(function(data){
						ctrl.scopes = data;
						ctrl.scopes.forEach(function(value){
							if(value.signed){
								ctrl.checkedAreas.push(value.id);
								value.active = true;
							}
						});
					},
					function(error){
						console.log(error);
					});
				}

				ctrl.checkedScope = function(active, scope){
					if(active){
						if(ctrl.checkedAreas.length < 3){
							ctrl.checkedAreas.push(scope.id);
						}
					}else{
						ctrl.checkedAreas.splice(ctrl.checkedAreas.indexOf(scope.id), 1);
					}
				}

				getScopes();

				ctrl.setMainPubPhoto = function (index) {
					angular.forEach(ctrl.files, function (item) {
						item.isCover = false;
					});

					ctrl.files[index].isCover = true;

					ctrl.newPub.cover = ctrl.files[index];
				};

				function getBlobFromUrl(url, callback){
					return $http({
						url: url,
						method: "GET",
						responseType: "blob"
					}).success(function (value) {
						return callback(value);
					});
				}

				ctrl.setNewMainPubPhoto = function (index, isNewFile) {
					getBlobFromUrl(ctrl.files[index].original_img_url, function(value){
						var blob = new Blob([value], {type: value.type});
						blob.name = 'image';
						ctrl.coverToCrop = blob;
					});
					// prom.push(getBlobFromUrl(item, function (value) {
					// 	arr.push(value);
					// }));
					// angular.forEach(ctrl.newFiles, function (item) {
					// 	if (item.isCover) {
					// 		item.isCover = false;
					// 	}
					// });
					// angular.forEach(ctrl.files, function (item) {
					// 	item.pivot.is_cover = false;
					// 	item.isCover = false;
					// });

					// if (isNewFile) {
					// 	ctrl.newFiles[index].isCover = true;
					// 	ctrl.cover = ctrl.newFiles[index];
					// } else {
					// 	ctrl.files[index].isCover = true;
					// 	ctrl.files[index].pivot.is_cover = true;
					// 	if (ctrl.files[index].pivot.image_id) {
					// 		ctrl.pub.cover_image_id = ctrl.files[index].id;
					// 	} else {
					// 		ctrl.pub.cover_video_id = ctrl.files[index].id;
					// 	}
					// 	ctrl.pub.cover = null;
					// }
				};

				ctrl.updatePub = function () {

					if (ctrl.subForm) {
						return false;
					}

					ctrl.newPublicationForm.$setSubmitted();

					if (ctrl.files.length === 0 && ctrl.newFiles.length === 0) {
						ctrl.newPublicationForm.files1.$setValidity('required', false);
					} else {
						ctrl.newPublicationForm.files1.$setValidity('required', true);
					}

					if (ctrl.newPublicationForm.$invalid) {
						return false;
					}

					ctrl.subForm = true;

					var images = [],
						oldImages = [];
					var videos = [],
						oldVideos = [];

					var isMain;

					if ($state.is('feed')) {
						isMain = 1;
					} else {
						isMain = 0;
					}

					ctrl.newFiles.forEach(function (file) {
						var type = file.type.split('/')[0];
						if (type === 'image') {
							images.push(file);
						} else if (type === 'video') {
							videos.push(file);
						}
					});

					ctrl.files.forEach(function (file) {
						var type = file.pivot.image_id ? 'image' : 'video';
						if (type === 'image') {
							oldImages.push(file);
						} else if (type === 'video') {
							oldVideos.push(file);
						}
					});

					// если новая обложка не выбрана, а текущая обложка отсутствует (при редактировании удалили файл), то
					// обложка устанавливается автоматически
					if (!ctrl.cover && !ctrl.pub.cover && !ctrl.pub.cover_image_id && !ctrl.pub.cover_video_id) {

						// если нет видеофайлов, обложка = фото


						// 1. Если нет старых видео
						if (oldVideos.length === 0) {
							// если есть старые фото возьмем их id
							if (oldImages.length > 0) {
								ctrl.pub.cover_image_id = oldImages[0].id;
							}
						} else {
							ctrl.cover = ctrl.pub.cover_video_id = oldVideos[0].id
						}

						// 2. Если нет новых видео
						if (videos.length === 0) {
							// если есть фото сохраненные на сервере, то возьмем их id для установки обложкой
							if (images.length > 0) {
								ctrl.cover = images[0];
							}
						} else {
							ctrl.cover = videos[0];
						}
					}


					var newPublication = {
						id: ctrl.pub.id,
						text: ctrl.emojiMessage.messagetext,
						cover: ctrl.cover,
						cover_image_id: ctrl.pub.cover_image_id,
						cover_video_id: ctrl.pub.cover_video_id,
						images: images,
						videos: videos,
						deleteImages: ctrl.newPub.deleteImages,
						deleteVideos: ctrl.newPub.deleteVideos,
						isAnonym: ctrl.pub.is_anonym,
						isMain: isMain,
						inProfile: $state.is('user'),
						scopes: ctrl.checkedAreas

					};

					PublicationService.updatePublication(newPublication).then(function (data) {
						$rootScope.$broadcast('publication:update', {
							publication: data.publication
						});
						ctrl.subForm = false;
						ngDialog.closeAll();
					});
				};

				ctrl.getImageName = function (file) {
					var url = file.url || file.img_url;
					return url.split("/").pop();
				};

				function resizeImage(image) {
					return Upload.resize(image, 700, 395).then(function (resizedFile) {
						return resizedFile;
					});
				}

				function getAvatarPath() {

					var avatar;

					if (ctrl.pub.group) {
						avatar = ctrl.pub.group.card_avatar;
					}
					if (ctrl.pub.place) {
						avatar = ctrl.pub.place.avatar;
					}
					if ($state.is('user') || $state.is('feed')) {
						avatar = $rootScope.user.loggedUserAva;
					}
					return avatar;
				}

				function getAuthorName() {
					var name;

					if (ctrl.pub.group) {
						name = ctrl.pub.group.name;
					}
					if (ctrl.pub.place) {
						name = ctrl.pub.place.name;
					}
					if ($state.is('user') || $state.is('feed')) {
						name = $rootScope.user.fullName;
					}
					return name;
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

			}
		});
})(angular);