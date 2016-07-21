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
            });
    }

})(angular);
