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
                    url: '/404',
                    templateUrl: '../../app/404.html',
                    controller: 'Four04Controller',
                    requireLogin: false
                })
                .state('auth', {
                    url: '/auth',
                    templateUrl: '../../app/Auth/views/auth.html',
                    controller: 'authCtrl',
                    requireLogin: false,
                    showHeader: true,
                    resolve: {
                        countries: function () {
                            return [];
                        }
                    }
                })
                .state('reg', {
                    url: '/',
                    templateUrl: '../../app/Auth/views/reg.html',
                    controller: 'authCtrl',
                    requireLogin: false,
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
                    requireLogin: false,
                    showHeader: true,
                    resolve: {
                        countries: function () {
                            return [];
                        }
                    }
                })
                .state('invite', {
                    url: '/auth/invite',
                    templateUrl: '../../app/Auth/views/invite.html',
                    controller: 'authCtrl',
                    requireLogin: false,
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
                    requireLogin: false,
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
                .state('static', {
                    url: '/static/:pageName',
                    templateUrl: '../../app/Static/views/static.html',
                    controller: 'staticCtrl',
                    showHeader: true,
                    requireLogin: false
                })
                .state('subscribers', {
                    url: '/:username/subscribers/:id',
                    templateUrl: '../../app/User/views/popup-user-subscribers.html',
                    controller: 'userCtrl',
                    showHeader: true,
                    requireLogin: true,
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
                        publications: function () {
                            return [];
                        }
                    }
                })
                .state('subscribes', {
                    url: '/:username/subscribes/:id',
                    templateUrl: '../../app/User/views/popup-user-subscribe.html',
                    controller: 'userCtrl',
                    showHeader: true,
                    requireLogin: true,
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
                        publications: function () {
                            return [];
                        }
                    }
                })
                .state('settings', {
                    url: '/settings',
                    templateUrl: '../../app/Settings/views/settings.html',
                    controller: 'settingsCtrl',
                    showHeader: true,
                    requireLogin: true
                })


                // .state('p', {
                //     url: '/p/:pubId/:hash',
                //     templateUrl: '../../app/hidden-publication.html',
                //     controller: 'HiddenPubContoller',
                //     showHeader: true,
                //     requireLogin: false
                // })
                .state('p', {
                    url: '/p/:pubId/:hash',
                    templateUrl: '../../app/common/views/pub-hidden-mobile.html',
                    controller: function ($scope, $window, publication, ngDialog) {

                        var screenWidth = $window.innerWidth;

                        if (screenWidth < 768) {
                            this.isMobile = true;
                            this.publication = publication;
                        } else {
                            ngDialog.open({
                                template: '../../app/common/views/pub-hidden.html',
                                name: 'modal-publication-group',
                                className: 'view-publication ngdialog-theme-default',
                                data: {
                                    pub: publication
                                }
                            });
                        }

                        $scope.$emit('userPoint', 'user');
                    },
                    controllerAs: 'vm',
                    resolve: {
                        publication: function ($q, $stateParams, PublicationService, md5, $state) {

                            var defer = $q.defer();

                            var hashPubId = md5.createHash($stateParams.pubId);

                            if (hashPubId === $stateParams.hash) {
                                PublicationService.getHiddenPublication($stateParams.pubId)
                                    .then(function (response) {
                                        defer.resolve(response);
                                    }, function (error) {
                                        console.log(error);
                                        defer.reject();
                                    });
                            } else {
                                $state.go("login");
                            }

                            return defer.promise;
                        }
                    },
                    showHeader: true,
                    requireLogin: false
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
                    requireLogin: true,
                    params: {
                        fromMobile: null
                    }
                })
                .state('chat.list', {
                    url: '/list',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-list.html',
                    showHeader: true,
                    requireLogin: true
                })
                .state('chat.contacts', {
                    url: '/contacts',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-contacts.html',
                    showHeader: true,
                    requireLogin: true
                })
                .state('chat.blocked', {
                    url: '/blocked',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-blocked.html',
                    showHeader: true,
                    requireLogin: true
                })
                .state('chat.notification', {
                    url: '/settings',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-notification.html',
                    showHeader: true,
                    requireLogin: true
                })
                .state('chat.mobile', {
                    url: '/m/',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/chat-block.html',
                    showHeader: true,
                    requireLogin: true
                })
                .state('chat.contact-mobile', {
                    url: '/c/',
                    parent: 'chat',
                    templateUrl: '../../app/Chat/views/contact-block.html',
                    showHeader: true,
                    requireLogin: true
                })

                /*User must be in the end*/
                .state('user', {
                    url: '/:username',
                    templateUrl: '../../app/User/views/user.html',
                    controller: 'userCtrl',
                    requireLogin: true,
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
                    url: '/:username/pub/:id/',
                    templateUrl: '../../app/User/views/view-publication.html',
                    showHeader: true,
                    controller: 'userCtrl',
                    requireLogin: true,
                    params : {fromChat: null},
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
                        publications: function () {

                        }
                    }
                })
                .state('mobile-pub-view-test', {
                    url: '/m/publication/:id',
                    templateUrl: '../../app/common/views/pub-mobile.html',
                    showHeader: true,
                    requireLogin: true,
                    params: {
                        prevState: {
                            name: null,
                            params: null
                        }
                    },
                    controller: function ($scope, publication, $stateParams) {
                        this.title = '111';
                        this.publication = publication;
                        this.prevState = $stateParams.prevState;
                        $scope.$emit('userPoint', 'user');
                    },
                    controllerAs: 'vm',
                    resolve: {
                        publication: ['$q', '$stateParams', 'PublicationService', function ($q, $stateParams, PublicationService) {
                            var defer = $q.defer();

                            PublicationService.getSinglePublication($stateParams.id)
                                .then(function (data) {
                                    defer.resolve(data);
                                });

                            return defer.promise;
                        }]
                    }

                })
                .state('desktop-pub-view', {
                    url: '/:username/publication/:id/:hash',
                    templateUrl: '../../app/User/views/user.html',
                    controller: 'userCtrl',
                    showHeader: true,
                    requireLogin: true,
                    resolve: {
                        profile: null,
                        publications: null
                    }
                })



        }])
    .run(['$rootScope', 'storageService', function ($rootScope, storageService) {

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

                console.log('Country name - ' + $rootScope.countryName);

                $rootScope.$broadcast('location:ready');

                //$scope.countries.forEach(function (elem) {
                //    if (elem.name === countryName) {
                //        $scope.newUserCountryId = +elem.id;
                //        console.log($scope.newUserCountryId);
                //    }
                //});
            });
        }
    }]);