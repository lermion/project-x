(function(){
	'use strict';
	angular.module('placePeopleApp').factory('socket', socket);

	socket.$inject = ['$location', 'socketFactory'];

	function socket($location, socketFactory){
			var path = $location.protocol() + '://' + $location.host();
			var baseUrl = path + ':3000';
			var myIoSocket = io.connect(baseUrl);

			socket = socketFactory({
				ioSocket: myIoSocket
			});
		return socket;
	}
})();