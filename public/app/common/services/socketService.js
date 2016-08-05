(function () {
	'use strict';

	angular
		.module('placePeopleApp')
		.factory('socket', socket);

	socket.$inject = ['$rootScope', '$location'];

	/* @ngInject */
	function socket($rootScope, $location) {

		var path = $location.protocol() + '://' + $location.host();

		var baseUrl = path + ':3000';        

		var socket = io.connect(baseUrl);

		var service = {
			on: on,
			emit: emit,
			disconnect: disconnect,
			removeAllListeners: removeAllListeners
		};
		return service;

		////////////////
		function disconnect(){
			socket.disconnect();
		}
		function on(eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		}


		function emit(eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}

		function removeAllListeners(){
			socket.removeAllListeners();
		}
	}
})();