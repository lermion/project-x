angular.module('placePeopleApp')
	.factory('AuthService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getCountries: getCountries,
			sendMessage: sendMessage,
			checkSms: checkSms,
			registerUser: registerUser,
			userLogIn: userLogIn,
			userLogOut: userLogOut,
			sendRestoreSms: sendRestoreSms,
			validateRestoreSms: validateRestoreSms,
			changePwd: changePwd
		}

		function getCountries(){                
            defer = $q.defer();
                $http.get(path + 'country')
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
            return defer.promise;
        }

        function sendMessage(phone, countryId){
    		var data = {
    			phone: phone,
    			country_id: countryId
    		};             
            defer = $q.defer();
                $http.post(path + 'auth/create', data)
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
            return defer.promise;
        } 

        function checkSms(code){
    		var data = {
    			sms_code: code
    		};             
            defer = $q.defer();
                $http.post(path + 'auth/check_sms', data)
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
            return defer.promise;
           }

        function registerUser(first, last, login, pwd, countryId, userId){        	
			var data = {
        			first_name: first,
        			last_name: last,
        			login: login,
        			password: pwd,
        			country_id: countryId        			
        		};             
                defer = $q.defer();
                    $http.post(path + 'user/update/' + userId, data)
	                    .success(function (response){
	                        defer.resolve(response);
	                    })
	                    .error(function (error){
	                        defer.reject(error);
	                    });
                return defer.promise;
        	}

        function userLogIn(login, pwd){        	
			var data = {        			
        			login: login,
        			password: pwd
        		};             
                defer = $q.defer();
                    $http.post(path + 'auth', data)
	                    .success(function (response){
	                        defer.resolve(response);
	                    })
	                    .error(function (error){
	                        defer.reject(error);
	                    });
                return defer.promise;
        }

        function userLogOut(login, pwd){
                defer = $q.defer();
                    $http.get(path + 'auth/log_out')
	                    .success(function (response){
	                        defer.resolve(response);
	                    })
	                    .error(function (error){
	                        defer.reject(error);
	                    });
                return defer.promise;
        }

        function sendRestoreSms(phone){        	
			var data = {        			
        			phone: phone
        		};             
                defer = $q.defer();
                    $http.post(path + 'password/restore', data)
	                    .success(function (response){
	                        defer.resolve(response);
	                    })
	                    .error(function (error){
	                        defer.reject(error);
	                    });
                return defer.promise;
        }

        function validateRestoreSms(code){        	
			var data = {        			
        			sms_code: code
        		};             
                defer = $q.defer();
                    $http.post(path + 'password/validate_code', data)
	                    .success(function (response){
	                        defer.resolve(response);
	                    })
	                    .error(function (error){
	                        defer.reject(error);
	                    });
                return defer.promise;
        }

        function changePwd(pwd){        	
			var data = {        			
        			password: pwd        			
        		};             
                defer = $q.defer();
                    $http.post(path + 'password/update', data)
	                    .success(function (response){
	                        defer.resolve(response);
	                    })
	                    .error(function (error){
	                        defer.reject(error);
	                    });
                return defer.promise;
        }


		
	}]);