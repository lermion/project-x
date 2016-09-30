angular.module('placePeopleApp')
	.factory('storageService', ['$rootScope', '$window', '$q', '$http', function($rootScope, $window, $q, $http){
		return{
			setStorageItem: setStorageItem,			
			getStorage: getStorage,			
			deleteStorage: deleteStorage,
			isUserAuthorized: isUserAuthorized
		};

		function setStorageItem(key, value){
			$window.localStorage.setItem(key, value);

			$rootScope.$broadcast('storage:update');
			//console.info('localStorage updated - ' + key + ' ' + value);
		}
		function isUserAuthorized(){
			var defer = $q.defer();
			$http.get("authorization").success(function (response){
				defer.resolve(response);
			})
			.error(function (error){
				defer.reject(error);
			});
			return defer.promise;
		}
		function getStorage(){
			return $window.localStorage;
		}
		function deleteStorage(){
			$window.localStorage.removeItem("firstName");
			$window.localStorage.removeItem("lastName");
			$window.localStorage.removeItem("loggedUserAva");
			$window.localStorage.removeItem("userId");
			$window.localStorage.removeItem("username");
			$window.localStorage.removeItem("pubView");
			$window.localStorage.removeItem("countryId");

			$rootScope.$broadcast('storage:delete');
			console.info('localStorage deleted');
		}
}]);