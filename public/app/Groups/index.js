(function (angular) {
    'use strict';

    angular
        .module('app.groups', ['ngFileUpload', 'ngScrollbar'])
        .config(routes);


    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                templateUrl: '../../app/Groups/views/groups.html',
                controller: 'groupsCtrl'
            })
            .state('group', {
                url: '/group/:groupName',
                templateUrl: '../../app/Groups/views/group.html',
                controller: 'GroupCtrl',
                controllerAs: 'vm',
                params: {
                    groupId: null,
                    modalId: null,
                    isOpenModal: false
                },
                resolve: {
                    group: ['groupsService', '$stateParams', '$state', '$q', 'ngDialog', function (groupsService, $stateParams, $state, $q, ngDialog) {
                        var deferred = $q.defer();
                        var group;
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

                        return deferred.promise;
                    }]
                }
            })
            .state('group.publications', {
                url: '/publications',
                templateUrl: '../../app/Groups/views/group-publications.html'
            })
            .state('group.chat', {
                url: '/chat',
                templateUrl: '../../app/Groups/views/group-chat.html'
            })
            .state('group.people', {
                url: '/people',
                templateUrl: '../../app/Groups/views/group-people.html'
            })
            .state('group.files', {
                url: '/files',
                templateUrl: '../../app/Groups/views/group-files.html'
            })
            .state('view-group-publication', {
                url: '/group/:groupId/publication/:pubId',
                templateUrl: '../../app/Groups/views/group.html',
                controller: 'groupsCtrl'
            })
            .state('mobile-view-group-publication', {
                url: '/group/:groupId/pub/:pubId',
                templateUrl: '../app/Groups/views/popup-view-group-publication.html',
                controller: 'groupsCtrl'
            })
            .state("Modal.confirmAddToCart", {
                templateUrl: "modals/confirm.html"
            });
    }

})(angular);
