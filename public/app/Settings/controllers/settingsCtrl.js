angular.module('placePeopleApp')
	.controller('settingsCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService',  'ngDialog',
		function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog){
		$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();


	/*Page code*/	
	function blobToFile(dataURI){
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: 'image/jpeg' });
	}

	UserService.getUserData(storage.username).then(function(res){
		$scope.checkedAreas = [];
		$scope.userData = res;
		$scope.userData.scopes.forEach(function(value){
			if(value.signed){
				$scope.checkedAreas.push(value.id);
			}
		});
		$scope.isVisible = res.is_visible;	
		$scope.isPrivate = res.is_private;	
		$scope.showAvatar = res.is_avatar;									        
	},
	function(err){
		console.log(err);
	});

	$scope.openChangeSettings = function(){
		$scope.settingsEdit = true;
	};

	$scope.saveSettings = function(username, userLastname, userStatus){			
		UserService.settingsEdit(username, userLastname, userStatus).then(function(res){								
			$scope.settingsEdit = false;	        
		},
		function(err){
			console.log(err);
		});
	};

	$scope.saveAreas = function(){
		$scope.saveAreasPreloader = true;
		UserService.updateScopes($scope.checkedAreas).then(function(response){
			$scope.saveAreasPreloader = false;
			if(response.status){
				$scope.successsaveareas = true;
				$scope.errorsaveareas = false;
			}else if(!response.status && parseInt(response.error.code) === 2){
				$scope.successsaveareas = false;
				$scope.errorsaveareas = true;
			}
		},
		function(err){
			console.log(err);
		});
	};

	$scope.checkedLimit = 3;
	$scope.checkedArea = function(active, area){
		if(area.name === "Все" && active){
			$scope.checkAll(true);
			$scope.checkedAreas = [];
			$scope.checkedAreas[0] = area.id;
		}else if(area.name === "Все" && !active){
			$scope.checkAll(false);
			$scope.checkedAreas = [];
			$scope.checkedAreas.splice($scope.checkedAreas.indexOf(area.id), 1);
		}else{
			if($scope.checkedAreas[0] === 1){
				$scope.checkedAreas.splice(0, 1);
			}
			$scope.userData.scopes.forEach(function(value){
				if(value.name === "Все"){
					value.active = false;
					value.signed = false;
				}
			});
			if(active){
				if($scope.checkedAreas.length < 3){
					$scope.checkedAreas.push(area.id);
				}
			}else{
				$scope.checkedAreas.splice($scope.checkedAreas.indexOf(area.id), 1);
			}
		}
	};

	$scope.checkAll = function(param){
		$scope.userData.scopes.forEach(function(value){
			if(value.name === "Все"){
				value.active = param;
			}else{
				value.active = false;
				value.signed = false;
			}
			$scope.checkedAreas = [];
		});
	};

	$scope.changeShowAvatar = function(flag){			
		UserService.changeShowAvatar(flag ? 1 : 0)
			.then(
				function(res){
					if (res.status) {						
						$scope.userData = res.user;
						$scope.showAvatar = res.user.is_avatar;	
					}
				}, 
				function(err){
					console.log(err);
				});
		};
	$scope.changeIsVisible = function(flag){			
		UserService.changeIsVisible(flag ? 1 : 0)
			.then(
				function(res){
					if (res.status) {
						$scope.userData = res.user;			
						$scope.isVisible = res.user.is_visible;				
					}
				}, 
				function(err){
					console.log(err);
				});
	};
	$scope.changeLockProfile = function(flag){		
		UserService.changeLockProfile(flag ? 1 : 0).then(function(res){
			if(res.status){
				$scope.userData = res.user;
				$scope.isPrivate = res.user.is_private;
			}
		}, 
		function(err){
			console.log(err);
		});
	};

	function getRegistrationKeys(){
		UserService.getRegistrationKeys($scope.loggedUserId).then(function(response){
			$scope.registrationKeys = response;
		}, 
		function(error){
			console.log(error);
		});
	};

	getRegistrationKeys();

	$scope.myImage='';
	$scope.myCroppedImage='';
	var handleFileSelect = function(evt) {
		var file = evt.currentTarget.files[0];		
		$scope.fileName = file.name;
		var reader = new FileReader();
		reader.onload = function (evt) {
			$scope.$apply(function($scope){
				$scope.myImage = evt.target.result;
				ngDialog.open({
					template: '../app/Settings/views/crop-image.html',
					className: 'settings-add-ava ngdialog-theme-default',
					scope: $scope
				});
			});
		};
		reader.readAsDataURL(file);
	};
	angular.element(document.querySelector('#avatarImg')).on('change', handleFileSelect);	

	$scope.saveCropp = function(img, cropped){
		if ($scope.subForm) {
			return false;
		} else {
			$scope.subForm = true;
		}

		var blobFile = blobToFile(cropped, $scope.fileName);
		$scope.originalImageBlobFile = blobToFile($scope.myImage, $scope.fileName);
		$scope.originalImageBlobFile.filename = $scope.fileName;
		blobFile.filename = $scope.fileName;
		$scope.croppedFile = cropped;
		$scope.showEditAva = false;

		UserService.updateAvatar(blobFile, $scope.originalImageBlobFile).then(function(res){
			if(res.status){
				$scope.subForm = false;
				ngDialog.closeAll();
				storageService.setStorageItem('loggedUserAva', res.user.avatar_path);
			}
		},
		function(err){
			console.log(err);
			$scope.subForm = false;
		});	
	};
}]);