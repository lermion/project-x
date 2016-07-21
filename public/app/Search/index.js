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
                controllerAs: 'vm'
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
