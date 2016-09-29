(function (angular) {

	'use strict';

	angular
		.module('app.components')
		.component('pubNew', {
			bindings: {
				group: '<',
				place: '<',
				profile: '<',
				feed: '<'
			},
			templateUrl: '../app/common/components/publication-new/publication-new.html',
			controller: function ($rootScope, $scope, $q, $state, $timeout, PublicationService, groupsService, placesService, storageService, ngDialog, Upload) {
				var ctrl = this;

				ctrl.pub = {};
				ctrl.files = [];
				ctrl.originalFiles = [];
				ctrl.subForm = false;
				ctrl.isAnonym = false;
				ctrl.checkedLimit = 3;
				ctrl.progressFilesLoading = false;

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

				ctrl.myCroppedImage = '';

				// Lifecycle hooks
				ctrl.$onInit = function (args) {
					ctrl.tooManyFilesRemove = false;
					ctrl.tooManyFiles = false;
					ctrl.avatar = getAvatarPath();
					ctrl.authorName = getAuthorName();
					ctrl.isFeed = $state.is('feed');
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


				ctrl.newPublicationForm = {};

				ctrl.emojiMessage = {
					messagetext: ''
				};

				ctrl.ngDialog = ngDialog;


				/**
				 * Adds files to the publication
				 * @param files
				 * @param file
				 * @param newFiles
				 * @param duplicateFiles
				 * @param invalidFiles
				 * @param event
				 */
				ctrl.attachFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
					ctrl.progressFilesLoading = true;
					ctrl.isFilesAdded = true;
					var defer = $q.defer();
					var prom = [];
					newFiles.forEach(function (image) {
						ctrl.originalFiles.push(image);
						prom.push(resizeImage(image));
					});
					$q.all(prom).then(function (data) {
						angular.forEach(data, function (item, index, array) {
							ctrl.files.push(item);
							ctrl.isFilesAdded = false;
						});
						if(ctrl.files.length > 20){
							ctrl.files = ctrl.files.splice(0, 20);
							ctrl.progressFilesLoading = false;
							ctrl.tooManyFilesRemove = true;
						}else{
							ctrl.tooManyFilesRemove = false;
						}
						var file = event.currentTarget.files[0];

							if (isImage(file) && ctrl.originalFiles.length === 1) {
								var reader = new FileReader();
								reader.onload = function (event) {
									var image = new Image();
									image.src = event.target.result;
									image.onload = function(){
										if(this.width < 700){
											ctrl.newPublicationForm.files1.$setValidity('minWidth', false);
										}else{
											ctrl.newPublicationForm.files1.$setValidity('minWidth', true);
										}
										if(this.height > this.width){
											ctrl.aspectRatio = 1.4;
										}else if(this.width === 1366 && this.height === 768){
											ctrl.aspectRatio = 2.5;
										}else{
											ctrl.aspectRatio = 1.7;
										}
										$scope.$apply(function($scope){
											ctrl.coverToCrop = event.target.result;
											ctrl.coverToCropName = file.name;
										});
									};
								};
								reader.readAsDataURL(file);
							}else{
								ctrl.newPublicationForm.files1.$setValidity('minWidth', false);
							}
						$scope.$broadcast('rebuild:me');
					});
				};

				ctrl.filesRendered = function(){
					ctrl.progressFilesLoading = false;
				}

				/**
				 * Removes files (originals and thumbnails) of publication
				 * @param index
				 */
				ctrl.removeFile = function (index) {
					if (ctrl.files[index].isCover) {
						ctrl.coverToCrop = null;
					}
					ctrl.files.splice(index, 1);
					ctrl.originalFiles.splice(index, 1);
					$scope.$broadcast('rebuild:me');
				};

				/**
				 * Sets the main image of publication
				 * @param index
				 */
				ctrl.setMainPubPhotoKey = false;
				ctrl.setMainPubPhoto = function (index) {
					var file = ctrl.files[index];

					angular.forEach(ctrl.files, function (item) {
						item.isCover = false;
					});
					ctrl.setMainPubPhotoKey = true;
					file.isCover = true;

					ctrl.cover = file;
					ctrl.coverToCropName = file.name;

					if (isImage(file)) {
						var file = ctrl.originalFiles[index];
						var reader = new FileReader();
						reader.onload = function (event) {
							var image = new Image();
							image.src = event.target.result;
							image.onload = function(){
								if(this.width < 700){
									ctrl.newPublicationForm.files1.$setValidity('minWidth', false);
								}else{
									ctrl.newPublicationForm.files1.$setValidity('minWidth', true);
								}
								if(this.height > this.width){
									ctrl.aspectRatio = 1.4;
								}else if(this.width === 1366 && this.height === 768){
									ctrl.aspectRatio = 2.5;
								}else{
									ctrl.aspectRatio = 1.7;
								}
								$scope.$apply(function($scope){
									ctrl.coverToCrop = event.target.result;
									ctrl.coverToCropName = file.name;
								});
							};
						};
						reader.readAsDataURL(file);
					} else {
						ctrl.coverToCrop = null;
					}
				};

				ctrl.submitNewPublication = function () {
					ctrl.addNewPublication = true;
					if (ctrl.subForm) {
						ctrl.addNewPublication = false;
						return false;
					}
					ctrl.newPublicationForm.$setSubmitted();
					// TODO: fix validation
					if(!ctrl.cover){
						$timeout(function () {
							ctrl.newPublicationForm.files1.$setValidity('coverRequired', ctrl.coverToCrop ? true : false);
						});
					}
					
					if (!ctrl.coverToCrop && !ctrl.cover) {
						ctrl.addNewPublication = false;
						return false;
					}

					if (ctrl.newPublicationForm.$invalid) {
						ctrl.addNewPublication = false;
						return false;
					}

					
					ctrl.subForm = true;

					var images = [],
						originalImages = [];
					var videos = [];

					var isMain;

					if ($state.is('feed')) {
						isMain = 1;
					} else {
						isMain = 0;
					}

					ctrl.files.forEach(function (file) {
						var type = file.type.split('/')[0];
						if (type === 'image') {
							images.push(file);
						} else if (type === 'video') {
							videos.push(file);
						}
					});
					ctrl.originalFiles.forEach(function (file) {
						var type = file.type.split('/')[0];
						if (type === 'image') {
							originalImages.push(file);
						}
					});

					if(!ctrl.cover || ctrl.setMainPubPhotoKey){
						ctrl.cover = createCover();
					}
					
					if (!ctrl.cover) {
						// если нет видеофайлов, обложка = фото
						if (videos.length === 0) {
							ctrl.cover = images[0];
						} else {
							// если есть и видео и фото, то обложка = фото
							if (images.length > 0) {
								ctrl.cover = images[0];
							} else {
								// если есть только видео, то обложка = видео
								ctrl.cover = videos[0];
							}
						}
					}
					var newImagesArray = [];
					var newPublication = {
						text: ctrl.emojiMessage.messagetext,
						cover: ctrl.cover,
						images: images.length < 20 ? images : newImagesArray = images.splice(0, 20),
						originalImages: originalImages.length < 20 ? originalImages : originalImages.splice(0, 20),
						videos: videos,
						isAnonym: ctrl.isAnonym,
						isMain: isMain,
						inProfile: $state.is('user'),
						scopes: ctrl.checkedAreas,
						groupId: ctrl.group ? ctrl.group.id : null,
						placeId: ctrl.place ? ctrl.place.id : null
					};

					//в зависимости от того где создается публикация используется свой сервис
					if (ctrl.group) {
						submitGroupPublication(newPublication);
					} else if (ctrl.place) {
						submitPlacePublication(newPublication);
					} else {
						if(newImagesArray.length > 0){
							ctrl.tooManyFilesRemove = true;
							setTimeout(function(){
								submitProfileOrFeedPublication(newPublication);
							}, 1000);
						}else{
							submitProfileOrFeedPublication(newPublication);
							ctrl.tooManyFilesRemove = false;
						}
					}
				};

				function submitProfileOrFeedPublication(pub){
					PublicationService.createPublication(pub).then(function(data){
						ctrl.subForm = false;
						if(!data.status && parseInt(data.error.code) === 1){
							ctrl.tooManyFiles = true;
						}else if(data.status){
							ngDialog.closeAll();
							setTimeout(function(){
								ctrl.addNewPublication = false;
							}, 10000);
							ctrl.tooManyFiles = false;
							$rootScope.$broadcast('publication:add', {
								publication: data.publication
							});
						}
					});
				}

				function submitGroupPublication(pub) {
					groupsService.addPublication(pub).then(function (data) {
						$rootScope.$broadcast('publication:add', {
							publication: data.publication
						});
						ctrl.subForm = false;
						ngDialog.closeAll();
					});
				}

				function submitPlacePublication(pub) {
					placesService.addPublication(pub).then(function (data) {
						$rootScope.$broadcast('publication:add', {
							publication: data.publication
						});
						ctrl.subForm = false;
						ngDialog.closeAll();
					});
				}

				function getScopes() {
					if (ctrl.group) {
						groupsService.getGroupScopes(ctrl.group.id).then(function (data) {
								ctrl.checkedAreas = [];
								ctrl.scopes = data;
								ctrl.scopes.forEach(function (value) {
									if (value.signed) {
										ctrl.checkedAreas.push(value.id);
										value.active = true;
									}
								});
							},
							function (error) {
								console.log(error);
							});
					} else if (ctrl.place) {
						placesService.getPlaceScopes(ctrl.place.id).then(function (data) {
								ctrl.checkedAreas = [];
								ctrl.scopes = data;
								ctrl.scopes.forEach(function (value) {
									if (value.signed) {
										ctrl.checkedAreas.push(value.id);
										value.active = true;
									}
								});
							},
							function (error) {
								console.log(error);
							});
					} else {
						PublicationService.getScopes().then(function (data) {
								ctrl.checkedAreas = [];
								ctrl.scopes = data;
								ctrl.scopes.forEach(function (value) {
									if (value.signed) {
										ctrl.checkedAreas.push(value.id);
										value.active = true;
									}
								});
							},
							function (error) {
								console.log(error);
							});
					}
				}

				ctrl.checkedScope = function (active, scope) {
					if(scope.name === "Все" && active){
						ctrl.checkAll(true);
						ctrl.checkedAreas = [];
						ctrl.checkedAreas[0] = scope.id;
					}else if(scope.name === "Все" && !active){
						ctrl.checkAll(false);
						ctrl.checkedAreas = [];
						ctrl.checkedAreas.splice(ctrl.checkedAreas.indexOf(scope.id), 1);
					}else{
						if(ctrl.checkedAreas[0] === 1){
							ctrl.checkedAreas.splice(0, 1);
						}
						ctrl.scopes.forEach(function(value){
							if(value.name === "Все"){
								value.active = false;
								value.signed = false;
							}
						});
					}
					if (active) {
						if (ctrl.checkedAreas.length < 3) {
							ctrl.checkedAreas.push(scope.id);
						}
					} else {
						ctrl.checkedAreas.splice(ctrl.checkedAreas.indexOf(scope.id), 1);
					}
				};

				ctrl.checkAll = function(param){
					ctrl.scopes.forEach(function(value){
						if(value.name === "Все"){
							value.active = param;
						}else{
							value.active = false;
							value.signed = false;
						}
						ctrl.checkedAreas = [];
					});
				};

				getScopes();

				function resizeImage(image) {
					//Upload.imageDimensions(image).then(function (dimensions) {
					//    console.info('Group publication: dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
					//});

					return Upload.resize(image, 700, 395, null, null, null, false).then(function (resizedFile) {
						//Upload.imageDimensions(resizedFile).then(function (dimensions) {
						//    console.info('Group publication: after resize dimension ' + 'w - ' + dimensions.width + ', h - ' + dimensions.height);
						//});
						//ctrl.files.push(resizedFile);
						return resizedFile;
					});
				}

				function getAvatarPath() {

					var avatar;

					if (ctrl.group) {
						avatar = ctrl.group.card_avatar;
					}
					if (ctrl.place) {
						avatar = ctrl.place.avatar;
					}
					if (ctrl.profile) {
						avatar = ctrl.profile.loggedUserAva;
					}
					if (ctrl.feed) {
						avatar = ctrl.feed.loggedUserAva;
					}
					return avatar;
				}

				function getAuthorName() {
					var name;

					if (ctrl.group) {
						name = ctrl.group.name;
					}
					if (ctrl.place) {
						name = ctrl.place.name;
					}
					if (ctrl.profile) {
						name = ctrl.profile.fullName;
					}
					if (ctrl.feed) {
						name = ctrl.feed.fullName;
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

				function isImage(file) {
					var type = file.type.split('/')[0];
					return type === 'image';
				}

				function isVideo(file) {
					var type = file.type.split('/')[0];
					return type === 'video';
				}

				function createCover() {

					return Upload.dataUrltoBlob(ctrl.myCroppedImage, ctrl.coverToCropName);

					//return Upload.resize(blob, 740, 395, null, null, null, false).then(function (resizedFile) {
					//    return resizedFile;
					//});
				}

			}
		});
})(angular);