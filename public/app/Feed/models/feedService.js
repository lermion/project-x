angular.module('placePeopleApp')
	.factory('FeedService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getPublications: getPublications
		}

		function getPublications(offset){			
			var defer = $q.defer();
			var limit = 10;			
			var data = {
				'offset': offset,
				'limit' : limit
			}
			$http.post("publication", data)
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}
	
	}]);