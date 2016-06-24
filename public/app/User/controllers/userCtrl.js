angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
    	'$window', '$http', 'storageService', 'ngDialog', 'PublicationService', 'amMoment', '$q', '$timeout',
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService, 
    		$window, $http, storageService, ngDialog, PublicationService, amMoment, $q, $timeout){
		/* Service info*/
		amMoment.changeLocale('ru');
    	$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		$scope.loggedUser = storage.username;
		$scope.loggedUserId = storage.userId;
		$scope.images = {};

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
				UserService.quickEdit(name, lastname, status, storage.userId)
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

		$scope.openPublication = function(userId){			
			ngDialog.open({
				template:'../app/User/views/popup-user-publication.html',
				className: 'popup-user-publication ngdialog-theme-default',
				scope: $scope
			});
		};

		$scope.openContacts = function(userId){			
			ngDialog.open({
				template:'../app/User/views/popup-user-contacts.html',
				className: 'popup-user-contacts ngdialog-theme-default',
				scope: $scope
			});
		};

		$scope.openSubscribers = function(userId){			
			ngDialog.open({
				template:'../app/User/views/popup-user-subscribers.html',
				className: 'popup-user-subscribers ngdialog-theme-default',
				scope: $scope
			});
		};

		$scope.openSubscribe = function(userId){			
			ngDialog.open({
				template:'../app/User/views/popup-user-subscribe.html',
				className: 'popup-user-subscribe ngdialog-theme-default',
				scope: $scope
			});
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
			// console.log(files, event, flow);
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
							console.log(res);
						}
						$scope.newPubLoader = false;	        
					},
					function(err){
						console.log(err);
					});
			
		};

		$scope.showPublication = function(pubId){
			PublicationService.getSinglePublication(pubId).then(function(response){
				$scope.singlePublication = response;
			},
			function(error){
				console.log(error);
			});
			getAllCommentsPublication(pubId);
			//$scope.singlePublication = pub;
			$scope.limit = 6;
			// $scope.hideSomePubText = false;
			if ($window.innerWidth <= 700) {
				// if($window.innerWidth <= 520){
				// 	$scope.hideSomePubText = true;					
				// }
				$state.go('mobile-pub-view', {username: $stateParams.username, id: pubId});								
			}  else {
				ngDialog.open({
					template: '../app/User/views/view-publication.html',
					className: 'view-publication ngdialog-theme-default',
					scope: $scope
				});
			}
		};
		$scope.addNewComment = function(pubId, pubText, flow){
			PublicationService.addCommentPublication(pubId, pubText, flow).then(function(response){
				$scope.singlePublication.comments.push(response.comment);
				$scope.singlePublication.comment_count++;
			},
			function(error){
				console.log(error);
			});
		}
		$scope.showMoreImages = function(){
			ngDialog.open({
				template: '../app/User/views/popup-comment-images.html',
				className: 'popup-comment-images ngdialog-theme-default',
				scope: $scope
			});
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
				if(isCurrentUser){
					pub.user_like = response.user_like;
				}else{
					pub.like_count = response.like_count;
				}
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

		$scope.editPub = function(pub){			
			$scope.currPub = pub;
			ngDialog.open({
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
			// if (flow.length === 0) {
			// 	$scope.pubPhotosEdited = true;
			// } else {
			// 	$scope.pubPhotosEdited = false;
			// }
			// var files = [];
			
			// pub.images.forEach(function(img){
				// var filename = img.url.split('/')[(img.url.split('/')).length-1];
				// img.name = filename.substring(8, filename.length);
				// // img.name = filename;
				// console.log(img.name);
				// files.push(img);
			// });
			// pub.videos.forEach(function(video){
			// 	files.push(video);
			// });
			createBlobFromURL(pub.images).then(function(res){
				angular.forEach(res, function (item) {
					$timeout(function () {
						var blob = new Blob([item], {type: 'image/jpeg'});
						blob.name = 'image';
						$scope.images.flow.addFile(blob);
					});
				});
			},
			function(err){
				console.log(err);
			});

			// console.log(imgArr);

			
			// $scope.editedPubFilesArray = files;
			 			
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
