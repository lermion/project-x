(function () {
    'use strict';

    angular
        .module('app.places')
        .factory('placesService', placesService);

    placesService.$inject = ['$http'];

    function placesService($http) {

        var countries = [];

        return {
            getPlaces: getPlaces,
            getPlace: getPlace,
            addPlace: addPlace,
            getPublications: getPublications,
            getCounterNewPlaces: getCounterNewPlaces,
            getCountries: getCountries,
            getCities: getCities,
            inviteUsers: inviteUsers,
            setAdmin: setAdmin,
            getPlaceTypeStatic: getPlaceTypeStatic,
            getPlaceTypeDynamic: getPlaceTypeDynamic,
            subscribePlace: subscribePlace,
            updatePlace: updatePlace,
            deletePlace: deletePlace,
            removeUsers: removeUsers,
            setCreator: setCreator

        };

        ////////////

        function getPlaces() {

            return $http({
                method: 'GET',
                url: 'place/',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getPlacesComplete)
                .catch(getPlacesFailed);

            function getPlacesComplete(response) {
                countries = response.data;
                return countries;
            }

            function getPlacesFailed(error) {
                console.error('XHR Failed for getPlaces. ' + error.data);
            }


        }

        function getPlace(placeName) {

            return $http({
                method: 'GET',
                url: 'place/show/' + placeName,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getPlaceComplete)
                .catch(getPlaceFailed);

            function getPlaceComplete(response) {
                return response.data;
            }

            function getPlaceFailed(error) {
                console.error('XHR Failed for getPlace. ' + error.data);
            }
        }

        function addPlace(place) {

            var fd = new FormData();

            fd.append('name', place.name);
            fd.append('description', place.description);
            fd.append('city_id', place.city.id);
            fd.append('address', place.address);
            fd.append('coordinates_x', place.coordinates_x);
            fd.append('coordinates_y', place.coordinates_y);
            fd.append('type_place_id', place.category.id);

            if (place.isDynamic) {
                fd.append('expired_date', place.expired_date);
            }

            if (place.cover) {
                fd.append('cover', place.cover);
            }
            if (place.logo) {
                fd.append('avatar', place.logo);
            }

            return $http({
                method: 'POST',
                url: 'place/create',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(addPlaceComplete)
                .catch(addPlaceFailed);

            function addPlaceComplete(response) {
                return response.data;
            }

            function addPlaceFailed(error) {
                console.error('XHR Failed for addPlace. ' + error.data);
            }
        }

        function getPublications(placeId) {

            return $http({
                method: 'GET',
                url: 'place/' + placeId + '/publication',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getPublicationsComplete)
                .catch(getPublicationsFailed);

            function getPublicationsComplete(response) {
                return response.data;
            }

            function getPublicationsFailed(error) {
                console.error('XHR Failed for getPublications. ' + error.data);
            }
        }

        function getCounterNewPlaces(groupId, users) {

            return $http({
                method: 'GET',
                url: 'place/counter_new_place',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getCounterNewPlacesComplete)
                .catch(getCounterNewPlacesFailed);

            function getCounterNewPlacesComplete(response) {
                return response.data;
            }

            function getCounterNewPlacesFailed(error) {
                console.error('XHR Failed for getCounterNewPlaces. ' + error.data);
            }
        }

        function getCountries() {

            return $http({
                method: 'GET',
                url: 'country/',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getCountriesComplete)
                .catch(getCountriesFailed);

            function getCountriesComplete(response) {
                countries = response.data;
                return countries;
            }

            function getCountriesFailed(error) {
                console.error('XHR Failed for getCountries. ' + error.data);
            }


        }

        function getCities(countryId) {

            return $http({
                method: 'GET',
                url: 'city/' + countryId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getCitiesComplete)
                .catch(getCitiesFailed);

            function getCitiesComplete(response) {
                countries = response.data;
                return countries;
            }

            function getCitiesFailed(error) {
                console.error('XHR Failed for getCities. ' + error.data);
            }


        }

        function inviteUsers(placeId, users) {
            var fd = new FormData();

            angular.forEach(users, function (user) {
                fd.append('user_id[]', user.userId);
            });


            return $http({
                method: 'POST',
                url: 'place/invite/' + placeId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(inviteUsersComplete)
                .catch(inviteUsersFailed);

            function inviteUsersComplete(response) {
                return response.data;
            }

            function inviteUsersFailed(error) {
                console.error('XHR Failed for inviteUser. ' + error.data);
            }
        }

        function setAdmin(placeId, userId) {

            return $http({
                method: 'GET',
                url: 'place/set_user_admin/' + placeId + '/' + userId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(setAdminComplete)
                .catch(setAdminFailed);

            function setAdminComplete(response) {
                return response.data;
            }

            function setAdminFailed(error) {
                console.error('XHR Failed for setAdmin. ' + error.data);
            }
        }

        function getPlaceTypeStatic() {

            return $http({
                method: 'GET',
                url: 'place/type/static',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getPlaceTypeStaticComplete)
                .catch(getPlaceTypeStaticFailed);

            function getPlaceTypeStaticComplete(response) {
                return response.data;
            }

            function getPlaceTypeStaticFailed(error) {
                console.error('XHR Failed for getPlaceTypeStatic. ' + error.data);
            }
        }

        function getPlaceTypeDynamic() {

            return $http({
                method: 'GET',
                url: 'place/type/dynamic',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getPlaceTypeDynamicComplete)
                .catch(getPlaceTypeDynamicFailed);

            function getPlaceTypeDynamicComplete(response) {
                return response.data;
            }

            function getPlaceTypeDynamicFailed(error) {
                console.error('XHR Failed for getPlaceTypeDynamic. ' + error.data);
            }
        }

        function subscribePlace(placeId) {

            return $http({
                method: 'GET',
                url: 'place/subscription/' + placeId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(subscribePlaceComplete)
                .catch(subscribePlaceFailed);

            function subscribePlaceComplete(response) {
                return response.data;
            }

            function subscribePlaceFailed(error) {
                console.error('XHR Failed for subscribePlace. ' + error.data);
            }
        }

        function updatePlace(place) {
            var fd = new FormData();

            // required fields
            fd.append('description', place.description);
            fd.append('address', place.address);
            fd.append('city_id', place.city.id);
            fd.append('coordinates_x', place.coordinates_x);
            fd.append('coordinates_y', place.coordinates_y);
            fd.append('type_place_id', place.type_place.id);

            if (place.name) {
                fd.append('name', place.name);
            }
            if (place.cover) {
                fd.append('cover', place.cover);
            }
            if (place.avatar) {
                fd.append('avatar', place.avatar);
            }

            if (place.is_dynamic) {
                fd.append('expired_date', place.expired_date);
            }


            return $http({
                method: 'POST',
                url: 'place/update/' + place.id,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(updatePlaceComplete)
                .catch(updatePlaceFailed);

            function updatePlaceComplete(response) {
                return response.data;
            }

            function updatePlaceFailed(error, status) {
                console.error('XHR Failed for updatePlace. ' + status);
            }
        }

        function deletePlace(placeId) {

            return $http({
                method: 'GET',
                url: 'place/destroy/' + placeId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(deletePlaceComplete)
                .catch(deletePlaceFailed);

            function deletePlaceComplete(response) {
                return response.data;
            }

            function deletePlaceFailed(error) {
                console.error('XHR Failed for deletePlace. ' + error.data);
            }
        }

        function removeUsers(placeId, users) {
            var fd = new FormData();

            angular.forEach(users, function (id) {
                fd.append('user_id[]', id);
            });


            return $http({
                method: 'POST',
                url: 'place/delete_subscription/' + placeId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(removeUsersComplete)
                .catch(removeUsersFailed);

            function removeUsersComplete(response) {
                return response.data;
            }

            function removeUsersFailed(error, status) {
                console.error('XHR Failed for removeUsers. ' + status);
            }
        }

        function setCreator(placeId, adminId) {

            return $http({
                method: 'GET',
                url: 'place/set_admin_creator/' + placeId + '/' + adminId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(setCreatorComplete)
                .catch(setCreatorFailed);

            function setCreatorComplete(response) {
                return response.data;
            }

            function setCreatorFailed(error) {
                console.error('XHR Failed for setCreator. ' + error.data);
            }
        }


    }

})();
