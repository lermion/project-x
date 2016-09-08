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
			changePwd: changePwd,
			isClosedRegistration: isClosedRegistration,
			checkInviteCode: checkInviteCode,
			getAreas: getAreas
		}

		function getCountries(){
			var defer = $q.defer();
				$http.get(path + 'country/')
					.success(function (response){
						defer.resolve(response);
					})
					.error(function (error){
						defer.reject(error);
					});
			return defer.promise;
		}

		function getAreas(){
			var defer = $q.defer();
				$http.get("auth/get_scope")
					.success(function (response){
						defer.resolve(response);
					})
					.error(function (error){
						defer.reject(error);
					});
			return defer.promise;
		}

		function checkInviteCode(code){
			var defer = $q.defer();
				$http.get("auth/verification_code/" + code)
					.success(function (response){
						defer.resolve(response);
					})
					.error(function (error){
						defer.reject(error);
					});
			return defer.promise;
		}

		function isClosedRegistration(){
			var defer = $q.defer();
				$http.get("auth/closed_registration")
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
			var defer = $q.defer();
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
			var defer = $q.defer();
				$http.post(path + 'auth/check_sms', data)
					.success(function (response){
						defer.resolve(response);
					})
					.error(function (error){
						defer.reject(error);
					});
			return defer.promise;
		   }

		function registerUser(first, last, gender, login, pwd, countryId, avatar, userId, originalAvatar){           
			var data = new FormData();
			data.append('first_name', first);
			data.append('last_name', last);
			data.append('gender', gender);
			data.append('login', login);
			data.append('password', pwd);
			data.append('country_id', countryId);
			data.append('avatar', avatar);            
			data.append('original_avatar', originalAvatar);            
			var config = {
					headers: {
						'Content-Type': undefined
					},
					transformRequest: angular.identity
				},            
				defer = $q.defer();
					$http.post(path + 'user/add_first_info', data, config)
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
			var defer = $q.defer();
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
			var defer = $q.defer();
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
			var defer = $q.defer();
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
			var defer = $q.defer();
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
			var defer = $q.defer();
					$http.post(path + 'password/amend', data)
						.success(function (response){
							defer.resolve(response);
						})
						.error(function (error){
							defer.reject(error);
						});
				return defer.promise;
		}
	}]);