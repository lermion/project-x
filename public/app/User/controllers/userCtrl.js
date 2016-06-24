angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
    	'$window', '$http', 'storageService', 'ngDialog', 'PublicationService', 'amMoment', '$q', '$timeout',
    	function($scope, $rootScope, $state, $stateParams, StaticService, AuthService, UserService, 
    		$window, $http, storageService, ngDialog, PublicationService, amMoment, $q, $timeout){
		/* Service info*/
		amMoment.changeLocale('ru');
    	$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		$scope.loggedUser = storage.username;
		$scope.loggedUserId = storage.userId;
		$scope.images = {};
		$scope.commentModel = {pubText: ''};
		var emptyPost = {pubText: ''};
		$http.get('/static_page/get/name')
            .success(function (response){            	
                $scope.staticPages = response;
            })
            .error(function (error){
                console.log(error);
            });

		$scope.logOut = function(){
    		AuthService.userLogOut()
	    		.then(function(res){
	    			storageService.deleteStorage();
	    			$state.go('login');
			      }, function(err){
			        console.log(err);
			      });
    	};

    	$scope.openMenu = function(){
    		if ($window.innerWidth <= 800) {    			
				 $scope.showMenu =! $scope.showMenu;
    		} else{
    			$scope.showMenu = true;    			
    		}
    	};

    	$scope.openBottomMenu = function(){
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
	    		var blockThirdthLength = (parseInt(w[0].innerWidth)-2)/3;
	    		$scope.resizeSizes = 'width:'+blockThirdthLength+'px;height:'+blockThirdthLength+'px;';
	    		$scope.resizeHeight = 'height:'+parseInt(w[0].innerWidth)+'px;';		    		
		      } else {
		    	$scope.resizeSizes='';
		    	$scope.resizeHeight='';
		    	$scope.mobileWidthMenu = true;		    	
		      }
		  },
		  true
		);
		w.bind('resize', function(){
		  $scope.$apply();
		});

		/*User info*/

		UserService.getUserData($stateParams.username)
			.then(
				function(res){
					if (res.login === storage.username) {
						$scope.myProfile = true;
					} else {
						$scope.myProfile = false;
					}
					if (!$scope.myProfile) {
						$scope.isSigned = res.is_sub;
					}					
					$scope.userData = res;										        
				},
				function(err){
					console.log(err);
				}
			);

		function getUserPubs(userId){
			PublicationService.getUserPublications(userId)
			.then(
				function(res){								
					$scope.userPublications = res;										        
				},
				function(err){
					console.log(err);
				}
			);
		}

		getUserPubs(storage.userId);

		//Sign on
		$scope.sign = function(){
			$scope.isSigned=!$scope.isSigned;
			UserService.sign(parseInt($scope.userData.id))
			.then(function(res){							
    			if (res.status) {
    				$scope.isSigned = res.is_sub
    			} else {
    				if (parseInt(res.error.code) === 1) {	    					
    					// 1 userId
    				} else if(parseInt(res.error.code) === 8){
    					// 8 permission
    				}
    			}
		      }, function(err){
		        console.log(err);
		      });
		};

		$scope.editProfile = function(name, lastname, status){
			if (!$scope.profileEdition) {
				$scope.profileEdition=true;				
			} else {
				if (!name) {
				return;
			} else if(status && status.length > 140){
				$scope.statusErr = true;
				return;
			} else {				
				UserService.quickEdit(name, lastname, status)
				.then(					
					function(res){								
						$scope.profileEdition = false;		        
					},
					function(err){
						console.log(err);
					});				
				}	
			}
		};		

		$scope.openSubscribers = function(userId){	
			if ($window.innerWidth <= 700) {
					$state.go('subscribers', {username: $stateParams.username});
			} else {
				ngDialog.open({
					template:'../app/User/views/popup-user-subscribers.html',
					className: 'popup-user-subscribers ngdialog-theme-default',
					scope: $scope
				});
			}			
		};

		$scope.openSubscribe = function(userId){
			if ($window.innerWidth <= 700) {
				$state.go('subscribes', {username: $stateParams.username});
			}
			else {
				ngDialog.open({
					template:'../app/User/views/popup-user-subscribe.html',
					className: 'popup-user-subscribe ngdialog-theme-default',
					scope: $scope
				});
			}		
		};

		$scope.createPublication = function(){			
			ngDialog.open({
					template: '../app/User/views/publication.html',
					className: 'user-publication ngdialog-theme-default',
					scope: $scope
				});
		};

		$scope.closePopup = function(){
			ngDialog.closeAll();
		};

		$scope.openPublicationPreviewBlock = function(files){			
			if (!$scope.showPubAdd) {
				$scope.showPubAdd=!$scope.showPubAdd;
			}
			
		};

		$scope.pubFiles = function(files, event, flow){								
			if (files.length > 4) {
				$scope.pubFilesNeedScroll = true;
			} else if(files.length > 100){
				console.log('too much files');
			}
			$scope.$broadcast('rebuild:me');
		};

		$scope.fileTypeCheck = function(filetype){
			var type = filetype.split('/')[0];
				if (type === 'image') {
					return true;
				} else if (type === 'video'){
					return false;
				}
		};

		$scope.checkFileAmount = function(files, event, flow){
			console.log(files, event, flow);
		};

		$scope.setMainPubPhoto = function(target){
			$scope.mainPubPhoto = target.file.name;			
		};

		$scope.deletePubFile = function(targetName, files){			
			for(var i=0; i < files.length; i++){
					if (files[i].name === targetName) {						
						files.splice(i, 1);
					}
					
				}
		};

		$scope.publishNewPub = function(pubText, isAnonPub, files){
			$scope.newPubLoader = true;						
			var images = [];
			var videos = [];
			var isMain;
			if ($scope.mainPubPhoto) {
				images[0] = '';
			}			
			if ($state.current.name === 'feed') {
				isMain = 1;
			} else{
				isMain = 0;
			}
			files.forEach(function(file){
				var type = file.file.type.split('/')[0];
				if (type === 'image') {
					images.push(file.file);
				} else if (type === 'video'){
					videos.push(file.file);
				}				
			});			
			if ($scope.mainPubPhoto) {
				for(var i=0; i < images.length; i++){
					if (images[i].name === $scope.mainPubPhoto) {
						var mainPhoto = images.splice(i, 1);
						images[0] = mainPhoto[0];

					}
				}				
			}
			PublicationService.createPublication(pubText, isAnonPub ? 1 : 0, isMain, videos, images)			
				.then(					
					function(res){						
						if (res.status) {
							getUserPubs(storage.userId);
							ngDialog.closeAll();
						} else {
							console.log('Error');							
						}
						$scope.newPubLoader = false;	        
					},
					function(err){
						console.log(err);
					});
			
		};
		if($stateParams.id){
			getSinglePublication($stateParams.id);
			$scope.returnToBack = function(){
				$state.go("user", {username: $stateParams.username});
			}
		}
		function getSinglePublication(pubId, flag){
			PublicationService.getSinglePublication(pubId).then(function(response){
				getAllCommentsPublication(pubId);
				$scope.limit = 6;
				$scope.singlePublication = response;
				$scope.mainImage = response.images[0].url;
				if ($window.innerWidth <= 700) {
				$state.go('mobile-pub-view', {username: $stateParams.username, id: pubId});								
				}else{
					if(!flag){
						ngDialog.open({
							template: '../app/User/views/view-publication.html',
							className: 'view-publication ngdialog-theme-default',
							scope: $scope
						});
					}
				}
			},
			function(error){
				console.log(error);
			});
		}
		$scope.showPublication = function(pub){
			getSinglePublication(pub.id);
		};
		$scope.addNewComment = function(pubId, pubText, flow){
			$scope.commentModel = angular.copy(emptyPost);
			PublicationService.addCommentPublication(pubId, pubText, flow).then(function(response){
				flow.cancel();
				$scope.singlePublication.comments.push(response.data.comment);
				$scope.singlePublication.comment_count++;
			},
			function(error){
				console.log(error);
			});
		}
		$scope.showMoreImages = function(images){
			$scope.imagesInPopup = images;
			$scope.mainImageInPopup = images[0].url;
			ngDialog.open({
				template: '../app/User/views/popup-comment-images.html',
				className: 'popup-comment-images ngdialog-theme-default',
				scope: $scope,
				data: {
					images: images
				}
			});
		}
		$scope.changeMainImage = function(image, flag){
			if(flag){
				$scope.mainImageInPopup = image.url;
			}else{
				$scope.mainImage = image.url;
			}
		}
		$scope.addCommentLike = function(comment){
			PublicationService.addCommentLike(comment.id).then(function(response){
				comment.like_count = response.like_count;
			},
			function(error){
				console.log(error);
			});
		}
		$scope.addPublicationLike = function(pub, isCurrentUser){
			PublicationService.addPublicationLike(pub.id).then(function(response){
				pub.user_like = response.user_like;
				pub.like_count = response.like_count;
			},
			function(error){
				console.log(error);
			});
		}
		$scope.deleteComment = function(commentId, index){
			PublicationService.deleteCommentPublication(commentId).then(function(response){
				$scope.singlePublication.comments.splice(index, 1);
				$scope.singlePublication.comment_count--;
			},
			function(error){
				console.log(error);
			});
		}
		$scope.getAllCommentsPublication = function(pubId, showAllComments){
			getAllCommentsPublication(pubId, showAllComments);
		}
		function getAllCommentsPublication(pubId, showAllComments){
			PublicationService.getAllCommentsPublication(pubId).then(function(response){
				if(showAllComments === true){
					$scope.singlePublication.comments = response;
				}
				$scope.lengthAllComments = response.length;
			},
			function(error){
				console.log(error);
			});
		}
		$scope.loadMorePubFiles = function(key) {
			if (key === false) {
				$scope.limit = $scope.singlePublication.length;
			}else{
				$scope.limit = 6;
			}
			$scope.morePubFiles = true;
			$scope.$broadcast('loadPubFiles');			
		};
		var editPubPopup;
		$scope.editPub = function(pub){			
			$scope.currPub = pub;
			editPubPopup = ngDialog.open({
							template: '../app/User/views/edit-publication.html',
							className: 'user-publication ngdialog-theme-default',
							scope: $scope
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

		$scope.editedPubFiles = function(pub){
		// createBlobFromURL(pub.images).then(function(res){
			// 	angular.forEach(res, function (item) {
			// 		$timeout(function () {
			// 			var blob = new Blob([item], {type: 'image/jpeg'});
			// 			blob.name = 'image';
			// 			$scope.images.flow.addFile(blob);
			// 		});
			// 	});
			// },
			// function(err){
			// 	console.log(err);
			// });

			var files = [];
			// pub.videos.forEach(function(video){
			// 	files.push(video);
			// });			
			pub.images.forEach(function(img){
				var filename = img.url.split('/')[(img.url.split('/')).length-1];
				img.name = filename.substring(8, filename.length);						
				files.push(img);
			});							
			$scope.editedPubFilesArray = files;
			$scope.$broadcast('rebuildScroll');					 			
		};

		$scope.addedEditedPubFiles = function(files, event, flow){									
			if(files.length > 100){
				console.log('too much files');
			}
			$scope.$broadcast('rebuildScroll');
		};

		var	pubEditDeletedPhotos = [];
		var pubEditDeletedVideos = [];

		$scope.editedPubDeletePhoto = function(index, photoId){			
			$scope.editedPubFilesArray.splice(index, 1);
			pubEditDeletedPhotos.push(photoId);
			$scope.$broadcast('rebuildScroll');			
		};
		$scope.editedPubDeleteVideo = function(videoId){
			pubEditDeletedVideos.push(videoId);
			$scope.$broadcast('rebuildScroll');
		};

		$scope.saveEditedPub = function(pubId, text, isAnon, files){
			// $scope.updatePubLoader = true;
			var images = [];
			var videos = [];
			var isMain;						
			if ($state.current.name === 'feed') {
				isMain = 1;
			} else{
				isMain = 0;
			}
			files.forEach(function(file){
				var type = file.file.type.split('/')[0];
				if (type === 'image') {
					images.push(file.file);
				} else if (type === 'video'){
					videos.push(file.file);
				}				
			});			
			PublicationService.updatePublication(pubId ,text, isAnon ? 1 : 0, isMain, images, videos, pubEditDeletedVideos, pubEditDeletedPhotos)
			.then(					
					function(res){									
						if (res.status) {
							getUserPubs(storage.userId);
							getSinglePublication(res.publication.id, true);
							editPubPopup.close();
						} else {
							console.log('Error');							
						}
						$scope.updatePubLoader = false;	        
					},
					function(err){
						console.log(err);
					});
		};

		$scope.sharePub = function(pubId){
			ngDialog.open({
							template: '../app/User/views/share-publication.html',
							className: 'share-publication ngdialog-theme-default',
							scope: $scope
						});
		};
		$scope.getPubLink = function(pubId){
			ngDialog.open({
							template: '../app/User/views/get-link-publication.html',
							className: 'link-publication ngdialog-theme-default',
							scope: $scope
						});
		};
		$scope.alertPub = function(pubId){
			ngDialog.open({
							template: '../app/User/views/alert-publication.html',
							className: 'alert-publication ngdialog-theme-default',
							scope: $scope
						});
		};
		
		$scope.deletePub = function(pub){
			$scope.pubToDelete = pub.id;						
			ngDialog.open({
							template: '../app/User/views/delete-publication.html',
							className: 'delete-publication ngdialog-theme-default',
							scope: $scope
						});
		};

		$scope.confirmPubDelete = function (pubToDelete) {			
			PublicationService.deletePublication(pubToDelete)
			.then(
				function(res){
					if (res.status) {
						getUserPubs(storage.userId);
					}
					ngDialog.closeAll();									        
				},
				function(err){
					console.log(err);
				}
			);

		};

		
		
    }]);
