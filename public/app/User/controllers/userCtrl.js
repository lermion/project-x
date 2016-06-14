angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService',
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService){

    	$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		
		if (!storage.length) {
			storageService.deleteStorage();
			$state.go('login');
		}
		

		$http.get('/static_page/get/name')
            .success(function (response){            	
                $scope.staticPages = response;
            })
            .error(function (error){
                console.log(error);
            });


		UserService.getUserData(storage.username)
			.then(function(res){
				$scope.username = res.login;
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
    			$scope.showMenu = false;    			
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
		
    }]);
