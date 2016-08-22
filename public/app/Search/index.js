(function (angular) {
    'use strict';

    angular
        .module('app.search', [])
        .config(routes);


    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('search', {
                url: '/search/:params',
                templateUrl: '../../app/Search/views/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'vm',
                showHeader: true,
                params: {
                    searchObj: {
                        str: '',
                        byUsers: true,
                        byPublications: true,
                        byPlaces: true,
                        byGroups: true
                    },
                    restoreSearchResult: false,
                    setActiveTab: true
                },
                resolve: {
                    results: ['$rootScope', 'searchService', '$state', '$stateParams', function ($rootScope, searchService, $state, $stateParams) {
                        console.info('Router: Search resolve');
                        $rootScope.showSearch = true;

                        $stateParams.searchObj.str = $stateParams.params;

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
                templateUrl: '../../app/Search/views/search-people.html',
                showHeader: true
            })
            .state('search.publications', {
                url: '/publications',
                templateUrl: '../../app/Search/views/search-publications.html',
                showHeader: true
            })
            .state('search.places', {
                url: '/places',
                templateUrl: '../../app/Search/views/search-places.html',
                showHeader: true
            })
            .state('search.groups', {
                url: '/groups',
                templateUrl: '../../app/Search/views/search-groups.html',
                showHeader: true
            });
    }

})(angular);
