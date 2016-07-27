(function (angular) {
    'use strict';

    angular
        .module('app.search', [])
        .config(routes);


    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('search', {
                url: '/search',
                templateUrl: '../../app/Search/views/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'vm',
                params: {
                    searchObj: {
                        str: null,
                        byUsers: true,
                        byPublications: true,
                        byPlaces: true,
                        byGroups: true
                    }
                },
                resolve: {
                    results: ['searchService', '$stateParams', '$state', '$q', function (searchService, $stateParams, $state, $q) {
                        var deferred = $q.defer();

                        searchService.search($stateParams.searchObj)
                            .then(function (data) {

                                deferred.resolve(data);
                            });

                        return deferred.promise;

                    }]
                }
            })
            .state('search.people', {
                url: '/people',
                templateUrl: '../../app/Search/views/search-people.html'
            })
            .state('search.publications', {
                url: '/publications',
                templateUrl: '../../app/Search/views/search-publications.html'
            })
            .state('search.places', {
                url: '/places',
                templateUrl: '../../app/Search/views/search-places.html'
            })
            .state('search.groups', {
                url: '/groups',
                templateUrl: '../../app/Search/views/search-groups.html'
            });
    }

})(angular);
