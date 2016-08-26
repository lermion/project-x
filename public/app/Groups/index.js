(function (angular) {
    'use strict';

    angular
        .module('app.groups', ['ngFileUpload', 'ngScrollbar', 'ngAnimate'])
        .config(routes);
    angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 1000);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl: '../../app/Groups/views/groups.html',
                controller: 'groupsCtrl',
                showHeader: true,
                requireLogin: true
            })
            .state('group', {
                url: '/group/:groupName',
                templateUrl: '../../app/Groups/views/group.html',
                controller: 'GroupCtrl',
                controllerAs: 'vm',
                requireLogin: false,
                showHeader: true,
                params: {
                    groupId: null,
                    modalId: null,
                    isOpenModal: false,
                    prevState: null
                },
                resolve: {
                    auth: function($rootScope, storageService) {
                        return storageService.isUserAuthorized().then(function (resp) {
                            $rootScope.isAuthorized = resp.is_authorization;
                        });
                    },
                    group: ['$rootScope', 'groupsService', '$stateParams', '$state', '$q', 'ngDialog', 'auth', function ($rootScope, groupsService, $stateParams, $state, $q, ngDialog, auth) {
                        var deferred = $q.defer();
                        var group;

                        if ($rootScope.isAuthorized) {
                            groupsService.getGroup($stateParams.groupName)
                                .then(function (data) {

                                    if (data.id) {
                                        groupsService.getPublications(data.id)
                                            .then(function (publications) {
                                                if (publications) {
                                                    data.publications = publications;
                                                }
                                                deferred.resolve(data);
                                            });
                                    } else if (!data.status && data.error.code === '8') {
                                        deferred.reject();
                                        $rootScope.$broadcast('preloader:off');
                                        ngDialog.open({
                                            template: '../app/Groups/views/popup-closed-group.html',
                                            name: 'modal-notfound-group',
                                            className: 'popup-delete-group ngdialog-theme-default',
                                            preCloseCallback: function () {
                                                $state.go('groups');
                                            }
                                        });
                                    } else if (!data.status && data.error.code === '6') {
                                        deferred.reject();
                                        $rootScope.$broadcast('preloader:off');
                                        ngDialog.open({
                                            template: '../app/Groups/views/popup-notfound-group.html',
                                            name: 'modal-notfound-group',
                                            className: 'popup-delete-group ngdialog-theme-default',
                                            preCloseCallback: function () {
                                                $state.go('groups');
                                            }
                                        });
                                    }

                                });
                        } else {
                            groupsService.getGroupForUnauthorizedUser($stateParams.groupName)
                                .then(function (data) {
                                    if (data.id) {

                                        deferred.resolve(data);
                                    } else if (!data.status && data.error.code === '8') {
                                        deferred.reject();
                                        $rootScope.$broadcast('preloader:off');
                                        ngDialog.open({
                                            template: '../app/Groups/views/popup-closed-group.html',
                                            name: 'modal-notfound-group',
                                            className: 'popup-delete-group ngdialog-theme-default',
                                            preCloseCallback: function () {
                                                $state.go('groups');
                                            }
                                        });
                                    } else if (!data.status && data.error.code === '6') {
                                        deferred.reject();
                                        $rootScope.$broadcast('preloader:off');
                                        ngDialog.open({
                                            template: '../app/Groups/views/popup-notfound-group.html',
                                            name: 'modal-notfound-group',
                                            className: 'popup-delete-group ngdialog-theme-default',
                                            preCloseCallback: function () {
                                                $state.go('groups');
                                            }
                                        });
                                    }
                                });
                        }


                        return deferred.promise;
                    }]
                }
            })
            .state('group.publications', {
                url: '/publications',
                templateUrl: '../../app/Groups/views/group-publications.html',
                requireLogin: true,
                showHeader: true
            })
            .state('group.chat', {
                url: '/chat',
                templateUrl: '../../app/Groups/views/group-chat.html',
                requireLogin: true,
                showHeader: true
            })
            .state('group.people', {
                url: '/people',
                templateUrl: '../../app/Groups/views/group-people.html',
                requireLogin: true,
                showHeader: true
            })
            .state('group.files', {
                url: '/files',
                templateUrl: '../../app/Groups/views/group-files.html',
                requireLogin: true,
                params: {
                    chatRoomId: null,
                    chatFiles: []
                },
                showHeader: true,
                resolve: {
                    chatFiles1: ['ChatService', '$q', '$stateParams', 'group', function (ChatService, $q, $stateParams, group) {
                        var deferred = $q.defer();

                        ChatService.getChatFiles(group.room_id)
                            .then(function (resp) {
                                if (resp.status) {
                                    $stateParams.chatFiles = resp.data;
                                }

                                deferred.resolve(resp);
                            });

                        return deferred.promise;
                    }]
                }
            })
            .state('group.mob-pub', {
                url: '/m/:pubId',
                templateUrl: '../app/Groups/views/popup-view-group-publication.html',
                requireLogin: true,
                showHeader: true
            })
            .state('view-group-publication', {
                url: '/group/:groupId/publication/:pubId',
                templateUrl: '../../app/Groups/views/group.html',
                requireLogin: true,
                controller: 'groupsCtrl',
                showHeader: true
            })
            .state('mobile-view-group-publication', {
                url: '/group/:groupId/pub/:pubId',
                templateUrl: '../app/Groups/views/popup-view-group-publication.html',
                requireLogin: true,
                controller: 'groupsCtrl',
                showHeader: true
            })
            .state("Modal.confirmAddToCart", {
                templateUrl: "modals/confirm.html",
                requireLogin: true,
                showHeader: true
            });
    }

})(angular);
