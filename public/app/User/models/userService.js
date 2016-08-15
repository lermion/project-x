angular.module('placePeopleApp')
	.factory('UserService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getUserData: getUserData,
            sign: sign,
            quickEdit: quickEdit,
            updateAvatar: updateAvatar,
            settingsEdit: settingsEdit,
            changeShowAvatar: changeShowAvatar,
            changeIsVisible: changeIsVisible,
            changeLockProfile: changeLockProfile,
            getSubscribers: getSubscribers,
            getCounterNewSubscribers: getCounterNewSubscribers,
            confirmSubscriber: confirmSubscriber


        };

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
                'user_quote': status
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
        function settingsEdit(name, lastname, status){
            var data = {
                'first_name': name,
                'last_name': lastname,
                'user_quote': status
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
        function changeShowAvatar(showAva){
            var data = {                
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
        function changeIsVisible(isVisible){
            var data = {
                'is_visible': isVisible
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
        function changeLockProfile(isPrivate){
            var data = {                
                'is_private': isPrivate
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
            data.append('avatar', avatar);                        
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

        function getSubscribers(userId) {
            return $http({
                method: 'GET',
                url: 'user/' + userId + '/subscribers',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getSubscribersComplete)
                .catch(getSubscribersFailed);

            function getSubscribersComplete(response) {
                return response.data;
            }

            function getSubscribersFailed(error, status) {
                console.log('XHR Failed for getMySubscribers. ' + status);
            }
        }

        /**
         * Gets the number of subscribers to be approved
         * @returns {*}
         */
        function getCounterNewSubscribers() {
            return $http({
                method: 'GET',
                url: 'user/count_not_confirmed',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getCounterNewSubscribersComplete)
                .catch(getCounterNewSubscribersFailed);

            function getCounterNewSubscribersComplete(response) {
                return response.data;
            }

            function getCounterNewSubscribersFailed(error, status) {
                console.log('XHR Failed for getCounterNewSubscribers. ' + status);
            }
        }

        /**
         * Confirmation of the subscriber
         * @returns {*}
         */
        function confirmSubscriber(subscriberId) {
            return $http({
                method: 'GET',
                url: 'user/subscribe/confirm/' + subscriberId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(confirmSubscriberComplete)
                .catch(confirmSubscriberFailed);

            function confirmSubscriberComplete(response) {
                return response.data;
            }

            function confirmSubscriberFailed(error, status) {
                console.log('XHR Failed for confirmSubscriber. ' + status);
            }
        }
        
	
	}]);