angular.module('placePeopleApp')
    .controller('staticCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 
    	function($scope, $state, $stateParams, StaticService, AuthService){

    	$scope.$emit('publicPoint', 'public');

    	StaticService.getStaticNames()
			.then(function(res){
					console.log(res);
					// $scope.staticPages = res; 					        
			      }, function(err){
			        console.log(err);
			      });	
			      	
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
    }]);
