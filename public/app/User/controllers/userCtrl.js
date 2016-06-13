angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', 
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window){

    	$scope.$emit('userPoint', 'user');

		$window.sessionStorage.setItem('username', $stateParams.username);

		UserService.getUserData($stateParams.username)
			.then(function(res){
				$scope.userData = res;							        
			},
			function(err){
				console.log(err);
			});

		$scope.logOut = function(){
    		AuthService.userLogOut()
	    		.then(function(res){
	    			$state.go('login');
			      }, function(err){
			        console.log(err);
			      });
    	};

    	var w = angular.element($window);
		$scope.$watch(
		  function () {
		    return $window.innerWidth;
		  },
		  function (value) {		    
		    if (value < 500) {
		    	$scope.blockLength = (value-2)/3;
		    }
		  },
		  true
		);
		w.bind('resize', function(){
		  $scope.$apply();
		});
		
    }]);
