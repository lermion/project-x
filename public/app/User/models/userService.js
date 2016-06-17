angular.module('placePeopleApp')
	.factory('UserService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getUserData: getUserData,
            sign: sign,
            quickEdit: quickEdit
		}

		function getUserData(login){                
            defer = $q.defer();
                $http.get(path + 'user/show/'+login)
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
            return defer.promise;
        }
        function quickEdit(name, lastname, status, userId){
            var data = {
                'first_name': name,
                'last_name': lastname,
                'status': status
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

        function sign(userId){                
            defer = $q.defer();
            var data = {
                user_id: userId
            };            
            $http.post(path + 'user/subscribe/store', data)
                .success(function (response){
                    defer.resolve(response);
                })
                .error(function (error){
                    defer.reject(error);
                });            
            return defer.promise;
        }
        
	
	}]);