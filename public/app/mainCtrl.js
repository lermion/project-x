angular.module('placePeopleApp')
    .controller('mainCtrl', ['$rootScope', '$scope', 'groupsService', function ($rootScope, $scope, groupsService) {

        $scope.$on('publicPoint', function (event, data) {
            $scope.bodyClass = 'public';
        });

        $scope.$on('authPoint', function (event, data) {
            $scope.bodyClass = 'main-page';
        });

        $scope.$on('userPoint', function (event, data) {
            $scope.bodyClass = 'public user';
        });

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                groupsService.getCounterNewGroups().then(function (data) {
                    $rootScope.counters.groupsNew = data;
                });
            })
    }]);
