angular.module('placePeopleApp')
    .controller('mainCtrl', ['$scope', function($scope){
    	
    	// прослушиваем событие в текущем $scope
		$scope.$on('publicPoint', function (event, data) {
		  $scope.bodyClass = 'public';
		});
		$scope.$on('authPoint', function (event, data) {
		  $scope.bodyClass = 'main-page';
		});

    }]);
