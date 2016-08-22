angular.module('placePeopleApp').controller('HiddenPubContoller', ['$scope', '$state', 'md5', 'ngDialog', 'PublicationService', function($scope, $state, md5, ngDialog, PublicationService){
	var hashPubId = md5.createHash($state.params.pubId);
	if(hashPubId === $state.params.hash){
		ngDialog.open({
			template: '../app/view-publication.html',
			className: 'view-publication ngdialog-theme-default',
			scope: $scope,
			name: "view-publication"
		});
		getSinglePublication($state.params.pubId);
	}else{
		$state.go("login");
	}
	function getSinglePublication(pubId){
		PublicationService.getSinglePublication(pubId).then(function(response){
			console.log(response);
			$scope.limit = 7;
			$scope.singlePublication = response;
			if(response.images[0] !== undefined){
				$scope.mainImage = response.images[0].url;
			}
		},
		function (error) {
			console.log(error);
		});
	}
	$scope.$emit('userPoint', 'user');
}]);