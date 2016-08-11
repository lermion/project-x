(function (angular) {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'storageService', '$http',
        '$window', 'results', 'searchService', 'ngDialog', 'PublicationService', 'amMoment'];

    function SearchCtrl($rootScope, $scope, $state, $stateParams, storageService, $http,
                        $window, results, searchService, ngDialog, PublicationService, amMoment) {

        var vm = this;

        var storage = storageService.getStorage();
        vm.userName = storage.username;


        vm.results = results;

        vm.searchObj = {
            str: $stateParams.searchObj.str || '',
            byUsers: true,
            byPublications: true,
            byPlaces: true,
            byGroups: true
        };

        amMoment.changeLocale('ru');

        activate();

        //////////////////////////////////////////


        vm.openModalPublication = function (pubId) {
            openModalPublication(pubId);
        };

        vm.getAuthorName = function (pub) {
            if (pub.gr_name) {
                return pub.gr_name;
            } else if (pub.pl_name) {
                return pub.pl_name;
            } else if (!!+pub.is_anonym) {
                return 'Анонимная публикация'
            } else {
                return pub.first_name + ' ' + pub.last_name;
            }
        };

        vm.getStateName = function (pub) {
            if (pub.gr_name) {
                return 'group({groupName: ' + '\'' + pub.gr_url_name + '\'' + '})';
            } else if (pub.pl_name) {
                return 'place({placeName: ' + '\'' + pub.pl_url_name + '\'' + '})';
            } else {
                return 'user({username: ' + '\'' + pub.usr_login + '\'' + '})';
            }
        };

        function openModalPublication(pubId) {
            $rootScope.showSearch = false;
            getPublication(pubId).then(function (pub) {
                ngDialog.open({
                    templateUrl: '../app/common/components/publication/publication-modal.html',
                    name: 'modal-publication-group',
                    className: 'view-publication ngdialog-theme-default',
                    data: {
                        pub: pub
                    },
                    preCloseCallback: function () {
                        $rootScope.showSearch = true;
                    }
                });
            });

        }

        function activate() {
            init();
            restoreSearchResult();
            setActiveState();
        }

        function init() {
            $scope.$emit('userPoint', 'user');
            var storage = storageService.getStorage();
            vm.loggedUser = storage.username;

            $http.get('/static_page/get/name')
                .success(function (response) {
                    vm.staticPages = response;
                })
                .error(function (error) {
                    console.log(error);
                });
            vm.logOut = function () {
                AuthService.userLogOut()
                    .then(function (res) {
                        storageService.deleteStorage();
                        $state.go('login');
                    }, function (err) {
                        console.log(err);
                    });
            };

            vm.openMenu = function () {
                if ($window.innerWidth <= 800) {
                    vm.showMenu = !vm.showMenu;
                } else {
                    vm.showMenu = true;
                }
            };

            vm.openBottomMenu = function () {
                if ($window.innerWidth <= 650) {
                    vm.showBottomMenu = !vm.showBottomMenu;
                } else {
                    vm.showBottomMenu = false;
                }
            };

            var w = angular.element($window);
            $scope.$watch(
                function () {
                    return $window.innerWidth;
                },
                function (value) {
                    if (value <= 800) {
                        vm.showMenu = false;
                    } else {
                        vm.showMenu = true;
                    }

                    if (value <= 650) {
                        vm.showBottomMenu = false;
                    } else {
                        vm.showBottomMenu = true;
                    }

                    if (value < 520) {
                        var blockThirdthLength = (parseInt(w[0].innerWidth) - 21) / 4;
                        vm.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
                        vm.resizeHeight = 'height:' + blockThirdthLength + 'px;';
                    } else {
                        vm.resizeSizes = '';
                        vm.resizeHeight = '';
                    }
                },
                true
            );
            w.bind('resize', function () {
                $scope.$apply();
            });

        }

        function search(searchObj) {
            searchService.search(searchObj)
                .then(function (data) {
                    vm.results = data;
                    setActiveState();
                });
        }

        $scope.$on('search', function (event, data) {
            search(data.searchObj);
        })


        function getPublication(id) {
            return PublicationService.getSinglePublication(id)
                .then(function (data) {
                    return data;
                });
        }

        function setActiveState() {
            // TODO: refact!

            vm.isResults = true;

            if (vm.results && $stateParams.setActiveTab) {
                if (vm.results[0].length > 0) {
                    $state.go('search.people');
                } else if (vm.results[1].length > 0) {
                    $state.go('search.publications');
                } else if (vm.results[3].length > 0) {
                    $state.go('search.places');
                } else if (vm.results[2].length > 0) {
                    $state.go('search.groups');
                } else {
                    vm.isResults = false;
                }
            }

        }

        function restoreSearchResult() {
            if (!vm.results) {
                vm.results = searchService.search({}, true);
            }
        }


    }

})(angular);
