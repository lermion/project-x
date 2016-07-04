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

		function getMainPubs(){
			FeedService.getPublications()
			.then(function(res){
					$scope.limit = 6;
					$scope.publications = res;
				}, function(err){
					console.log(err);
				});
		}
		getMainPubs();

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

		$scope.changeMainFile = function(file, currPub){			
			if(file.pivot.video_id || file.pivot.image_id){
				currPub.mainFile = file;		
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
			console.log(flag, pubText);
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
				if(response.data.status){
					$(".emoji-wysiwyg-editor").html("");
					if(flag === "feedPage"){
						pub.files = [];
						pub.commentModel = angular.copy(emptyPost);
						pub.comments.unshift(response.data.comment);
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
			}
			$scope.$broadcast('rebuild:me');
		};

		$scope.showMoreImages = function(images){
			$scope.imagesInPopup = images;
			$scope.mainImageInPopup = images[0].url;			
			// angular.element(document.querySelector('.view-publication')).addClass('posFixedPopup');
			ngDialog.open({
				template: '../app/User/views/popup-comment-images.html',
				className: 'popup-comment-images ngdialog-theme-default',
				scope: $scope,
				data: {
					images: images
				},
				preCloseCallback: function(value){
					// angular.element(document.querySelector('.view-publication')).removeClass('posFixedPopup');
				}
			});
		}

		$scope.closePopup = function(){
			ngDialog.closeAll();
		};

		$scope.publishNewPub = function(files){
			var pubText = angular.element(document.querySelector(".pubText")).val();
			if (!pubText || files === undefined || files.length == 0) {						
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


			PublicationService.createPublication(pubText, 0, isMain, videos, images)			
				.then(					
					function(res){						
						if (res.status) {
							// getMainPubs();
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



}]);