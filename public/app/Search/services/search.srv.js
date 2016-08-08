(function () {
    'use strict';

    angular
        .module('app.search')
        .factory('searchService', searchService);

    searchService.$inject = ['$http'];

    function searchService($http) {

        var results = [];


        return {
            search: search
        };

        ////////////

        function search(searchObj, isRestore) {

            if (isRestore) {
                return results;
            }

            var fd = new FormData();

            fd.append('name', searchObj.str);
            fd.append('usersearch', searchObj.byUsers);
            fd.append('publicationsearch', searchObj.byPublications);
            fd.append('placesearch', searchObj.byPlaces);
            fd.append('groupsearch', searchObj.byGroups);

            return $http({
                method: 'POST',
                url: 'search',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(searchComplete)
                .catch(searchFailed);

            function searchComplete(response) {
                results = response.data;
                return results;
            }

            function searchFailed(error, status) {
                console.error('XHR Failed for search. ' + status);
            }
        }


    }

})();
