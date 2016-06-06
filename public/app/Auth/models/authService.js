angular.module('placePeopleApp')
	.factory('AuthService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getCountries: getCountries
		}

		function getCountries(){
                var data = {},
                defer = $q.defer();
                    $http.get(path + 'country/')
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
                return defer.promise;
            }


		
	}]);