angular.module('placePeopleApp')
    .controller('feedCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'PublicationService', 
    	'AuthService', 'FeedService', '$window', '$http', 'storageService',  'ngDialog', 'amMoment', 'Upload',
    	function($scope, $state, $stateParams, StaticService, PublicationService, AuthService, 
    		FeedService, $window, $http, storageService, ngDialog, amMoment, Upload){
    	$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		$scope.loggedUser = storage.username;

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

		amMoment.changeLocale('ru');
		$scope.loggedUserId = storage.userId;
		$scope.commentModel = {pubText: ''};
		var emptyPost = {pubText: ''};		

		FeedService.getPublications()
			.then(function(res){					
					// console.log(res);
					$scope.limit = 6;
					$scope.publications = res;
				  }, function(err){
					console.log(err);
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

			PublicationService.addCommentPublication(pub.id, pubText, images, videos).then(function(response){
				if(response.data.status){										
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



}]);