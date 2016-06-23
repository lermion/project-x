angular.module('placePeopleApp')
	.factory('PublicationService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getMainPublications: getMainPublications,
            getUserPublications: getUserPublications,
            getPublication: getPublication,
            createPublication: createPublication,
            updatePublication: updatePublication,
            deletePublication: deletePublication,
            likePublication: likePublication,
            getPublicationComments: getPublicationComments,
            addPublicationComment: addPublicationComment,
            deletePublicationComment: deletePublicationComment

		}

    function getMainPublications(){
        console.log();
        return defer.promise;
    }
    function getUserPublications(userId){        
        defer = $q.defer();
        $http.get(path + 'user/'+userId+'/publication')
            .success(function (response){              
                defer.resolve(response);
            })
            .error(function (error){
                defer.reject(error);
            });
        return defer.promise;
    }
    function getPublication(){
        console.log();
        return defer.promise;
    }
    function createPublication(text, isAnon, isMain, videos, images){            
        var data = new FormData();
            data.append('text', text);
            data.append('is_anonym', isAnon);
            data.append('is_main', isMain);            
            images.forEach(function (img) {
                data.append('images[]', img);
            });
            videos.forEach(function (video) {
                data.append('videos[]', video);
            });
            var config = {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                },            
                defer = $q.defer();
                    $http.post(path + 'publication/store', data, config)
                        .success(function (response){
                            defer.resolve(response);
                        })
                        .error(function (error){
                            defer.reject(error);
                        });
                return defer.promise;
    }
    function updatePublication(){
        console.log();
        return defer.promise;
    }
    function deletePublication(pubId){        
        var defer = $q.defer();
        $http.get(path + 'publication/destroy/'+pubId)
            .success(function (response){              
                defer.resolve(response);
            })
            .error(function (error){
                defer.reject(error);
            });
        return defer.promise;        
    }
    function likePublication(){
        console.log();
        return defer.promise;
    }
    function getPublicationComments(){
        console.log();
        return defer.promise;
    }
    function addPublicationComment(){
        console.log();
        return defer.promise;
    }
    function deletePublicationComment(){
        console.log();
        return defer.promise;
    }



		// function getUserData(login){                
  //           defer = $q.defer();
  //               $http.get(path + 'user/show/'+login)
  //                   .success(function (response){
  //                       defer.resolve(response);
  //                   })
  //                   .error(function (error){
  //                       defer.reject(error);
  //                   });
  //           return defer.promise;
  //       }
  //       function quickEdit(name, lastname, status, userId){
  //           var data = {
  //               'first_name': name,
  //               'last_name': lastname,
  //               'status': status
  //           };
  //           defer = $q.defer();
  //           $http.post(path + 'user/update', data)
  //               .success(function (response){
  //                   defer.resolve(response);
  //               })
  //               .error(function (error){
  //                   defer.reject(error);
  //               });
  //           return defer.promise;           
  //       }

  //       function sign(userId){                
  //           defer = $q.defer();
  //           var data = {
  //               user_id: userId
  //           };            
  //           $http.post(path + 'user/subscribe/store', data)
  //               .success(function (response){
  //                   defer.resolve(response);
  //               })
  //               .error(function (error){
  //                   defer.reject(error);
  //               });            
  //           return defer.promise;
  //       }
        
	
	}]);