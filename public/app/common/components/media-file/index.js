(function (angular) {

    'use strict';

    angular
        .module('app.components')
        .component('modalMediaFile', {
            bindings: {
                fileData: '<'
            },
            templateUrl: '../app/common/components/media-file/media-file.html',
            controller: function () {
                var ctrl = this;

                // Lifecycle hooks
                ctrl.$onInit = function (args) {
                    ctrl.file = ctrl.fileData;
                };

                ctrl.$onChanges = function (args) {
                    console.log('OnChanges');
                };

                ctrl.$onDestroy = function (args) {
                    console.log('OnDestroy');
                };

                ctrl.$postLink = function (args) {
                    console.log('OnLink');
                };

            }
        });
})(angular);