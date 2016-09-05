angular.module('placePeopleApp')
	.factory('ChatService', ['$http', '$q', '$location', function ($http, $q, $location) {

		var path = $location.protocol() + '://' + $location.host() + '/';

		return {
			blockUser: blockUser,
			getLockedUsers: getLockedUsers,
			deleteChatContact: deleteChatContact,
			deleteChat: deleteChat,
			setNotification: setNotification,
			clearChat: clearChat,
			getChatFiles: getChatFiles,
			updateGroupChat: updateGroupChat,
			exitUserFromGroupChat: exitUserFromGroupChat,
			changeGroupChatAdmin: changeGroupChatAdmin,
			sendVideos: sendVideos,
			getVideo: getVideo
		};

		function sendVideos(messageId, videos){
			var data = new FormData();
			data.append("message_id", messageId);
			videos.forEach(function(video){
				data.append("videos[]", video);
			});
			return $http({
				method: 'POST',
				url: 'chat/videos',
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
				data: data
			})
		}

		function getVideo(videoId){
			var defer = $q.defer();
			$http.get('chat/get_video/' + videoId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function changeGroupChatAdmin(roomId, userId){
			var defer = $q.defer();
			$http.get('chat/exit_admin/' + roomId + "/" + userId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function blockUser(userId) {
			var defer = $q.defer();
			$http.get('chat/locked/' + userId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function exitUserFromGroupChat(roomId) {
			var defer = $q.defer();
			$http.get('chat/exit_user/' + roomId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function getLockedUsers() {
			var defer = $q.defer();
			$http.get('chat/get_locked_users')
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function updateGroupChat(roomId, name, status, avatar, users) {
			var defer = $q.defer();
			var data = new FormData();
			data.append('name', name);
			data.append('status', status);
			if(typeof avatar === "object"){
				data.append('avatar', avatar);
			}
			users.forEach(function (user) {
				data.append('id[]', user);
			});
			return $http({
				method: 'POST',
				url: 'chat/users/' + roomId,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
				data: data
			})
		}

		function deleteChatContact(roomId, userIdSub) {
			var defer = $q.defer();
			$http.get('chat/delete_user/' + roomId + '/' + userIdSub)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function deleteChat(roomId) {
			var defer = $q.defer();
			$http.get('chat/delete_chat/' + roomId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function setNotification(roomId) {
			var defer = $q.defer();
			$http.get('chat/notification/' + roomId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function clearChat(roomId) {
			var defer = $q.defer();
			$http.get('chat/correspondence_delete/' + roomId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}


		function addCommentPublication(pubId, pubText, images, videos) {
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

		function addCommentLike(commentId) {
			var defer = $q.defer();
			$http.get("publication/comment/like/" + commentId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function addPublicationLike(pubId) {
			var defer = $q.defer();
			$http.get("publication/like/" + pubId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function getAllCommentsPublication(pubId) {
			var defer = $q.defer();
			$http.get("publication/comment/" + pubId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function getSinglePublication(pubId) {
			var defer = $q.defer();
			$http.get("publication/show/" + pubId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function deleteCommentPublication(commentId) {
			var defer = $q.defer();
			$http.get("publication/comment/destroy/" + commentId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function getUserPublications(userId) {
			defer = $q.defer();
			$http.get(path + 'user/' + userId + '/publication')
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function createPublication(text, isAnon, isMain, videos, images) {
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
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function updatePublication(pubId, text, isAnon, isMain, images, videos, delete_videos, delete_images) {

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
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function deletePublication(pubId) {
			var defer = $q.defer();
			$http.get(path + 'publication/destroy/' + pubId)
				.success(function (response) {
					defer.resolve(response);
				})
				.error(function (error) {
					defer.reject(error);
				});
			return defer.promise;
		}

		function getChatFiles(chatRoomId) {

			return $http({
				method: 'GET',
				url: 'chat/file_chat/' + chatRoomId,
				headers: {'Content-Type': undefined},
				transformRequest: angular.identity,
				data: null
			})
				.then(getChatFilesComplete)
				.catch(getChatFilesFailed);

			function getChatFilesComplete(response) {
				return response.data;
			}

			function getChatFilesFailed(error, status) {
				console.error('XHR Failed for getChatFiles. ' + status);
			}
		}

	}]);