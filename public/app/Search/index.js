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
                        str: '',
                        byUsers: true,
                        byPublications: true,
                        byPlaces: true,
                        byGroups: true
                    },
                    restoreSearchResult: true,
                    setActiveTab: false
                },
                resolve: {
                    results: ['searchService', '$state', '$stateParams', function (searchService, $state, $stateParams) {
                        console.info('Router: Search resolve');
                        if ($stateParams.searchObj.str !== '') {
                            return searchService.search($stateParams.searchObj, $stateParams.restoreSearchResult)
                                .then(function (data) {
                                    return data;
                                });
                        }

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
