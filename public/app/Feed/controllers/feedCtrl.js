angular.module('placePeopleApp')
    .controller('feedCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'PublicationService', 
    	'AuthService', 'FeedService', '$window', '$http', 'storageService',  'ngDialog', 'amMoment', 'Upload', '$timeout', 'UserService',
    	function($scope, $state, $stateParams, StaticService, PublicationService, AuthService, 
    		FeedService, $window, $http, storageService, ngDialog, amMoment, Upload, $timeout, UserService){
    	$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		$scope.loggedUser = storage.username;
		$scope.loggedUserAva = storage.loggedUserAva;
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
		  },
		  true
		);
		w.bind('resize', function(){
		  $scope.$apply();
		});

		/*Page content*/
		$scope.ngRepeatHasRendered = function(){
			window.emojiPicker = new EmojiPicker({
				emojiable_selector: '[data-emojiable=true]',
				assetsPath: 'lib/img/',
				popupButtonClasses: 'fa fa-smile-o'
			});
			window.emojiPicker.discover();
			$(".emoji-button").text("");
		}
		amMoment.changeLocale('ru');
		$scope.loggedUserId = storage.userId;
		$scope.commentModel = {pubText: ''};
		var emptyPost = {pubText: ''};		

		function getMainPubs(offset){
			FeedService.getPublications(offset)
			.then(function(res){
					$scope.limit = 6;
					if (!$scope.publications) {
						$scope.publications = res;
					} else {						
						if (res.length > 0) {
							res.forEach(function(publication){							
								$scope.publications.push(publication);
							});
						}
					}										
				}, function(err){
					console.log(err);
				});
		}
		var counter = 0;		
		getMainPubs(counter);

		$scope.loadMorePubs = function(){			
			if ($scope.publications && counter < $scope.publications.length) {
				counter+=10;
			} else {
				return;
			}			
			getMainPubs(counter);
		};		

		UserService.getUserData($scope.loggedUser)
			.then(
				function(res){									
					$scope.userData = res;
					if (res.login === storage.username) {
						$scope.myProfile = true;
						storageService.setStorageItem('loggedUserAva', res.avatar_path);
						$scope.loggedUserAva = res.avatar_path;
					}					
				},
				function(err){
					console.log(err);
				}
			);

		$scope.$on('ngDialog.opened', function(e, $dialog){
			window.emojiPicker = new EmojiPicker({
				emojiable_selector: '[data-emojiable=true]',
				assetsPath: 'lib/img/',
				popupButtonClasses: 'fa fa-smile-o'
			});
			window.emojiPicker.discover();
			$(".emoji-button").text("");
		});

		$scope.changeMainFileFeed = function(file, currPub){			
			if(file.pivot.video_id || file.pivot.image_id){
				currPub.mainFile = file;		
			}
		};

		$scope.changeMainFile = function(file, flag, pub){			
			// $scope.mainImageInPopup = file.url;	
			// console.log(file);
			// console.log(flag);
			if(file.pivot.video_id){
				$scope.mainImage = "";
				$scope.mainVideo = file.url;
			}else if(file.pivot.image_id){
				if(flag){
					$scope.mainImageInPopup = file.url;
				}else{
					$scope.mainVideo = "";
					$scope.mainImage = file.url;
				}
			}

			// console.log($scope.mainVideo);		
			// console.log($scope.mainImage);		
		}

		$scope.loadMorePubFiles = function(key, flag, pub) {			
			if (flag === 'list') {
				if (key === false) {
					pub.limit = pub.images.length + pub.videos.length;
				}else{
					pub.limit = 6;
				}
				// pub.morePubFiles = true;
				$scope.$broadcast('loadPubFiles');
			} else {
				if (key === false) {
					$scope.limit = $scope.singlePublication.images.length + $scope.singlePublication.videos.length;
				}else{
					$scope.limit = 6;
				}
				$scope.morePubFiles = true;
				$scope.$broadcast('loadPubFiles');
			}			
		};

		$scope.addPublicationLike = function(pub){
			PublicationService.addPublicationLike(pub.id).then(function(response){
				pub.user_like = response.user_like;
				pub.like_count = response.like_count;
			},
			function(error){
				console.log(error);
			});
		};

		$scope.getAllCommentsPublication = function(flag, pub, showAllComments){
			getAllCommentsPublication(flag, pub, showAllComments);
		};
		function getAllCommentsPublication(flag, pub, showAllComments){
			PublicationService.getAllCommentsPublication(pub.id).then(function(response){
				if(showAllComments === true){
					if(flag === "feedPage"){
						pub.comments = response;
					}
				}
				pub.comment_count = response.length;
			},
			function(error){
				console.log(error);
			});
		};
		$scope.addCommentLike = function(comment){
			PublicationService.addCommentLike(comment.id).then(function(response){
				comment.like_count = response.like_count;
			},
			function(error){
				console.log(error);
			});
		};
		$scope.deleteComment = function(flag, pub, comment, index){
			PublicationService.deleteCommentPublication(comment.id).then(function(response){
				if(response.status){
					if(flag === "feedPage"){
						pub.comments = pub.comments.reverse();
						pub.comments.splice(index, 1);
						pub.comment_count--;
					}
				}
			},
			function(error){
				console.log(error);
			});
		};

		$scope.deleteCommentFile = function(files, index){
			files.splice(index, 1);
		};

		$scope.addNewComment = function(flag, pub, pubText, files){
			$scope.disableAddComment = true;
			if(pubText === undefined || pubText === ""){
				pubText = {};
				pubText.rawhtml = angular.element(document.querySelector(".pubText")).val();
			}	
			var images = [];
			var videos = [];
			if (files != undefined) {
				files.forEach(function(file){
					var type = file.type.split('/')[0];
					if (type === 'image') {
						images.push(file);
					} else if (type === 'video'){
						videos.push(file);
					}				
				});
			}

			PublicationService.addCommentPublication(pub.id, pubText.rawhtml, images, videos).then(function(response){
				$scope.disableAddComment = false;
				if(response.data.status){
					$(".emoji-wysiwyg-editor").html("");
					if(flag === "feedPage"){
						pub.files = [];
						pub.commentModel = angular.copy(emptyPost);
						pub.comments.push(response.data.comment);
						pub.comment_count++;
					}					
				}
			},
			function(error){
				console.log(error);
			});
		};

		$scope.createPublication = function(){
			ngDialog.open({
					template: '../app/Feed/views/create-publication.html',
					className: 'user-publication ngdialog-theme-default',
					scope: $scope
				});
		};

		$scope.deletePubFile = function(files, index){
			files.splice(index, 1);
		};

		$scope.openPublicationPreviewBlock = function(files){			
			if (!$scope.showPubAdd) {
				$scope.showPubAdd=!$scope.showPubAdd;
			}			
		};

		$scope.pubFiles = function(files){											
			if (files.length > 4) {
				$scope.pubFilesNeedScroll = true;
			} else if(files.length > 100){				
				console.log('too much files');
				return;
			}
			$scope.$broadcast('rebuild:me');
		};

		$scope.showMoreImages = function(images, currImg){
			if (currImg != null) {
				$scope.mainImageInPopup = currImg.url;
			} else {
				$scope.mainImageInPopup = images[0].url;
			}		
			
			ngDialog.open({
				template: '../app/User/views/popup-comment-images.html',
				className: 'popup-comment-images ngdialog-theme-default',
				scope: $scope,
				data: {
					images: images
				}
			});
		}

		$scope.closePopup = function(){
			ngDialog.closeAll();
		};

		$scope.returnToBack = function(){
				$state.go("feed");
		};

		// if($state.current.name === "feed-mobile"){				
		// 	var pubId = $stateParams.pubId;			
		// 	if ($window.innerWidth > 700) {
		// 			$state.go('feed-desktop', {pubId: pubId});
		// 	}			
		// }
		// if($state.current.name === "feed-desktop"){						
		// 	var pubId = $stateParams.pubId;
		// 	if ($window.innerWidth < 700) {
		// 			console.log(pubId);
		// 			$state.go('feed-mobile', {pubId: pubId});

		// 	} else {
		// 		getSinglePublication(pubId);
		// 		ngDialog.open({
		// 					template: '../app/Feed/views/view-publication.html',
		// 					className: 'view-publication ngdialog-theme-default',
		// 					scope: $scope
		// 				});
		// 	}
							
		// }

		$scope.publishNewPub = function(isAnon, files){
			var pubText = $(".ngdialog .emoji-wysiwyg-editor").html();
			if (files === undefined || files.length == 0) {						
				$scope.publishNewPubErr = true;				
				return;				
			}

			$scope.newPubLoader = true;						
			var images = [];
			var videos = [];
			var isMain = 1;		

			// if ($scope.mainPubPhoto) {
			// 	images[0] = '';
			// }			
			
			files.forEach(function(file){
				var type = file.type.split('/')[0];
				if (type === 'image') {
					images.push(file);
				} else if (type === 'video'){
					videos.push(file);
				}				
			});


			// if ($scope.mainPubPhoto) {
			// 	for(var i=0; i < images.length; i++){
			// 		if (images[i].name === $scope.mainPubPhoto) {
			// 			var mainPhoto = images.splice(i, 1);
			// 			images[0] = mainPhoto[0];

			// 		}
			// 	}				
			// }


			PublicationService.createPublication(pubText, !!isAnon ? 1 : 0, isMain, videos, images)			
				.then(					
					function(res){						
						if (res.status) {							
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

		function getSinglePublication(pubId, flag){
			PublicationService.getSinglePublication(pubId).then(function(response){				
				$scope.limit = 6;
				$scope.singlePublication = response;
				if(response.images[0] !== undefined){
					$scope.mainImage = response.images[0].url;
				}
				// if ($window.innerWidth <= 700) {
				// 	$state.go('feed-mobile', {pubId: pubId});											
				// }else{
					if(!flag && $state.current.name === 'feed'){
						ngDialog.open({
							template: '../app/Feed/views/view-publication.html',
							className: 'view-publication ngdialog-theme-default',
							scope: $scope
						});									
					}
				// }
			},
			function(error){
				console.log(error);
			});
		}	
		
		$scope.showPublication = function(pub){
			getSinglePublication(pub.id);			
		};

		$scope.getAllCommentsPublication = function(flag, pub, showAllComments){
			getAllCommentsPublication(flag, pub, showAllComments);
		}
		function getAllCommentsPublication(flag, pub, showAllComments){
			PublicationService.getAllCommentsPublication(pub.id).then(function(response){
				if(showAllComments === true){
					if(flag === "feedPage"){
						pub.comments = response;
					}else{
						$scope.singlePublication.comments = response;
					}
				}
				$scope.lengthAllComments = response.length;
			},
			function(error){
				console.log(error);
			});
		}

		$scope.openComplainBlock = function(commentId){			
			ngDialog.open({
							template: '../app/Feed/views/alert-publication.html',
							className: 'alert-publication ngdialog-theme-default',
							scope: $scope,
							data: {
								commentId: commentId
							}							
						});
		};

		$scope.sendCommentComplain = function(commentId, cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8){			
			var complainCategory = [];
			cat1 ? complainCategory.push(1) : '';
			cat2 ? complainCategory.push(2) : '';
			cat3 ? complainCategory.push(3) : '';
			cat4 ? complainCategory.push(4) : '';
			cat5 ? complainCategory.push(5) : '';
			cat6 ? complainCategory.push(6) : '';
			cat7 ? complainCategory.push(7) : '';
			
			// console.log(commentId, complainCategory);

			// PublicationService.complaintCommentAuthor(commentId, complainCategory)
			// .then(					
			// 		function(res){						
			// 			if (res.status) {							
			// 				ngDialog.closeAll();
			// 			} else {
			// 				console.log('Error');							
			// 			}						
			// 		},
			// 		function(err){
			// 			console.log(err);
			// 		});
		};


}]);