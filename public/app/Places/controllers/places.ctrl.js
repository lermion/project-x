(function (angular) {
    'use strict';

    angular
        .module('app.places')
        .controller('PlacesCtrl', PlacesCtrl);

    PlacesCtrl.$inject = ['$scope', '$http', '$window', '$state', '$stateParams', '$filter', '$timeout', '$location',
        '$anchorScroll', 'AuthService', 'storageService',
        'placesService', 'countries', 'places', 'typeStatic', 'typeDynamic', 'ngDialog', 'PublicationService',
        'UserService', 'Upload'];

    function PlacesCtrl($scope, $http, $window, $state, $stateParams, $filter, $timeout, $location,
                        $anchorScroll, AuthService, storageService,
                        placesService, countries, places, typeStatic, typeDynamic, ngDialog, PublicationService,
                        UserService, Upload) {

        var LIMIT_PLACE = 3;

        var vm = this;

        var storage = storageService.getStorage();

        var myId = storage.userId;

        var modalMap, modalCropLogoImage, map;

        vm.typeStatic = typeStatic;
        vm.typeDynamic = typeDynamic;

        var staticIds = typeStatic.map(function (type) {
            return type.id
        });
        var dynamicIds = typeDynamic.map(function (type) {
            return type.id
        });

        vm.activeTypePlaceId = null;

        vm.places = places;

        vm.countries = countries;

        vm.userName = storage.username;

        vm.placesDropdown = null;

        vm.placeNew = {
            category: {},

            country: 'default',
            city: {},
            address: null,

            name: '',
            description: null,

            cover: null,
            logo: null,

            isCreate: null,
            isDynamic: false,

            coordinates_x: null,
            coordinates_y: null,

            expired_days: null,

            // invited users
            users: []
        };

        vm.location = {
            latitude: null,
            longitude: null
        };

        vm.isPlaceAdded = false;

        vm.inviteNotSend = true;

        vm.selectedImage = null;
        vm.myCroppedImage = null;
        vm.blobImg = null;

        vm.limitPlace = LIMIT_PLACE;

        // TODO: refact!
        vm.categories = [
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true},
            {show: true}
        ];
        vm.showAllPlaces = false;

        activate();

        /////////////////////////////////////////////////

        function activate() {
            init();
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


        $scope.$watch(angular.bind(vm, function () {
            return vm.placesDropdown;
        }), function (newVal) {
            if (newVal === 'places.add') {
                $state.go('places.add');
            } else if (newVal) {
                vm.togglePlaceView(+newVal);
            }
        });
        $scope.$watch(angular.bind(vm, function () {
            return vm.placeNew.country;
        }), function (newVal, oldVal) {
            if (newVal !== oldVal) {
                getCities(newVal);
            }
        });
        $scope.$watch(function () {
            return $state.params;
        }, function (p) {
            if (p.activeTypePlaceId) {
                vm.activePlace = vm.typeStatic.filter(function (item) {
                    return p.activeTypePlaceId === item.id;
                })[0];
                vm.placeNew.category.id = p.activeTypePlaceId;
            }
        });

        vm.openModalMap = function () {
            modalMap = ngDialog.open({
                template: '../app/Places/views/popup-map.html',
                name: 'modal-edit-group',
                className: 'popup-add-group place-map ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.submitPlaceNew = function () {
            vm.form.placeNew.$setSubmitted();

            if (vm.form.placeNew.$invalid) {
                return false;
            }
            if (vm.placeNew.expired_date) {
                vm.placeNew.expired_date = moment(vm.placeNew.expired_date).format('YYYY-MM-DD');
            }
            placesService.addPlace(vm.placeNew)
                .then(function (data) {
                    if (data.status) {
                        getSubscribers();
                        getSubscription();
                        vm.placeName = data.place.url_name;
                        vm.isPlaceAdded = true;
                        vm.placeId = data.place.id;
                    }
                });
        };

        vm.onItemSelected = function (user) {

            var isExist = $filter('getById')(vm.placeNew.users, user.id);

            if (!isExist) {
                var item = {
                    userId: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    avatar: user.avatar_path,

                    isAdmin: false
                };
                vm.placeNew.users.push(item);
            }
        };

        vm.removeUser = function (user) {
            for (var i = vm.placeNew.users.length - 1; i >= 0; i--) {
                if (vm.placeNew.users[i].userId == user.userId) {
                    vm.placeNew.users.splice(i, 1);
                }
            }
        };

        vm.setAdmin = function (user) {
            user.isAdmin = !user.isAdmin;
        };

        vm.submitInviteUsers = function () {
            if (vm.placeNew.users.length === 0) {
                return false;
            }

            placesService.inviteUsers(vm.placeId, vm.placeNew.users)
                .then(function (data) {
                    if (data.status) {
                        vm.inviteNotSend = false;
                        var users = vm.placeNew.users.filter(function (item, i, arr) {
                            return item.isAdmin === true;
                        });
                        if (users.length > 0) {
                            setAdmins(users, vm.placeId);
                        }
                        $timeout(function () {
                            $state.go('places');
                            vm.isPlaceAdded = false;
                        }, 2000);
                    }
                });
        };

        vm.removeUserFromInviteList = function (user) {
            for (var i = vm.placeNew.users.length - 1; i >= 0; i--) {
                if (vm.placeNew.users[i].userId == user.userId) {
                    vm.placeNew.users.splice(i, 1);
                }
            }
        };

        vm.filterByDynamicType = function (item) {
            return dynamicIds.indexOf(item.type_place_id) !== -1;
        };


        // Forms
        // Dynamic Place
        vm.changePlaceCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
            Upload.resize(file, 1200, 280, 1, null, null, true).then(function (resizedFile) {
                console.log(resizedFile);
                vm.placeNew.cover = resizedFile;
            });
        };
        vm.changePlaceLogoFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
            openModalCropLogoImage(event);
        };

        vm.saveCropp = function (croppedDataURL) {

            var blob = Upload.dataUrltoBlob(croppedDataURL, vm.selectedLogoImage.name);

            Upload.resize(blob, 100, 100, 1, null, null, true).then(function (resizedFile) {
                vm.placeNew.logo = resizedFile;
            });

            modalCropLogoImage.close();
        };

        vm.togglePlaceView = function (index) {

            //TODO: refact!
            if (index === undefined) {
                vm.limitPlace = LIMIT_PLACE;
                for (var i = 0; i < vm.categories.length; i++) {
                    vm.categories[i].show = true;
                }
                vm.showAllPlaces = false;
                vm.placesDropdown = null;
            } else {
                vm.showAllPlaces = true;
                for (var j = 0; j < vm.categories.length; j++) {
                    vm.categories[j].show = false;
                }
                vm.categories[index].show = true;
                vm.limitPlace = 'Infinity';
                $location.hash('wrapper');
                $anchorScroll();
            }

        };

        function getCities(country) {
            placesService.getCities(country.id).then(
                function (data) {
                    vm.cities = data;
                }
            );
        }

        function getSubscribers() {
            return UserService.getSubscribers(myId)
                .then(function (subscribers) {
                    vm.subscribers = subscribers;
                });
        }

        function getSubscription() {
            return PublicationService.getSubscription(myId)
                .then(function (data) {
                    vm.subscription = data;
                });
        }

        function setAdmin(placeId, userId) {
            return placesService.setAdmin(placeId, userId);
        }

        function setAdmins(users, placeId) {

            //var defer = $q.defer();
            //
            //
            //var prom = [];

            angular.forEach(users, function (user) {
                setAdmin(placeId, user.userId);
            });

            //$q.all(prom).then(function () {
            //    modalNewGroup.close();
            //});
        }

        function openModalCropLogoImage(e) {
            var file = e.currentTarget.files[0];
            if (file) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $scope.$apply(function ($scope) {
                        vm.selectedLogoImage = e.target.result;
                        modalCropLogoImage = ngDialog.open({
                            template: '../app/Places/views/popup-crop-image.html',
                            className: 'settings-add-ava ngdialog-theme-default',
                            scope: $scope
                        });
                    });
                };

                reader.readAsDataURL(file);
            }
        }

        function blobToFile(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {type: 'image/jpeg'});
        }


        vm.beforeInit = function () {
            var geolocation = ymaps.geolocation;
            geolocation.get({
                provider: 'yandex',
                mapStateAutoApply: true
            }).then(function (result) {
                vm.geoObject.geometry.coordinates = result.geoObjects.position;
                vm.center = result.geoObjects.position;
                $scope.$digest();
            });
            geolocation.get({
                provider: 'browser',
                mapStateAutoApply: true
            }).then(function (result) {
                vm.geoObject.geometry.coordinates = result.geoObjects.position;
                vm.center = result.geoObjects.position;
                $scope.$digest();
            });
        };
        vm.geoObject = {
            geometry: {
                type: 'Point',
                coordinates: []
            },
            properties: {}
        };
        vm.afterInit = function ($map) {
            map = $map;
        };
        vm.mapClick = function (e) {
            var coords = e.get('coords');
            console.log(coords);
            vm.geoObject.geometry.coordinates = coords;

            // Отправим запрос на геокодирование.
            ymaps.geocode(coords).then(function (res) {
                var names = [];
                // Переберём все найденные результаты и
                // запишем имена найденный объектов в массив names.
                res.geoObjects.each(function (obj) {
                    names.push(obj.properties.get('text'));
                });
                console.log(names[0]);
                vm.placeNew.address = names[0];

                // Добавим на карту метку в точку, по координатам
                // которой запрашивали обратное геокодирование.
                var geoObj = {
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    properties: {
                        // В качестве контента иконки выведем
                        // первый найденный объект.
                        iconContent: names[0],
                        // А в качестве контента балуна - подробности:
                        // имена всех остальных найденных объектов.
                        balloonContent: names.reverse().join(', ')
                    }
                };

                vm.placeNew.coordinates_x = geoObj.geometry.coordinates[0];
                vm.placeNew.coordinates_y = geoObj.geometry.coordinates[1];
                $scope.$apply(function () {
                    vm.geoObject = geoObj;
                });
            });
        };


    }

})(angular);
