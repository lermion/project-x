(function () {
    'use strict';

    angular
        .module('app.search')
        .factory('searchService', searchService);

    searchService.$inject = ['$http'];

    function searchService($http) {


        return {
            getCounterNewPlaces: getCounterNewPlaces
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


    }

})();
