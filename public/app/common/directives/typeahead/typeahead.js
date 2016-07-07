(function (angular) {
    'use strict';

    angular
        .module('app.directives')
        .directive('typeahead', typeAhead);

    typeAhead.$inject = ['$timeout'];

    /* @ngInject */
    function typeAhead($timeout) {
        return {
            restrict: 'AEC',
            scope: {
                items: '=',
                prompt: '@',
                key1: '@',
                key2: '@',
                model: '=',
                onSelect: '&'
            },
            templateUrl: './app/common/directives/typeahead/typeahead.tpl.html',
            link: function (scope, elem, attrs) {
                scope.handleSelection = function (selectedItem) {
                    scope.model = '';
                    scope.current = 0;
                    scope.selected = true;
                    $timeout(function () {
                        scope.onSelect({user: selectedItem});
                    }, 200);
                };
                scope.current = 0;
                scope.selected = true;
                scope.isCurrent = function (index) {
                    return scope.current == index;
                };
                scope.setCurrent = function (index) {
                    scope.current = index;
                };
            }
        }
    }

})(angular);

