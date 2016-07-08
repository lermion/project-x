(function () {
    'use strict';

    angular
        .module('app.groups')
        .factory('groupsService', groupsService);

    groupsService.$inject = ['$http'];

    function groupsService($http) {


        return {
            getGroupList: getGroupList,
            getGroup: getGroup,
            addGroup: addGroup,
            deleteGroup: deleteGroup,
            inviteUsers: inviteUsers
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

        function getGroup(groupName) {

            return $http({
                method: 'GET',
                url: 'group/show/' + groupName,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(getGroupComplete)
                .catch(getGroupFailed);

            function getGroupComplete(response) {
                return response.data;
            }

            function getGroupFailed(error) {
                console.error('XHR Failed for getGroup. ' + error.data);
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

        function deleteGroup(groupId) {

            return $http({
                method: 'GET',
                url: 'group/destroy/' + groupId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(deleteGroupComplete)
                .catch(deleteGroupFailed);

            function deleteGroupComplete(response) {
                return response.data;
            }

            function deleteGroupFailed(error) {
                console.error('XHR Failed for deleteGroup. ' + error.data);
            }
        }

        function inviteUsers(groupId, users) {
            var fd = new FormData();

            angular.forEach(users, function(user) {
                fd.append('user_id[]', user.userId);
            });


            return $http({
                method: 'POST',
                url: 'group/invite/' + groupId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(inviteUserComplete)
                .catch(inviteUserFailed);

            function inviteUserComplete(response) {
                return response.data;
            }

            function inviteUserFailed(error) {
                console.error('XHR Failed for inviteUser. ' + error.data);
            }
        }


    }

})();
