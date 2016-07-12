angular.module('placePeopleApp')
	.factory('PublicationService', ['$http', '$q', '$location', function($http, $q, $location){

		var path = $location.protocol() + '://' + $location.host() + '/';

		return	{
			getUserPublications: getUserPublications,						
			createPublication: createPublication,
			updatePublication: updatePublication,
			deletePublication: deletePublication,
			addCommentPublication: addCommentPublication,
			getAllCommentsPublication: getAllCommentsPublication,
			deleteCommentPublication: deleteCommentPublication,
			addCommentLike: addCommentLike,
			addPublicationLike: addPublicationLike,
			getSinglePublication: getSinglePublication,
			getSubscribers: getSubscribers,
			getSubscription: getSubscription,
			complaintCommentAuthor:	complaintCommentAuthor,
			complaintPubAuthor: complaintPubAuthor

		}

		function getSubscribers(userId){
			var defer = $q.defer();
			$http.get("user/" + userId + "/subscribers")
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}

		function getSubscription(userId){
			var defer = $q.defer();
			$http.get("user/" + userId + "/subscription")
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}

		function addCommentPublication(pubId, pubText, images, videos){
			var formData = new FormData();
			formData.append('text', pubText);			
			images.forEach(function (img) {
				formData.append('images[]', img);
			});
			videos.forEach(function (video) {
				formData.append('videos[]', video);
			});
			return $http({
				method: 'POST',
				url: 'publication/comment/store/' + pubId,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
				data: formData
			})
		}

		function addCommentLike(commentId){
			var defer = $q.defer();
			$http.get("publication/comment/like/" + commentId)
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}

		function addPublicationLike(pubId){
			var defer = $q.defer();
			$http.get("publication/like/" + pubId)
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}

		function getAllCommentsPublication(pubId){
			var defer = $q.defer();
			$http.get("publication/comment/" + pubId)
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}

		function getSinglePublication(pubId){
			var defer = $q.defer();
			$http.get("publication/show/" + pubId)
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}

		function deleteCommentPublication(commentId){
			var defer = $q.defer();
			$http.get("publication/comment/destroy/" + commentId)
				.success(function (response){
					defer.resolve(response);
				})
				.error(function (error){
					defer.reject(error);
				});
			return defer.promise;
		}
		

		function getUserPublications(userId, offset){
				var defer = $q.defer();
				var limit = 12;			
				var data = {
					'offset': offset,
					'limit' : limit
				}
				$http.post(path + 'user/'+userId+'/publication', data)
						.success(function (response){              
								defer.resolve(response);
						})
						.error(function (error){
								defer.reject(error);
						});
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
		function updatePublication(pubId, text, isAnon, isMain, images, videos, delete_videos, delete_images){
			
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
            delete_images.forEach(function (del_img) {            	
                data.append('delete_images[]', del_img);
            });
            delete_videos.forEach(function (del_video) {
                data.append('delete_videos[]', del_video);
            });                       
            
            var config = {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                },            
                defer = $q.defer();                
                    $http.post(path + 'publication/update/' + pubId, data, config)
                        .success(function (response){
                            defer.resolve(response);
                        })
                        .error(function (error){
                            defer.reject(error);
                        });
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
		function complaintCommentAuthor(commentId, compCat){ 				
				var defer = $q.defer();
				var data = {
					'comment_id': commentId,
					'complaint_category_id': compCat
				};
				$http.post(path + 'publication/comment/complaint', data)
						.success(function (response){              
								defer.resolve(response);
						})
						.error(function (error){
								defer.reject(error);
						});
				return defer.promise;        
		}
		function complaintPubAuthor(pubId, compCat){ 				
				var defer = $q.defer();
				var data = {
					'publication_id': pubId,
					'complaint_category_id': compCat
				};
				$http.post(path + 'need/to/change/route', data)
						.success(function (response){              
								defer.resolve(response);
						})
						.error(function (error){
								defer.reject(error);
						});
				return defer.promise;        
		}		
	
	}]);