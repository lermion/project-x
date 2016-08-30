(function (angular) {
    'use strict';

    angular
        .module('app.feed', [])
        .config(routes);
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);


    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('feed', {
                url: '/feed',
                templateUrl: '../../app/Feed/views/feed.html',
                controller: 'feedCtrl',
                showHeader: true,
                requireLogin: true,
                resolve: {
                    profile: ['$rootScope', '$q', '$state', '$stateParams', 'UserService', function ($rootScope, $q, $state, $stateParams, UserService) {

                        return UserService.getUserData($rootScope.user.username)
                            .then(
                                function (data) {
                                    return $stateParams.userId = data.id;
                                },
                                function (error) {
                                    $state.go("404");
                                }
                            );

                    }],
                    publications: ['$rootScope', '$q', '$state', '$stateParams', 'FeedService', function ($rootScope, $q, $state, $stateParams, FeedService) {
                        var deferred = $q.defer();

                        FeedService.getPublications(0)
                            .then(
                                function (data) {
                                    deferred.resolve(data);
                                },
                                function (error) {
                                    deferred.reject();
                                    $state.go("404");
                                }
                            );

                        return deferred.promise;
                    }]
                }

            });
    }

})(angular);
