angular.module('placePeopleApp')
    .controller('mainCtrl', ['$rootScope', '$scope', '$state', 'groupsService', 'placesService', 'storageService', 'AuthService', '$location', 'socket', function ($rootScope, $scope, $state, groupsService, placesService, storageService, AuthService, $location, socket) {
        var storage = storageService.getStorage();
        $scope.currentPath = $location.url();
        $scope.loggedUserId = parseInt(storage.userId);
        $scope.logOut = function () {
            AuthService.userLogOut().then(function (response) {
                    storageService.deleteStorage();
                    $state.go('login');
                },
                function (error) {
                    console.log(error);
                });
        };
        socket.emit("get user rooms", $scope.loggedUserId);
        socket.on("get user rooms", function (response) {
            var chatRoomsArray = [];
            for (var i = 0; i < response.length; i++) {
                if (response[i].countMessages > 0) {
                    chatRoomsArray.push(response[i].countMessages);
                }
            }
            $rootScope.countChatMessages = chatRoomsArray.length;
        });
        socket.on('updatechat', function (data) {
            socket.emit("get user rooms", $scope.loggedUserId);
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            var storage = storageService.getStorage();
            $scope.loggedUser = storage.username;
            $scope.currentPath = $location.url();
            console.log($scope.currentPath);
        });
        $scope.$on('publicPoint', function (event, data) {
            $scope.bodyClass = 'public';
        });

        $scope.$on('authPoint', function (event, data) {
            $scope.bodyClass = 'main-page';
        });

        $scope.$on('userPoint', function (event, data) {
            $scope.bodyClass = 'public user';
        });

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {
                groupsService.getCounterNewGroups().then(function (data) {
                    $rootScope.counters.groupsNew = data;
                });
                placesService.getCounterNewPlaces().then(function (data) {
                    $rootScope.counters.placesNew = data;
                });

                if (toState.name !== 'search' &&
                    toState.name !== 'search.people' &&
                    toState.name !== 'search.publications' &&
                    toState.name !== 'search.places' &&
                    toState.name !== 'search.groups') {

                    resetSearch();

                }

            });


        // Search
        $scope.search = {
            str: '',
            byUsers: true,
            byPublications: true,
            byPlaces: true,
            byGroups: true
        };

        var originalSearch = angular.copy($scope.search);

        $scope.submitSearch = function () {
            if ($state.current.name === 'search' ||
                $state.current.name === 'search.people' ||
                $state.current.name === 'search.publications' ||
                $state.current.name === 'search.places' ||
                $state.current.name === 'search.groups') {

                $scope.$broadcast('search', {searchObj: angular.copy($scope.search)});

            } else {
                $state.go('search', {'searchObj': angular.copy($scope.search)});
            }
        };

        function resetSearch() {
            $scope.search = angular.copy(originalSearch);
            $scope.showSearch = false;
        }


    }]);
