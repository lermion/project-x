angular.module('placePeopleApp')
	.factory('FeedService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getPublications: getPublications
		}

		function getPublications(){
			var defer = $q.defer();
			$http.get("publication")
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}
	
	}]);