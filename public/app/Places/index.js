(function (angular) {
    'use strict';

    angular
        .module('app.places', ['ymaps'])
        .config(routes);


    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('places', {
                url: '/places',
                templateUrl: '../../app/Places/views/places.html',
                controller: 'PlacesCtrl',
                controllerAs: 'vm',
                resolve: {
                    countries: ['placesService', '$stateParams', '$state', '$q', 'ngDialog', function (placesService, $stateParams, $state, $q, ngDialog) {
                        var deferred = $q.defer();

                        placesService.getCountries()
                            .then(function (data) {

                                deferred.resolve(data);
                            });

                        return deferred.promise;

                    }]
                }
            })
            .state('place', {
                url: '/place/:placeName',
                templateUrl: '../../app/Places/views/place.html',
                controller: 'PlaceCtrl',
                controllerAs: 'vm'
                //params: {
                //    groupId: null
                //},
                //resolve: {
                //    group: ['groupsService', '$stateParams', '$q', 'ngDialog', function (groupsService, $stateParams, $q, ngDialog) {
                //        var deferred = $q.defer();
                //        var group;
                //        groupsService.getGroup($stateParams.groupName)
                //            .then(function (data) {
                //                if (!data) {
                //                    deferred.reject();
                //                    ngDialog.open({
                //                        template: '../app/Groups/views/popup-notfound-group.html',
                //                        name: 'modal-notfound-group',
                //                        className: 'popup-delete-group ngdialog-theme-default'
                //                    });
                //                } else {
                //                    groupsService.getPublications(data.id)
                //                        .then(function (publications) {
                //                            if (publications) {
                //                                data.publications = publications;
                //                            }
                //                            deferred.resolve(data);
                //                        });
                //
                //                }
                //            });
                //        return deferred.promise;
                //    }]
                //}
            })
            .state('place.publications', {
                url: '/publications',
                templateUrl: '../../app/Places/views/place-publications.html'
            })
            .state('place.chat', {
                url: '/chat',
                templateUrl: '../../app/Places/views/place-chat.html'
            })
            .state('place.people', {
                url: '/people',
                templateUrl: '../../app/Places/views/place-people.html'
            })
            .state('place.files', {
                url: '/files',
                templateUrl: '../../app/Places/views/place-files.html'
            })
            .state('places.add', {
                url: '/add',
                templateUrl: '../../app/Places/views/places-presets.html'
            })
            .state('places.add.common', {
                url: '/common',
                templateUrl: '../../app/Places/views/places-add-common.html'
            })
            .state('places.add.dynamic', {
                url: '/dynamic',
                templateUrl: '../../app/Places/views/places-add-dynamic.html'

            });
    }

})(angular);
