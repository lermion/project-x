angular.module('placePeopleApp')
    .controller('authCtrl', ['$scope', 'AuthService', function($scope, AuthService){

    	AuthService.getCountries()
    		.then(function(res){
    			$scope.countries = res;		        
		      }, function(err){
		        console.log(err);
		      });

    	$scope.phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    	$scope.userRegisterS1 = function(){
    		if ($scope.countryId && $scope.phoneNumber) {
    			var countryId = parseInt($scope.countryId);
    			var phoneNum = parseInt($scope.phoneNumber);
    		} else{
    			$scope.phoneNumberErr = true;
    			return;
    		}    		
    		AuthService.sendMessage(phoneNum, countryId)
	    		.then(function(res){
	    			if (res.status) {
	    				$scope.userId = res.user_id;
	    				$scope.regStep1 = true;
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      }); 

			   $scope.regStep1 = true;   		
    	};

    	$scope.userRegisterS2 = function(){    		
    		var code = parseInt($scope.smsCode);
    		AuthService.checkSms(code)
	    		.then(function(res){
	    			if (res.status) {		   				
	    				$scope.regConfirmed = true;
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });
			   $scope.regConfirmed = true;
    	};

    	$scope.userRegisterS3 = function(userId){
			var firstName = $scope.userName;
			var lastName = $scope.userLastName;
			var login = $scope.userLogin; 
			var pwd = $scope.userPassword; 
    		var countryId = parseInt($scope.countryId);
			AuthService.registerUser(firstName, lastName, login, pwd, countryId, userId)
	    		.then(function(res){
	    			if (res.status) {
	    				console.log(res);	    				
	    				$scope.userRegistred = true;
	    			}	    					        
			      }, function(err){
			        console.log(err);
			      });
    	}

      

    }]);
