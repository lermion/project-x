(function (angular) {

	'use strict';

	angular
		.module('app.directives', [])
		.directive('validFile', validFile)
		.directive('whenScrolled', whenScrolled, ["$timeout"])
		.directive('scrollBottomOn', scrollBottomOn, ["$timeout"])
		.directive('focusMe', focusMe, ['$timeout', '$parse'])
		.directive('clickOutside', ['$document', '$parse', '$timeout', clickOutside])
		.directive('schrollBottom', schrollBottom)
		.directive('repeatDone', repeatDone)
		.directive('imageonload', imageonload)
		.directive('eatClickIf', eatClickIf, ['$parse', '$rootScope'])
		.directive("scroll", function ($window) {
			return function (scope, element, attrs) {
				angular.element($window).bind("scroll", function () {
					var windowHeight = "innerHeight" in window ? window.innerHeight
						: document.documentElement.offsetHeight;
					var body = document.body, html = document.documentElement;
					var docHeight = Math.max(body.scrollHeight,
						body.offsetHeight, html.clientHeight,
						html.scrollHeight, html.offsetHeight);
					var windowBottom = windowHeight + window.pageYOffset;
					if (windowBottom >= docHeight) {
						//alert('bottom reached');
						scope.boolChangeClass = true;
						//console.log(scope.boolChangeClass);
					} else {
						scope.boolChangeClass = false;
					}
					scope.$apply();
				});
			};
		});

	function schrollBottom() {
		return {
			scope: {
				schrollBottom: "="
			},
			link: function (scope, element) {
				scope.$watchCollection('schrollBottom', function (newValue) {
					if (newValue) {
						$(element).scrollTop($(element)[0].scrollHeight);
					}
				});
			}
		}
	}

	function repeatDone(){
		return function(scope, element, attrs){
			if(scope.$last){
				scope.$eval(attrs.repeatDone);
			}
		}
	}

	function imageonload(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind('load', function() {
					//call the function that was passed
					scope.$apply(attrs.imageonload);
				});
			}
		};
	}

	function clickOutside($document, $parse, $timeout) {
		return {
			restrict: 'A',
			link: function ($scope, elem, attr) {

				// postpone linking to next digest to allow for unique id generation
				$timeout(function () {
					var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.split(/[ ,]+/) : [],
						fn;

					// add the elements id so it is not counted in the click listening
					if (attr.id !== undefined) {
						classList.push(attr.id);
					}

					function eventHandler(e) {
						var i,
							element,
							r,
							id,
							classNames,
							l;

						// check if our element already hidden and abort if so
						if (angular.element(elem).hasClass("ng-hide")) {
							return;
						}

						// if there is no click target, no point going on
						if (!e || !e.target) {
							return;
						}

						// loop through the available elements, looking for classes in the class list that might match and so will eat
						for (element = e.target; element; element = element.parentNode) {
							id = element.id,
								classNames = element.className,
								l = classList.length;

							// Unwrap SVGAnimatedString classes
							if (classNames && classNames.baseVal !== undefined) {
								classNames = classNames.baseVal;
							}

							// if there are no class names on the element clicked, skip the check
							if (classNames || id) {

								// console.log('classNames: ' + classNames);

								// loop through the elements id's and classnames looking for exceptions
								for (i = 0; i < l; i++) {
									//prepare regex for class word matching
									r = new RegExp('\\b' + classList[i] + '\\b');

									//  console.log('classList: ' + classList[i]);

									// check for exact matches on id's or classes, but only if they exist in the first place
									if ((id !== undefined && id === classList[i]) || (classNames && r.test(classNames))) {
										// now let's exit out as it is an element that has been defined as being ignored for clicking outside
										return;
									}
								}
							}
						}

						// if we have got this far, then we are good to go with processing the command passed in via the click-outside attribute
						$timeout(function () {
							fn = $parse(attr['clickOutside']);
							fn($scope);
						});
					}

					// if the devices has a touchscreen, listen for this event
					if (_hasTouch()) {
						$document.on('touchstart', eventHandler);
					}

					// still listen for the click event even if there is touch to cater for touchscreen laptops
					$document.on('click', eventHandler);

					// when the scope is destroyed, clean up the documents event handlers as we don't want it hanging around
					$scope.$on('$destroy', function () {
						if (_hasTouch()) {
							$document.off('touchstart', eventHandler);
						}

						$document.off('click', eventHandler);
					});

					// private function to attempt to figure out if we are on a touch device
					function _hasTouch() {
						// works on most browsers, IE10/11 and Surface
						return 'ontouchstart' in window || navigator.maxTouchPoints;
					};
				});
			}
		};
	}

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
		return function (scope, elm, attr) {
			var raw = elm[0];

			elm.bind('scroll', function () {
				if (raw.scrollTop <= 100) {
					var sh = raw.scrollHeight
					scope.$apply(attr.whenScrolled).then(function () {
						$timeout(function () {
							raw.scrollTop = raw.scrollHeight - sh;
						})
					});
				}
			});
		}
	}

	function scrollBottomOn() {
		return function (scope, elm, attr) {
			scope.$watch(attr.scrollBottomOn, function (value) {
				if (value) {
					$timeout(function () {
						elm[0].scrollTop = elm[0].scrollHeight;
					});
				}
			});
		}
	}

	function focusMe($timeout, $parse) {
		return {
			link: function (scope, element, attrs) {
				var model = $parse(attrs.focusMe);
				scope.$watch(model, function (value) {
					if (value === true) {
						$timeout(function () {
							element[0].focus();
						});
					}
				});
				//element.bind('blur', function() {
				//    scope.$apply(model.assign(scope, false));
				//});
			}
		};
	}

	function eatClickIf($parse, $rootScope) {
		return {
			// this ensure eatClickIf be compiled before ngClick
			priority: 100,
			restrict: 'A',
			compile: function ($element, attr) {
				var fn = $parse(attr.eatClickIf);
				return {
					pre: function link(scope, element) {
						var eventName = 'click';
						element.on(eventName, function (event) {
							var callback = function () {
								if (fn(scope, {$event: event})) {
									// prevents ng-click to be executed
									event.stopImmediatePropagation();
									// prevents href
									event.preventDefault();
									return false;
								}
							};
							if ($rootScope.$$phase) {
								scope.$evalAsync(callback);
							} else {
								scope.$apply(callback);
							}
						});
					},
					post: function () {
					}
				}
			}
		}
	}

})(angular);