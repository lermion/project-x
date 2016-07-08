(function (angular) {
    'use strict';

    angular
        .module('app.groups', [])
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
                controllerAs: 'vm'
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
            });
    }

})(angular);
