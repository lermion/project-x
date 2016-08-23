angular.module('placePeopleApp')
	.factory('StaticService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getStatic: getStatic,
            sendMailToAdmin: sendMailToAdmin
            // getPagesInfo: getPagesInfo        
		};

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

        function sendMailToAdmin(mail) {
            var fd = new FormData();

            fd.append('name', mail.name);
            fd.append('email', mail.email);
            fd.append('text', mail.text);

            return $http({
                method: 'POST',
                url: '/mail',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(sendMailToAdminComplete)
                .catch(sendMailToAdminFailed);

            function sendMailToAdminComplete(response) {
                return response.data;
            }

            function sendMailToAdminFailed(error) {
                console.error('XHR Failed for sendMailToAdmin. ' + error.data);
            }
        }

        // function getPagesInfo(){                
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