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
            updateGroup: updateGroup,
            deleteGroup: deleteGroup,
            inviteUsers: inviteUsers,
            removeUsers: removeUsers,
            subscribeGroup: subscribeGroup,
            setAdmin: setAdmin,
            setCreator: setCreator
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

        function updateGroup(group) {
            var fd = new FormData();

            //if (group.name) {
            //    fd.append('name', group.name);
            //}
            fd.append('description', group.description);
            fd.append('is_open', +group.is_open);
            //fd.append('avatar', group.avatar, group.avatar.name);

            return $http({
                method: 'POST',
                url: 'group/update/' + group.id,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(updateGroupComplete)
                .catch(updateGroupFailed);

            function updateGroupComplete(response) {
                return response.data;
            }

            function updateGroupFailed(error) {
                console.error('XHR Failed for updateGroup. ' + error.data);
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

            angular.forEach(users, function (user) {
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

        function removeUsers(groupId, users) {
            var fd = new FormData();

            angular.forEach(users, function (id) {
                fd.append('user_id[]', id);
            });


            return $http({
                method: 'POST',
                url: 'group/delete_subscription/' + groupId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
            })
                .then(removeUsersComplete)
                .catch(removeUsersFailed);

            function removeUsersComplete(response) {
                return response.data;
            }

            function removeUsersFailed(error) {
                console.error('XHR Failed for removeUsers. ' + error.data);
            }
        }

        function subscribeGroup(groupId) {

            return $http({
                method: 'GET',
                url: 'group/subscription/' + groupId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(subscribeGroupComplete)
                .catch(subscribeGroupFailed);

            function subscribeGroupComplete(response) {
                return response.data;
            }

            function subscribeGroupFailed(error) {
                console.error('XHR Failed for subscribeGroup. ' + error.data);
            }
        }

        function setAdmin(groupId, userId) {

            return $http({
                method: 'GET',
                url: 'group/set_user_admin/' + groupId + '/' + userId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(setAdminComplete)
                .catch(setAdminFailed);

            function setAdminComplete(response) {
                return response.data;
            }

            function setAdminFailed(error) {
                console.error('XHR Failed for setAdmin. ' + error.data);
            }
        }

        function setCreator(groupId, adminId) {

            return $http({
                method: 'GET',
                url: 'group/set_admin_creator/' + groupId + '/' + adminId,
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: null
            })
                .then(setCreatorComplete)
                .catch(setCreatorFailed);

            function setCreatorComplete(response) {
                return response.data;
            }

            function setCreatorFailed(error) {
                console.error('XHR Failed for setCreator. ' + error.data);
            }
        }


    }

})();
