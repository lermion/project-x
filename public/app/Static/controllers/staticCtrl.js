angular.module('placePeopleApp')
    .controller('staticCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', '$window', '$http', 
    	function($scope, $state, $stateParams, StaticService, AuthService, $window, $http){

    	$scope.$emit('publicPoint', 'public');

    	$http.get('/static_page/get/name')
            .success(function (response){            	
                $scope.staticPages = response;
            })
            .error(function (error){
                console.log(error);
            });

    	$scope.username = $window.sessionStorage.getItem('username');
		$scope.page = $stateParams.pageName;

		StaticService.getStatic($stateParams.pageName)
			.then(function(res){					
					$scope.staticTitle = res.title;							    			
	    			$scope.staticText = res.text;
	    			$scope.staticDesc = res.description;	    			
			      }, function(err){
			        console.log(err);
			      });
		$scope.logOut = function(){
    		AuthService.userLogOut()
	    		.then(function(res){
	    			$state.go('login');
			      }, function(err){
			        console.log(err);
			      });
    	} 

    	$scope.openBottomMenu = function(){
            if ($window.innerWidth <= 650) {
                $scope.showBottomMenu = !$scope.showBottomMenu;
            } else {
                $scope.showBottomMenu = false;
            }    
            // console.log('asd');        
        };

        var w = angular.element($window);    	
    	var photosBlock = angular.element(document.querySelector('#user-page .my-photos'))[0];   	

		$scope.$watch(
		  function () {
		    return $window.innerWidth;
		  },
		  function (value) {			  
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
    }]);
