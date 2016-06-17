angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService', 'ngDialog',
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog){

    	$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		$scope.loggedUser = storage.username;
		
		// if (!storage.length) {
		// 	storageService.deleteStorage();
		// 	$state.go('login');
		// }

		$http.get('/static_page/get/name')
            .success(function (response){            	
                $scope.staticPages = response;
            })
            .error(function (error){
                console.log(error);
            });


		UserService.getUserData($stateParams.username)
			.then(function(res){
				if (res.login === storage.username) {
					$scope.myProfile = true;
				} else {
					$scope.myProfile = false;
				}
				if (!$scope.myProfile) {
					$scope.isSigned = res.is_sub;
				}
				// $scope.userId = res.id;
				$scope.userData = res;										        
			},
			function(err){
				console.log(err);
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
		//Sign on
		$scope.sign = function(){
			$scope.isSigned=!$scope.isSigned;
			UserService.sign(parseInt($scope.userData.id))
			.then(function(res){
					console.log(res);	    			
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

		$scope.createPublication = function(){
			ngDialog.open({
					template: '../app/User/views/publication.html',
					className: 'user-publication',
					scope: $scope
				});
		};
		
    }]);
