angular.module('placePeopleApp')
    .controller('authCtrl', ['$scope', '$state', '$timeout', 'AuthService', function($scope, $state, $timeout, AuthService){

    	$timeout(function(){
    		$scope.dataLoaded = true;
    	}, 1300);

    	$scope.hideForm = false;
    	

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
    	}

    	$scope.userRegisterS1 = function(){
    		// if ($scope.countryId && $scope.phoneNumber) {
    		// 	var countryId = parseInt($scope.countryId);
    		// 	var phoneNum = parseInt($scope.phoneNumber);
    		// } else{
    		// 	$scope.phoneNumberErr = true;
    		// 	return;
    		// }    		
    		// AuthService.sendMessage(phoneNum, countryId)
	    		// .then(function(res){
	    		// 	if (res.status) {
	    		// 		$scope.userId = res.user_id;
	    		// 		$scope.regStep1 = true;
	    		// 	}	    					        
			    //   }, function(err){
			    //     console.log(err);
			    //   }); 

			   $scope.regStep1 = true;   		
    	};

    	$scope.userRegisterS2 = function(){
    		// if (!$scope.smsCode) {
    		// 	$scope.smsCodeError = true;
    		// 	return;
    		// } else {
    		// 	var code = parseInt($scope.smsCode);
    		// }
    		// AuthService.checkSms(code)
	    	// 	.then(function(res){
	    	// 		if (res.status) {		   				
	    	// 			$scope.regConfirmed = true;
	    	// 		} else {
	    	// 	$scope.smsCodeError = true;
	    	// }	    					        
			   //    }, function(err){
			   //      console.log(err);
			   //    });
			   $scope.regConfirmed = true;
    	};

    	$scope.userRegisterS3 = function(userId){			

    		// var errors = 0;
    		// if (!$scope.userName) {
    		// 	$scope.userNameError = true;
    		// 	errors++;
    		// }
    		// if (!$scope.userLastName) {
    		// 	$scope.userLastNameError = true;
    		// 	errors++;
    		// }
    		// if (!$scope.userLogin) {
    		// 	$scope.userLoginError = true;
    		// 	errors++;
    		// }    		
    		// if (!$scope.userPassword || $scope.userPassword.length<6) {
    		// 	$scope.userPasswordError = true;
    		// 	errors++;
    		// }    			
    		// if (errors > 0) {
    		// 	return;
    		// }

   //  		var firstName = $scope.userName;
			// var lastName = $scope.userLastName;
			var login = $scope.userLogin.toLowerCase(); 
			// var pwd = $scope.userPassword; 
   //  		var countryId = parseInt($scope.countryId);
    		
			// AuthService.registerUser(firstName, lastName, login, pwd, countryId, userId)
	  //   		.then(function(res){
	  //   			if (res.status) {
	  //   				// console.log(res);	    				
	  //   				$scope.userRegistred = true;
	  //   				$location.state('/'+login);
	  //   			}	    					        
			//       }, function(err){
			//         console.log(err);
			//       });
			$scope.userRegistred = true;
	    	$state.go('public', {login: login});
    	}

    	/*RECOVERY PAGE*/

    	$scope.login = function(){
    		var login = $scope.userLogin;    		
    		$state.go('public', {login: login});
    	};

      

    }]);
