(function (angular) {

    'use strict';

    angular
        .module('app.directives', [])
        .directive('validFile', validFile);

    function validFile() {
        return {
            require: 'ngModel',
            link: function (scope, el, attrs, ngModel) {
                el.bind('change', function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(el.val());
                        ngModel.$render();
                    });
                });
            }
        }
    }

})(angular);
