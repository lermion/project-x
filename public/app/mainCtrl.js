angular.module('placePeopleApp')
    .controller('mainCtrl', ['$scope', function($scope){
    	
		$scope.$on('publicPoint', function (event, data) {		  
		  $scope.bodyClass = 'public';
		});

		$scope.$on('authPoint', function (event, data) {		  
		  $scope.bodyClass = 'main-page';
		});

		$scope.$on('userPoint', function (event, data) {		  
		  $scope.bodyClass = 'public user';
		});

    }]);
