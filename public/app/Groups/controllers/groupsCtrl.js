angular.module('placePeopleApp')
    .controller('groupsCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService',  'ngDialog',
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog){
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

		$scope.openNewGroupCreation = function(){
			ngDialog.open({
					template:'../app/Groups/views/popup-add-group.html',
					className: 'popup-add-group ngdialog-theme-default',
					scope: $scope
				});
		};
		
		$scope.viewGroupPublication = function(){
			ngDialog.open({
					template:'../app/Groups/views/popup-view-group-publication.html',
					className: 'popup-view-group-publication ngdialog-theme-default',
					scope: $scope
				});
		};



}]);