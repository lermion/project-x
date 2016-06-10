angular.module('placePeopleApp')
    .controller('userCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService',
    	function($scope, $state, $stateParams, StaticService, AuthService, UserService){

    	$scope.$emit('userPoint', 'user');

		// var username = $stateParams.username;
		// $scope.staticText = 'asdsad';
		// console.log(username);

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
    	}
    }]);
