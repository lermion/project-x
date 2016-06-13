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
    	var startWidth = w[0].innerWidth;
    	var photosBlock = angular.element(document.querySelector('#user-page .my-photos'))[0];   	

		$scope.$watch(
		  function () {
		    return $window.innerWidth;
		  },
		  function (value) {		    
		    if (value < 520) {
		    	if (value === startWidth) {
		    		var blockLength = (parseInt(w[0].innerWidth)-2)/3;
		    		$scope.resizeSizes = 'width:'+blockLength+'px;height:'+blockLength+'px;';
		    	} else {
		    		var blockLength = (parseInt(photosBlock.clientWidth)-2)/3;
		    		$scope.resizeSizes = 'width:'+blockLength+'px;height:'+blockLength+'px;';
		    	}
		    } else {
		    	$scope.resizeSizes='';
		    }
		  },
		  true
		);
		w.bind('resize', function(){
		  $scope.$apply();
		});
		
    }]);
