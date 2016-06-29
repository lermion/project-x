angular.module('placePeopleApp')
	.factory('UserService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getUserData: getUserData,
            sign: sign,
            quickEdit: quickEdit,
            updateAvatar: updateAvatar,
            settingsEdit: settingsEdit
		}

		function getUserData(login){                
            var defer = $q.defer();
                $http.get(path + 'user/show/'+login)
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
            return defer.promise;
        }        

        function sign(userId){                
           var defer = $q.defer();
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

        function quickEdit(name, lastname, status){
            var data = {
                'first_name': name,
                'last_name': lastname,
                'status': status
            };
            var defer = $q.defer();
            $http.post(path + 'user/update', data)
                .success(function (response){
                    defer.resolve(response);
                })
                .error(function (error){
                    defer.reject(error);
                });
            return defer.promise;           
        }
        function settingsEdit(name, lastname, status, showAva, visible){
            var data = {
                'first_name': name,
                'last_name': lastname,
                'status': status,
                'is_visible': visible,
                'is_avatar': showAva
            };
            var defer = $q.defer();
            $http.post(path + 'user/update', data)
                .success(function (response){
                    defer.resolve(response);
                })
                .error(function (error){
                    defer.reject(error);
                });
            return defer.promise;           
        }

        function updateAvatar(avatar){            
            var data = new FormData();            
            data.set('avatar', avatar, avatar.filename);                        
            var config = {
                    headers: {
                        'Content-Type': undefined,                        
                    },
                    transformRequest: angular.identity
                },            
                defer = $q.defer();            
                $http.post(path + 'user/update', data, config)                      
                    .success(function (response){                        
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
                return defer.promise;
            }
        
	
	}]);