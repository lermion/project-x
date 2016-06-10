angular.module('placePeopleApp')
	.factory('StaticService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getStatic: getStatic
            // getStaticNames: getStaticNames
		}

		function getStatic(staticName){                
            defer = $q.defer();
                $http.get(path + 'static_page/'+staticName)
                    .success(function (response){
                        defer.resolve(response);
                    })
                    .error(function (error){
                        defer.reject(error);
                    });
            return defer.promise;
        }
        // function getStaticNames(){                
        //     defer = $q.defer();
        //         $http.get(path + 'static_page/get/name')
        //             .success(function (response){                        
        //                 defer.resolve(response);
        //             })
        //             .error(function (error){
        //                 defer.reject(error);
        //             });
        //     return defer.promise;
        // }
	
	}]);