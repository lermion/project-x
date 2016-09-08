angular.module('placePeopleApp')
	.controller('settingsCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', '$window', '$http', 'storageService',  'ngDialog',
		function($scope, $state, $stateParams, StaticService, AuthService, UserService, $window, $http, storageService, ngDialog){
		$scope.$emit('userPoint', 'user');    	
		var storage = storageService.getStorage();
		$scope.loggedUserId = storage.userId;
		//$scope.loggedUser = storage.username;

		$http.get('/static_page/get/name')
					.success(function (response){            	
						$scope.staticPages = response;
					})
					.error(function (error){
						console.log(error);
					});

		$scope.openMenu = function(){
			if ($window.innerWidth <= 800) {    			
				 $scope.showMenu =! $scope.showMenu;
			} else{
				$scope.showMenu = true;    			
			}
		};

		$scope.openBottomMenu = function(){
			if ($window.innerWidth <= 650) {
				$scope.showBottomMenu = !$scope.showBottomMenu;
			} else {
				$scope.showBottomMenu = false;
			}
		};

		var w = angular.element($window);
		$scope.$watch(
		  function () {
			return $window.innerWidth;
		  },
		  function (value) {
			  if (value <= 800) {
				$scope.showMenu = false;
			  } else {
				$scope.showMenu = true;
			  }

			  if (value <= 650) {
				$scope.showBottomMenu = false;
			  } else {
				$scope.showBottomMenu = true;
			  }			  
		  },
		  true
		);
		w.bind('resize', function(){
		  $scope.$apply();
		});

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

	UserService.getUserData(storage.username)
		.then(
			function(res){										
				$scope.userData = res;			
				$scope.isVisible = res.is_visible;	
				$scope.isPrivate = res.is_private;	
				$scope.showAvatar = res.is_avatar;									        
			},
			function(err){
				console.log(err);
			}
		);

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
		console.log("hgewge!!");
	};

	var getAreas = function(){
		var areas = [
			{
				id: 1,
				name: "Днепр"
			},
			{
				id: 2,
				name: "Киев"
			},
			{
				id: 3,
				name: "Винница"
			},
			{
				id: 4,
				name: "Москва"
			}
		];
		return areas;
	};

	$scope.checkedAreas = [];
	$scope.checkedLimit = 3;
	$scope.checkedArea = function(active, area){
		if(area.id === 0){
			$scope.active = false;
		}else{
			if(active){
				if($scope.checkedAreas.length < 3){
					$scope.checkedAreas.push(area);
				}
			}else{
				$scope.checkedAreas.splice($scope.checkedAreas.indexOf(area), 1);
			}
		}
	};

	$scope.checkAll = function(){
		$scope.areas.forEach(function(value){
			value.active = false;
			$scope.checkedAreas = [];
		});
	};

	$scope.areas = getAreas();

	$scope.changeShowAvatar = function(flag){			
		UserService.changeShowAvatar(flag ? 1 : 0)
			.then(
				function(res){
					console.log(res);
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
			$scope.consoleLog = res;
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