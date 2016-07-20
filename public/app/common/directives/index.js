(function (angular) {

	'use strict';

	angular
		.module('app.directives', [])
		.directive('validFile', validFile)
		.directive('whenScrolled', whenScrolled, ["$timeout"])
		.directive('scrollBottomOn', scrollBottomOn, ["$timeout"]);

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

	function whenScrolled() {
		return function(scope, elm, attr) {
			var raw = elm[0];

			elm.bind('scroll', function() {
				if (raw.scrollTop <= 100) {
					var sh = raw.scrollHeight
					scope.$apply(attr.whenScrolled).then(function() {
						$timeout(function() {
							raw.scrollTop = raw.scrollHeight - sh;
						})
					});
				}
			});
		}
	}

	function scrollBottomOn() {
		return function(scope, elm, attr) {
			scope.$watch(attr.scrollBottomOn, function(value) {
				if (value) {
					$timeout(function() {
						elm[0].scrollTop = elm[0].scrollHeight;
					});
				}
			});
		}
	}

})(angular);