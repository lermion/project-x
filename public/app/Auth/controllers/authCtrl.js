angular.module('placePeopleApp')
    .controller('authCtrl', ['$scope', '$state', '$timeout', '$http', 'AuthService', 'ngDialog', 'storageService', '$window', 
    	function($scope, $state, $timeout, $http, AuthService, ngDialog, storageService, $window){
    	
    	$scope.$emit('authPoint', 'auth');

    	$timeout(function(){
    		$scope.dataLoaded = true;
    	}, 1300);

    	AuthService.getCountries()
    		.then(function(res){    			
    			$scope.countries = res;		        
		      }, function(err){
		        console.log(err);
		      });
    	$scope.phoneRegExp = /[0-9]{3,18}/;

    	$http.get('/static_page/get/name')
            .success(function (res){                 	
                $scope.staticPages = res;
            })
            .error(function (err){
                console.log(err);
            });
        var storage = storageService.getStorage();        

        if (storage.length) {
            $scope.userLogged = true;
            $scope.username = storage.username;
        }else{
            $scope.userLogged = false;
        }

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

    	$scope.loginPage = function(){
    		$scope.hideForm = true;
    		$state.go('login');
    	};

    	$scope.pwdRestore = function(){
    		state.go('restore');
    	};

    	$scope.setCoutryCode = function(){
    		var countryId = parseInt($scope.newUserCountryId);    		
	    	$scope.countries.forEach(function(country){
	    		if (country.id === countryId) {	    			
	    			$scope.phoneCode = country.code;	    			
	    		}
	    	});
    	};

    	$scope.calcPadding = function(){
    		return parseInt(angular.element(document.querySelector("#phone"))[0].clientWidth);
    	};

    	$scope.userRegisterS1 = function(){
    		if ($scope.newUserCountryId && $scope.newUserPhoneNumber) {
    			var countryId = parseInt($scope.newUserCountryId);
    			var phoneNum = parseInt($scope.phoneCode + $scope.newUserPhoneNumber);    			
    		} else{
    			$scope.newUserPhoneNumberErr = true;
    			return;
    		}    		
    		AuthService.sendMessage(phoneNum, countryId)
	    		.then(function(res){	    			
	    			if (res.status) {
	    				$scope.newUserId = res.user_id;
	    				$scope.regStep1 = true;
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });	
    	};

    	$scope.userRegisterS2 = function(){
    		if (!$scope.newUserSmsCode) {
    			$scope.newUserSmsCodeError = true;
    			return;
    		} else {
    			var code = parseInt($scope.newUserSmsCode);
    		}
    		AuthService.checkSms(code)
	    		.then(function(res){	    			
	    			if (res.status) {		   				
	    				$scope.regConfirmed = true;
	    			} else {
	    		$scope.newUserSmsCodeError = true;
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });			   
    	};
   
		$scope.myImage='';
	    $scope.myCroppedImage='';
	    var handleFileSelect = function(evt) {
	      var file = evt.currentTarget.files[0];
	      var reader = new FileReader();
	      reader.onload = function (evt) {
	        $scope.$apply(function($scope){
	          $scope.myImage = evt.target.result;
	          ngDialog.open({
					template: '../app/Auth/views/crop-image.html',
					className: 'ngdialog-theme-default',
					scope: $scope
				});
	        });
	      };
	      reader.readAsDataURL(file);
	    };
	    angular.element(document.querySelector('#avatarImg')).on('change', handleFileSelect);

	 	// function blobToFile(blob){
		// 	blob.lastModifiedDate = new Date();
		// 	blob.name = 'image';
		// 	return blob;
		// }	    

	    $scope.saveCropp = function(img, cropped){	    	
			$scope.croppedImg = img;
			$scope.croppedFile = cropped;			
			ngDialog.closeAll();				
	    };

    	$scope.userRegisterS3 = function(firstName, lastName, login, pwd, countryId, uId){
    		var errors = 0;
    		if (!firstName) {
    			$scope.newUserNameError = true;
    			errors++;
    		}
    		if (!lastName) {
    			$scope.newUserLastNameError = true;
    			errors++;
    		}
    		if (!login) {
    			$scope.newUserLoginError = true;
    			errors++;
    		}    		
    		if (!pwd || pwd.length<6) {
    			$scope.newUserPasswordError = true;
    			errors++;
    		}    			
    		if (errors > 0) {
    			return;
    		}

			AuthService.registerUser(firstName, lastName, login, pwd, countryId, $scope.croppedImg, uId)
	    		.then(function(res){	    			
	    			if (res.status) {	
	    				$scope.userRegistred = true;
	    				storageService.setStorageItem('username', login);
	    				$state.go('user', {username: login});	    				
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });
    	};

    	/*LOGIN PAGE*/    	
    	$scope.login = function(){
    		var login = $scope.userLogin;    		
    		var pwd = $scope.userPassword;    		
    		AuthService.userLogIn(login, pwd)
	    		.then(function(res){   			
	    			if (res.status) {
	    				storageService.setStorageItem('username', login);	    				
	    				$state.go('user', {username: login});	    				
	    			}	else{	    				
	    				$scope.loginError = true;	    				
	    			}    					        
			      }, function(err){
			        console.log(err);
			      });
    	};

    	$scope.keyPress = function(event){
    		if (event === 13) {
    			$scope.login();
    		}
    	};
    	
      /*RESTORE PAGE*/
		$scope.sendRestoreSms = function(){
			if (!$scope.restoreUserPhone) {
				$scope.restoreUserPhoneError = true;
				return;
			}
			AuthService.sendRestoreSms($scope.restoreUserPhone)
				.then(function(res){					
					if (res.status) {	    				
						$scope.smsSend = true;
					}else {
						$scope.restoreUserPhoneError = true;
					}	    					        
			      }, function(err){
			        console.log(err);
			      });			
		};

		$scope.sendRestoreCode = function(){
			if (!$scope.restoreUserSms) {
					$scope.restoreUserSmsError = true;
					return;
				} 
			AuthService.validateRestoreSms($scope.restoreUserSms)
				.then(function(res){					    			
					if (res.status) {	    				
						$scope.smsConfirmed = true;
					}     					        
			      }, function(err){
			        console.log(err);
			      });
		};

		$scope.setNewPwd = function(){      	
			if (!$scope.restoreUserPwd || !$scope.restoreUserPwdConf || $scope.restoreUserPwd != $scope.restoreUserPwdConf) {
				$scope.restoreUserPwdError = true;
				return;
			}			
			AuthService.changePwd($scope.restoreUserPwd)
				.then(function(res){					
					if (res.status) {
						$scope.changePwdSuccess = true;
						$timeout(function(){
				    		$state.go('login');
				    	}, 1500);
					}				        
			      }, function(err){
			        console.log(err);
			      });
		};

    }]);
