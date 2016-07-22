(function () {
    'use strict';

    angular
        .module('app.places')
        .factory('placesService', placesService);

    placesService.$inject = ['$http'];

    function placesService($http) {

        var countries = [];

        return {
            getCounterNewPlaces: getCounterNewPlaces,
            getCountries: getCountries,
            getCities: getCities
        };

        ////////////

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


    }

})();
