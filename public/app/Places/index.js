(function (angular) {
    'use strict';

    angular
        .module('app.places', [])
        .config(routes);


    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('places', {
                url: '/places',
                templateUrl: '../../app/Places/views/places.html',
                controller: 'PlacesCtrl',
                controllerAs: 'vm'
            })
            .state('places.add', {
                url: '/add',
                templateUrl: '../../app/Places/views/places-presets.html'
            })
            .state('places.add.university', {
                url: '/university',
                templateUrl: '../../app/Places/views/places-add-university.html'
            })
            .state('places.add.dynamic', {
                url: '/dynamic',
                templateUrl: '../../app/Places/views/places-add-dynamic.html'
            });
    }

})(angular);
