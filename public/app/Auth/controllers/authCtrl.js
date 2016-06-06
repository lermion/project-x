angular.module('placePeopleApp')
    .controller('authCtrl', ['$scope', 'AuthService', function($scope, AuthService){

    	AuthService.getCountries()
    		.then(function(res){
    			$scope.countries = res;		        
		      }, function(err){
		        console.log(err);
		      });

    	$scope.phoneRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    	$scope.userRegister = function(){
    		var countryId = parseInt($scope.countryId);
    		var phoneNum = parseInt($scope.phoneNumber);
    		console.log(countryId, phoneNum);
    	};

      

    }]);
