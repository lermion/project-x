angular.module('placePeopleApp')
    .config(['$urlRouterProvider', '$stateProvider', 'laddaProvider', '$metrikaProvider', '$locationProvider',
        function ($urlRouterProvider, $stateProvider, laddaProvider, $metrikaProvider, $locationProvider) {

            laddaProvider.setOption({
                style: 'expand-right',
                spinnerSize: 30,
                spinnerColor: '#ffffff'
            });

            $urlRouterProvider.otherwise('/404');

            $locationProvider.html5Mode(true);

            $metrikaProvider.configureCounter({id: 38912545, webvisor: true});

            $stateProvider
                .state('404', {
                    url: '/auth/404',
                    templateUrl: '../../app/Auth/views/404.html',
                    controller: 'authCtrl',
                    isLogin: true
                })
                .state('auth', {
                    url: '/',
                    templateUrl: '../../app/Auth/views/auth.html',
                    controller: 'authCtrl',
                    isLogin: true,
                    showHeader: true,
                    resolve: {
                        countries: function () {
                            return [];
                        }
                    }
                })
                .state('reg', {
                    url: '/auth/registration',
                    templateUrl: '../../app/Auth/views/reg.html',
                    controller: 'authCtrl',
                    isLogin: true,
                    showHeader: true,
                    resolve: {
                        countries: function ($rootScope, AuthService) {
                            return AuthService.getCountries()
                                .then(function (countries) {
                                    return countries;
                                });
                        }
                    }
                })
                .state('restore', {
                    url: '/auth/restore',
                    templateUrl: '../../app/Auth/views/restore.html',
                    controller: 'authCtrl',
                    isLogin: true,
                    showHeader: true,
                    resolve: {
                        countries: function () {
                            return [];
                        }
                    }
                })
                .state('login', {
                    url: '/auth/login',
                    templateUrl: '../../app/Auth/views/login.html',
                    controller: 'authCtrl',
                    isLogin: true,
                    showHeader: true,
                    resolve: {
                        countries: function () {
                            return [];
                        }
                    }
                })
                .state('static', {
                    url: '/static/:pageName',
                    templateUrl: '../../app/Static/views/static.html',
                    controller: 'staticCtrl',
                    showHeader: true,
                    isLogin: true
                })
                .state('subscribers', {
                    url: '/:username/subscribers/:id',
                    templateUrl: '../../app/User/views/popup-user-subscribers.html',
                    controller: 'userCtrl',
                    showHeader: true,
                    isLogin: false
                })
                .state('subscribes', {
                    url: '/:username/subscribes/:id',
                    templateUrl: '../../app/User/views/popup-user-subscribe.html',
                    controller: 'userCtrl',
                    showHeader: true,
                    isLogin: false
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: '../../app/Settings/views/settings.html',
                    controller: 'settingsCtrl',
                    showHeader: true,
                    isLogin: false
                })

                .state('feed', {
                    url: '/feed',
                    templateUrl: '../../app/Feed/views/feed.html',
                    controller: 'feedCtrl',
                    showHeader: true,
                    isLogin: false
                })
                // .state('feed-mobile', {
                //   url: 'feed/:pubId',
                //   templateUrl: '../../app/Feed/views/view-publication.html',
                //   controller: 'feedCtrl'
                // })
                // .state('feed-desktop', {
                //   url: 'feed/pubs/:pubId',
                //   templateUrl: '../../app/Feed/views/feed.html',
                //   controller: 'feedCtrl'
                // })
                .state('chat', {
                    url: '/chat',
                    templateUrl: '../../app/Chat/views/chat-main.html',
                    controller: 'chatCtrl',
                    showHeader: true,
                    isLogin: false
                })
                .state('chat.list', {
                    url: '/list',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-list.html',
                    showHeader: true,
                    isLogin: false
                })
                .state('chat.contacts', {
                    url: '/contacts',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-contacts.html',
                    showHeader: true,
                    isLogin: false
                })
                .state('chat.blocked', {
                    url: '/blocked',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-blocked.html',
                    showHeader: true,
                    isLogin: false
                })
                .state('chat.notification', {
                    url: '/settings',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-notification.html',
                    showHeader: true,
                    isLogin: false
                })
                .state('chat.mobile', {
                    url: '/m/',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-block.html',
                    showHeader: true,
                    isLogin: false
                })
                .state('chat.contact-mobile', {
                    url: '/c/',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/contact-block.html',
                    showHeader: true,
                    isLogin: false
                })

                /*User must be in the end*/
                .state('user', {
                    url: '/:username',
                    templateUrl: '../../app/User/views/user.html',
                    controller: 'userCtrl',
                    isLogin: true,
                    showHeader: true,
                    params: {
                        userId: null,
                        needToLogin: false
                    },
                    resolve: {
                        profile: ['$q', '$state', '$stateParams', 'UserService', function ($q, $state, $stateParams, UserService) {
                            var deferred = $q.defer();

                            UserService.getUserData($stateParams.username)
                                .then(
                                    function (data) {
                                        $stateParams.userId = data.id;
                                        deferred.resolve(data);
                                    },
                                    function (error) {
                                        deferred.reject();
                                        $state.go("404");
                                    }
                                );

                            return deferred.promise;
                        }],
                        publications: ['$q', '$stateParams', 'PublicationService', 'profile', function ($q, $stateParams, PublicationService, profile) {
                            var deferred = $q.defer();

                            PublicationService.getUserPublications($stateParams.userId, 0)
                                .then(
                                    function (res) {
                                        if (res.status) {
                                            deferred.resolve(res.publications);
                                        } else {
                                            if (res.error.code === "8") {

                                            } else if (res.error.code === "15") {
                                                $stateParams.needToLogin = true;
                                                deferred.resolve();
                                            }
                                        }
                                    },
                                    function (err) {
                                        console.log(err);
                                    }
                                );

                            return deferred.promise;
                        }]
                    }
                })
                .state('mobile-pub-view', {
                    url: '/:username/pub/:id',
                    templateUrl: '../../app/User/views/view-publication.html',
                    showHeader: true,
                    controller: 'userCtrl'
                })
                .state('desktop-pub-view', {
                    url: '/:username/publication/:id/:hash',
                    templateUrl: '../../app/User/views/user.html',
                    controller: 'userCtrl',
                    showHeader: true,
                    isLogin: false
                })


        }])
    .run(['$rootScope', function ($rootScope) {

        // Header counters
        $rootScope.counters = {
            groupsNew: null,
            placesNew: null,
            subscribersNew: null
        };

        // Search
        $rootScope.showSearch = false;

        // User menu (for publication, chats, groups, places
        $rootScope.showUserMenu = false;
        $rootScope.showUserMenuSecondary = false;

        // User geolocation
        ymaps.ready(getUserGeolocation);

        function getUserGeolocation() {
            ymaps.geolocation.get({
                provider: 'auto'
            }).then(function (result) {
                var metaData = result.geoObjects.get(0).properties.get('metaDataProperty');

                $rootScope.countryName = metaData.GeocoderMetaData.AddressDetails.Country.CountryName;

                //$scope.countries.forEach(function (elem) {
                //    if (elem.name === countryName) {
                //        $scope.newUserCountryId = +elem.id;
                //        console.log($scope.newUserCountryId);
                //    }
                //});
            });
        }
    }]);