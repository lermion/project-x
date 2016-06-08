angular.module('placePeopleApp')
    .controller('staticCtrl', ['$scope', '$stateParams', 'StaticService', function($scope, $stateParams, StaticService){

    	// $scope.ctrlStyle = 'main-page';
		// $scope.page = $stateParams.pageName;
  		// about_service,
		// help,
		// rules,
		// advertising,
		// developers
		StaticService.getStatic(staticName)
			.then(function(res){
			console.log(res);	    			
	    			if (res.status) {	    				
	    				
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });
      // console.log($stateParams);

    }]);
