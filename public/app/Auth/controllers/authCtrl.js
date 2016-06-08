angular.module('placePeopleApp')
    .controller('authCtrl', ['$scope', '$state', '$timeout', '$http', 'AuthService', function($scope, $state, $timeout, $http, AuthService){

    	$timeout(function(){
    		$scope.dataLoaded = true;
    	}, 1300);

    	AuthService.getCountries()
    		.then(function(res){
    			$scope.countries = res;		        
		      }, function(err){
		        console.log(err);
		      });

    	$scope.phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    	$scope.loginPage = function(){
    		$scope.hideForm = true;
    		$state.go('login');
    	};

    	$scope.pwdRestore = function(){
    		state.go('restore');
    	};

    	$scope.userRegisterS1 = function(){
    		if ($scope.newUserCountryId && $scope.newUserPhoneNumber) {
    			var countryId = parseInt($scope.newUserCountryId);
    			var phoneNum = parseInt($scope.newUserPhoneNumber);
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

    	$scope.userRegisterS3 = function(userId){
    		var errors = 0;
    		if (!$scope.newUserName) {
    			$scope.newUserNameError = true;
    			errors++;
    		}
    		if (!$scope.newUserLastName) {
    			$scope.newUserLastNameError = true;
    			errors++;
    		}
    		if (!$scope.newUserLogin) {
    			$scope.newUserLoginError = true;
    			errors++;
    		}    		
    		if (!$scope.newUserPassword || $scope.newUserPassword.length<6) {
    			$scope.newUserPasswordError = true;
    			errors++;
    		}    			
    		if (errors > 0) {
    			return;
    		}

    		var firstName = $scope.newUserName;
			var lastName = $scope.newUserLastName;
			var login = $scope.newUserLogin.toLowerCase(); 
			var pwd = $scope.newUserPassword; 
    		var countryId = parseInt($scope.newUserCountryId);    		
    		var uId = parseInt(userId);
    		    		
			AuthService.registerUser(firstName, lastName, login, pwd, countryId, uId)
	    		.then(function(res){
	    			if (res.status) {	
	    				$scope.userRegistred = true;
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
	    				$state.go('user', {username: login});
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      }); 
    	};

    	$scope.logOut = function(){
    		AuthService.userLogOut()
	    		.then(function(res){
	    			$state.go('login');
			      }, function(err){
			        console.log(err);
			      });
    	}

      /*RESTORE PAGE*/

		$scope.sendRestoreSms = function(){
			var phone = $scope.restoreUserPhone;
			AuthService.sendRestoreSms(phone)
				.then(function(res){					
					if (res.status) {	    				
						$scope.smsSend = true;
					}    					        
			      }, function(err){
			        console.log(err);
			      });
		};
		$scope.sendRestoreCode = function(){      	
			var code = $scope.restoreUserSms;
			AuthService.validateRestoreSms(code)
				.then(function(res){					    			
					if (res.status) {	    				
						$scope.smsConfirmed = true;
					}	    					        
			      }, function(err){
			        console.log(err);
			      });
			
		};
		$scope.setNewPwd = function(){      	
			if ($scope.restoreUserPwd != $scope.restoreUserPwdConf) {
				$scope.restoreUserPwdError = true;
				return;
			}
			var pwd = $scope.restoreUserPwd;
			AuthService.changePwd(pwd)
				.then(function(res){					
					if (res.status) {
						$state.go('login');
					}				        
		      }, function(err){
		        console.log(err);
		      });
		};

    }]);
