angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService', 'ngDialog', 'PublicationService',
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog, PublicationService){
		/* Service info*/
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

		$scope.showPublication = function(pub){
			$scope.singlePublication = pub;
			$scope.limit = 6;
			$scope.hideSomePubText = false;
			if ($window.innerWidth <= 700) {
				if($window.innerWidth <= 520){
					$scope.hideSomePubText = true;					
				}
				$state.go('mobile-pub-view', {username: $stateParams.username, id: pub.id});								
			}  else {
				ngDialog.open({
					template: '../app/User/views/view-publication.html',
					className: 'view-publication ngdialog-theme-default',
					scope: $scope
				});
			}
		};

		$scope.loadMorePubFiles = function(key) {
			if (key === false) {
				$scope.limit = $scope.singlePublication.length;
			}else{
				$scope.limit = 6;
			}
			$scope.morePubFiles = true;
			$scope.$broadcast('loadPubFiles');			
		};

		$scope.editPub = function(pubId){
			ngDialog.open({
							template: '../app/User/views/edit-publication.html',
							className: 'user-publication ngdialog-theme-default',
							scope: $scope
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
