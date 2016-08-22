angular.module('placePeopleApp').controller('HiddenPubContoller', HiddenPubContoller);
HiddenPubContoller.$inject = ['$scope', '$state', 'md5', 'ngDialog', 'PublicationService', 'amMoment'];
function HiddenPubContoller($scope, $state, md5, ngDialog, PublicationService, amMoment){
	amMoment.changeLocale('ru');
	var hashPubId = md5.createHash($state.params.pubId);
	if(hashPubId === $state.params.hash){
		ngDialog.open({
			template: '../app/view-publication.html',
			className: 'view-publication ngdialog-theme-default',
			scope: $scope,
			name: "view-publication"
		});
		getHiddenPublication($state.params.pubId);
	}else{
		$state.go("login");
	}
	function getHiddenPublication(pubId){
		PublicationService.getHiddenPublication(pubId).then(function(response){
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
	$scope.getAllCommentsPublication = function(flag, pub, showAllComments){
		PublicationService.getAllCommentsPublication(pub.id).then(function(response){
			$scope.singlePublication.comments = response;
		},
		function (error) {
			console.log(error);
		});
	}
	$scope.changeMainFile = function (file, flag, pub, index) {
		if (file.pivot.video_id) {
			$scope.mainImage = "";
			$scope.mainVideo = file.url;
		} else if (file.pivot.image_id) {
			if (flag) {
				$scope.mainImageInPopup = file.url;
			} else {
				$scope.mainVideo = "";
				$scope.mainImage = file.url;
			}
		}
		if (flag === 'list') {
			pub.mainFile = file;
		}
	}
	$scope.$emit('userPoint', 'user');
};