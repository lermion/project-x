(function(){
	'use strict';
	angular.module('placePeopleApp').factory('socket', socket);

	socket.$inject = ['$location', 'socketFactory'];

	function socket($location, socketFactory){
			var path = "http://77.244.218.122";
			var baseUrl = path + ':3000';
			var myIoSocket = io.connect(baseUrl);

			socket = socketFactory({
				ioSocket: myIoSocket
			});
		return socket;
	}
})();