angular.module('placePeopleApp')
    .factory('PublicationService', ['$http', '$q', '$location', function ($http, $q, $location) {

        var path = $location.protocol() + '://' + $location.host() + '/';

        return {
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
            getHiddenPublication: getHiddenPublication,
            getSubscribers: getSubscribers,
            getSubscription: getSubscription,
            complaintCommentAuthor: complaintCommentAuthor,
            complaintPubAuthor: complaintPubAuthor

        }

        function getSubscribers(userId) {
            var defer = $q.defer();
            $http.get("user/" + userId + "/subscribers")
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        function getSubscription(userId) {
            var defer = $q.defer();
            $http.get("user/" + userId + "/subscription")
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
            if (pubText) {
                formData.append('text', pubText);
            }
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

        function getHiddenPublication(pubId) {
            var defer = $q.defer();
            $http.get("one_publication/" + pubId)
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


        function getUserPublications(userId, offset) {
            var defer = $q.defer();
            var limit = 12;
            var data = {
                'offset': offset,
                'limit': limit
            }
            $http.post(path + 'user/' + userId + '/publication', data)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        function createPublication(publication) {
            var data = new FormData();
            var cover;

            data.append('text', publication.text);
            data.append('is_anonym', publication.isAnonym ? 1 : 0);
            data.append('is_main', publication.isMain);


            publication.images.forEach(function (img) {
                data.append('images[]', img, img.name);
            });
            if (publication.originalImages.length > 0) {
                publication.originalImages.forEach(function (img) {
                    data.append('original_images[]', img, img.name);
                });
            }

            data.append('cover', publication.cover, publication.cover.name);

            publication.videos.forEach(function (video) {
                data.append('videos[]', video);
            });

            data.append('in_profile', publication.inProfile ? 1 : 0);

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

        function updatePublication(pub) {

            var data = new FormData();

            data.append('text', pub.text);
            data.append('is_anonym', pub.isAnonym);
            data.append('is_main', pub.isMain);
            data.append('in_profile', pub.inProfile ? 1 : 0);

            if (pub.images.length > 0) {
                pub.images.forEach(function (img) {
                    data.append('images[]', img, img.name);
                });
            }


            if (pub.videos.length > 0) {
                pub.videos.forEach(function (video) {
                    data.append('videos[]', video, video.name);
                });
            }
            if (pub.deleteImages) {
                pub.deleteImages.forEach(function (id) {
                    data.append('delete_images[]', id);
                });
            }

            if (pub.deleteVideos) {
                pub.deleteVideos.forEach(function (id) {
                    data.append('delete_videos[]', id);
                });
            }


            if (pub.cover_image_id) {
                data.append('cover_image_id', pub.cover_image_id);
            }
            if (pub.cover_video_id) {
                data.append('cover_video_id', pub.cover_video_id);
            }

            if (pub.cover) {
                data.append('cover', pub.cover, pub.cover.name);
            }

            var config = {
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                },
                defer = $q.defer();
            $http.post(path + 'publication/update/' + pub.id, data, config)
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

        function complaintCommentAuthor(commentId, compCat) {
            var defer = $q.defer();
            var data = {
                'comment_id': commentId,
                'complaint_category_id': compCat
            };
            $http.post(path + 'publication/comment/complaint', data)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

        function complaintPubAuthor(pubId, compCat) {
            var defer = $q.defer();
            var data = {
                'publication_id': pubId,
                'complaint_category_id': compCat
            };
            $http.post(path + 'publication/complaint', data)
                .success(function (response) {
                    defer.resolve(response);
                })
                .error(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        }

    }]);