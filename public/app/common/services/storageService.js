angular.module('placePeopleApp')
	.factory('storageService', ['$window', function($window){
		return{
			setStorageItem: setStorageItem,			
			getStorage: getStorage,			
			deleteStorage: deleteStorage
		}

		function setStorageItem(key, value){
			$window.localStorage.setItem(key, value);			
		}
		function getStorage(){
			return $window.localStorage;
		}
		function deleteStorage(){
			$window.localStorage.clear();
		}
}]);