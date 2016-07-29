(function (angular) {
    'use strict';

    angular
        .module('app.places', ['yaMap', 'ngFileUpload', 'angucomplete-alt'])
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
                    places: ['placesService', '$stateParams', '$state', '$q', 'ngDialog', function (placesService, $stateParams, $state, $q, ngDialog) {
                        var deferred = $q.defer();

                        placesService.getPlaces()
                            .then(function (data) {

                                deferred.resolve(data);
                            });

                        return deferred.promise;

                    }],
                    countries: ['placesService', '$stateParams', '$state', '$q', 'ngDialog', function (placesService, $stateParams, $state, $q, ngDialog) {
                        var deferred = $q.defer();

                        placesService.getCountries()
                            .then(function (data) {

                                deferred.resolve(data);
                            });

                        return deferred.promise;

                    }],
                    typeStatic: ['placesService', '$stateParams', '$state', '$q', 'ngDialog', function (placesService, $stateParams, $state, $q, ngDialog) {
                        var deferred = $q.defer();

                        placesService.getPlaceTypeStatic()
                            .then(function (data) {

                                deferred.resolve(data);
                            });

                        return deferred.promise;

                    }],
                    typeDynamic: ['placesService', '$stateParams', '$state', '$q', 'ngDialog', function (placesService, $stateParams, $state, $q, ngDialog) {
                        var deferred = $q.defer();

                        placesService.getPlaceTypeDynamic()
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
                controllerAs: 'vm',
                params: {
                    placeId: null
                },
                resolve: {
                    place: ['placesService', '$state', '$stateParams', '$q', 'ngDialog', function (placesService, $state, $stateParams, $q, ngDialog) {
                        var deferred = $q.defer();

                        placesService.getPlace($stateParams.placeName)
                            .then(function (data) {
                                if (data.id) {
                                    placesService.getPublications(data.id)
                                        .then(function (publications) {
                                            if (publications) {
                                                data.publications = publications;
                                            }
                                            deferred.resolve(data);
                                        });
                                } else if (!data.status && data.error.code === '15') {
                                    deferred.reject();
                                    $state.go('auth');
                                } else if (!data.status && data.error.code === '6') {
                                    deferred.reject();
                                    ngDialog.open({
                                        template: '../app/Place/views/popup-notfound-place.html',
                                        name: 'modal-notfound-group',
                                        className: 'popup-delete-group ngdialog-theme-default'
                                    });
                                }
                            });

                        return deferred.promise;
                    }]
                }
            })
            .state('place.edit', {
                url: '/edit',
                params: {
                    isDynamicPlace: null
                },
                templateUrl: function (stateParams) {
                    if (stateParams.isDynamicPlace) {
                        return '../../app/Places/views/place-edit-dynamic.html'
                    } else {
                        return '../../app/Places/views/place-edit-static.html'
                    }
                }
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
                templateUrl: '../../app/Places/views/places-add-common.html',
                params: {
                    activeTypePlaceId: null
                }
            })
            .state('places.add.dynamic', {
                url: '/dynamic',
                templateUrl: '../../app/Places/views/places-add-dynamic.html'

            });
    }

})(angular);
