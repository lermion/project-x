angular.module('placePeopleApp')
    .controller('footerCtrl', ['$scope', '$http',
    	function($scope, $http){

		$http.get('/static_page/get/name')
            .success(function (response){            	
                $scope.staticPages = response;
            })
            .error(function (error){
                console.log(error);
            });		 
    }]);
