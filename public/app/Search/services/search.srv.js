(function () {
    'use strict';

    angular
        .module('app.search')
        .factory('searchService', searchService);

    searchService.$inject = ['$http'];

    function searchService($http) {


        return {
            search: search
        };

        ////////////

        function search(searchObj) {

            var fd = new FormData();

            fd.append('name', searchObj.str);
            fd.append('usersearch', searchObj.byUsers);
            fd.append('publicationsearch', searchObj.byPublications);
            fd.append('placesearch', searchObj.byPlaces);
            fd.append('groupsearch', searchObj.byGroups);

            return $http({
                method: 'POST',
                url: 'place/counter_new_place',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(searchComplete)
                .catch(searchFailed);

            function searchComplete(response) {
                return response.data;
            }

            function searchFailed(error, status) {
                console.error('XHR Failed for search. ' + status);
            }
        }


    }

})();
