(function () {
    'use strict';

    angular
        .module('app.groups')
        .factory('groupsService', groupsService);

    groupsService.$inject = ['$http'];

    function groupsService($http) {


        return {
            getGroupList: getGroupList,
            addGroup: addGroup
        };

        ////////////

        function getGroupList() {

            return $http({
                method: 'GET',
                url: 'group/',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getGroupListComplete)
                .catch(getGroupListFailed);

            function getGroupListComplete(response) {
                return response.data;
            }

            function getGroupListFailed(error) {
                console.error('XHR Failed for getGroupList. ' + error.data);
            }
        }

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
