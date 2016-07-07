(function () {
    'use strict';

    angular
        .module('app.groups')
        .factory('groupsService', groupsService);

    groupsService.$inject = ['$http'];

    function groupsService($http) {


        return {
            addGroup: addGroup
        };

        ////////////

        function addGroup(group) {
            var fd = new FormData();

            fd.append('name', group.name);
            fd.append('description', group.description);
            fd.append('is_open', +group.isOpen);
            fd.append('avatar', group.avatar, group.avatar.name);

            return $http({
                method: 'POST',
                url: 'group/store',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(addGroupComplete)
                .catch(addGroupFailed);

            function addGroupComplete(response) {
                return response.data;
            }

            function addGroupFailed(error) {
                console.error('XHR Failed for addGroup. ' + error.data);
            }
        }


    }

})();
