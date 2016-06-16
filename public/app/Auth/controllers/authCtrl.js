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
    		if (!$scope.newUserCountryId && !$scope.newUserPhoneNumber){
    			$scope.nupnErr = 'Заполните все поля';
    		} else if (!$scope.newUserCountryId) {
    			$scope.nupnErr = 'Выберите страну';
    		} else if(!$scope.newUserPhoneNumber){
    			$scope.nupnErr = 'Введён некорректный номер телефона';
    		} else{
    			var countryId = parseInt($scope.newUserCountryId);
    			var phoneNum = parseInt($scope.phoneCode + $scope.newUserPhoneNumber);
    		}
    		if($scope.nupnErr){
    			return;
    		}		
    		AuthService.sendMessage(phoneNum, countryId)
	    		.then(function(res){	    			    			
	    			if (res.status) {
	    				$scope.newUserId = res.user_id;
	    				$scope.regStep1 = true;
	    			} else {						
						if (parseInt(res.error.code) === 1) {
							$scope.nupnErr = 'Данный номер уже зарегистрирован';
						} else if(parseInt(res.error.code) === 3){
							$scope.nupnErr = 'Ошибка при отправке кода подтверждения';
						} else if(parseInt(res.error.code) === 10){
							var endDate = new Date(res.error.date);
							var today = new Date(((new Date).toISOString()).slice(0, 10));
							if (endDate>=today) {
								var diff = (endDate-today)/1000/60/60/24;
								$scope.nupnErr = 'Номер заблокирован для регистрации еще ' + diff + ' дней';
							} else {
								$scope.nupnErr = 'Номер заблокирован навсегда';
							}							
						}
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });	
    	};

    	$scope.userRegisterS2 = function(){
    		if (!$scope.newUserSmsCode) {
    			// newUserSmsCodeError = nuscErr
    			$scope.nuscErr = 'Введите код';
    			return;
    		} else {
    			var code = parseInt($scope.newUserSmsCode);
    		}
    		AuthService.checkSms(code)
	    		.then(function(res){	    				    			
	    			if (res.status) {		   				
	    				$scope.regConfirmed = true;
	    			} else {
	    				$scope.nuscErr = 'Неверный код';
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
			$scope.showEditAva = false;			
			ngDialog.closeAll();				
	    };

    	$scope.userRegisterS3 = function(firstName, lastName, login, pwd, countryId, uId){
    		var errors = 0;
    		if (!firstName) {
    			$scope.nunErr = 'Введите имя';
    			errors++;
    		}
    		if (!lastName) {
    			$scope.nusErr = 'Введите фамилию';
    			errors++;
    		}
    		if (!login) {
    			$scope.nulErr = 'Введите логин';
    			errors++;
    		}    		
    		if (!pwd || pwd.length<6) {
    			$scope.nupErr = 'Длина пароля должна быть не меньше 6 знаков';
    			errors++;
    		}    			
    		if (errors > 0) {
    			return;
    		}

			AuthService.registerUser(firstName, lastName, login, pwd, countryId, $scope.croppedImg, uId)
	    		.then(function(res){	    			
	    			if (res.status) {	
	    				$scope.userRegistred = true;
	    				storageService.setStorageItem('username', res.login);
	    				$state.go('user', {username: res.login});	    				
	    			} else {	    				
	    				if (parseInt(res.error.code) === 1) {
							$scope.nulErr = 'Данный логин уже занят';
						} else if(parseInt(res.error.code) === 8){
							$scope.nupErr = 'Прекратите эти поптытки';
						}
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
	    				storageService.setStorageItem('username', res.login);	    				
	    				$state.go('user', {username: res.login});	    				
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
				$scope.ruphErr = 'Введите корректный номер';
				return;
			}
			AuthService.sendRestoreSms($scope.restoreUserPhone)
				.then(function(res){										
					if (res.status) {	    				
						$scope.smsSend = true;
					}else {
						if (parseInt(res.error.code) === 3) {
							$scope.ruphErr = 'Ведутся технические работы. Попробуйте позже';
						} else if (parseInt(res.error.code) === 1) {
							$scope.ruphErr = 'По данному номеру нет зарегистрированных пользователей';
						}
						
					}	    					        
			      }, function(err){
			        console.log(err);
			      });			
		};

		$scope.sendRestoreCode = function(){
			if (!$scope.restoreUserSms) {
					$scope.rusError = 'Введите код';
					return;
				} 
			AuthService.validateRestoreSms($scope.restoreUserSms)
				.then(function(res){					    			
					if (res.status) {	    				
						$scope.smsConfirmed = true;
					} else{						
						if (parseInt(res.error.code) === 4) {
							$scope.rusError = 'Введён неверный код';
						}
					}    					        
			      }, function(err){
			        console.log(err);
			      });
		};

		$scope.setNewPwd = function(){      	
			if (!$scope.restoreUserPwd || !$scope.restoreUserPwdConf || $scope.restoreUserPwd != $scope.restoreUserPwdConf) {
				$scope.rupErr = 'Пароли не совпадают';				
			} else if ($scope.restoreUserPwd.length < 6) {
				$scope.rupErr = 'Длина пароля должна быть от 6 символов';
			}	
			if ($scope.rupErr) {
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
