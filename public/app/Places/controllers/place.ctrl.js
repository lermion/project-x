(function (angular) {
    'use strict';

    angular
        .module('app.places')
        .controller('PlaceCtrl', PlaceCtrl);

    PlaceCtrl.$inject = ['$scope', '$state', '$timeout', 'place', 'storageService', 'placesService', 'ngDialog',
        '$http', '$window', 'Upload', 'amMoment'];

    function PlaceCtrl($scope, $state, $timeout, place, storageService, placesService, ngDialog,
                       $http, $window, Upload, amMoment) {

        var vm = this;
        var storage = storageService.getStorage();

        var myId = +storage.userId;
        var myAvatar = storage.loggedUserAva;
        var firstName = storage.firstName;
        var lastName = storage.lastName;

        var modalEditPlace, modalDeletePlace, modalInviteUsers, modalCropLogoImage, modalMap,
            modalSetCreator, modalNewPublication, modalReviewPublication, map;


        vm.firstName = firstName;
        vm.lastName = lastName;
        vm.myAvatar = myAvatar;

        vm.subForm = false;

        vm.countries = [];
        vm.cities = [];
        var originalCities = [];

        vm.place = place;
        vm.placeEdited = angular.copy(vm.place);

        vm.selectedImage = null;
        vm.myCroppedImage = null;
        vm.blobImg = null;


        // Watchers
        var watchCountry, watchCity;

//var groupName = $stateParams.groupName;
        //
        //var newPublicationObj = {
        //    groupId: group.id,
        //    text: ''
        //};
        //
        //

        //vm.newPublication = angular.copy(newPublicationObj);
        //
        //vm.forms = {
        //    editGroup: {},
        //    newPublication: {}
        //};
        //
        //vm.showGroupMenu = false;
        //vm.subscribers = [];
        //vm.invitedUsers = [];
        //vm.adminsList = [];
        //vm.creator = {id: null};
        //
        //vm.inviteNotSend = true;
        //vm.isSend = false;
        //
        //vm.emoji = {
        //    emojiMessage: {
        //        messagetext: '',
        //        rawhtml: ''
        //    }
        //};
        //
        //vm.userName = storage.username;
        //
        //vm.files = [];
        //
        activate();

        ///////////////////////////////////////////////////

        function activate() {
            init();
            getCountries();
            getCities(vm.place.country.id).then(saveOriginalCities);
            getDynamicPlaceType();

            //TODO: refact!
            if (vm.placeEdited.is_dynamic) {
                vm.placeEdited.expired_date = new Date(vm.placeEdited.expired_date);
            }
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

        function setWatchers() {
            watchCountry = $scope.$watch(angular.bind(vm, function () {
                return vm.placeEdited.country;
            }), function (newCountry, oldCountry) {
                if (newCountry && oldCountry && newCountry.id !== oldCountry.id) {
                    getCities(newCountry.id);
                    vm.placeEdited.address = null;
                }
            });
            watchCity = $scope.$watch(angular.bind(vm, function () {
                return vm.placeEdited.city;
            }), function (newCity, oldCity) {
                if (newCity && oldCity && newCity.id !== oldCity.id) {
                    vm.placeEdited.address = null;
                }
            });
        }

        function clearWatchers() {
            watchCountry();
            watchCity();
        }

        function saveOriginalCities() {
            originalCities = angular.copy(vm.cities);
        }


        // set default tab (view) for place view
        $scope.$on("$stateChangeSuccess", function () {
            var state = $state.current.name;
            if (state === 'place') {
                $state.go('place.publications');
            } else if (state === 'place.edit') {
                setWatchers();
            }
        });

        vm.subscribe = function () {
            if (place.is_creator) {
                openModalSetCreator();
            } else {
                placesService.subscribePlace(vm.place.id)
                    .then(function (data) {
                        if (data.status) {
                            vm.place.is_sub = data.is_sub;
                            if (data.is_sub) {
                                vm.place.users.push({
                                    avatar_path: myAvatar,
                                    first_name: firstName,
                                    last_name: lastName,
                                    id: myId
                                });
                                vm.place.count_users += 1;
                            } else {
                                removeUser({userId: myId});
                                vm.place.count_users -= 1;
                            }

                        }
                    });
            }

        };
        //$scope.$on('ngDialog.opened', function (e, $dialog) {
        //    var string = $filter('colonToSmiley')(vm.placeEdited.description);
        //    if ($dialog.name === "modal-edit-group") {
        //        $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML = string;
        //    }
        //});
        //
        //
        // Modal windows
        vm.openModalEditPlace = function () {
            vm.placeEdited = angular.copy(vm.place);
            modalEditPlace = ngDialog.open({
                template: '../app/Places/views/popup-edit-place.html',
                name: 'modal-edit-group',
                className: 'popup-add-group popup-edit-group ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.openModalDeletePlace = function () {
            modalDeletePlace = ngDialog.open({
                template: '../app/Places/views/popup-delete-place.html',
                name: 'modal-delete-group',
                className: 'popup-delete-group ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.openModalInviteUsers = function () {
            getSubscribers().then(function () {
                modalInviteUsers = ngDialog.open({
                    template: '../app/Groups/views/popup-invite-group.html',
                    name: 'modal-invite-group',
                    className: 'popup-invite-group ngdialog-theme-default',
                    scope: $scope
                });
            });
        };

        vm.openModalNewPublication = function () {
            modalNewPublication = ngDialog.open({
                template: '../app/Groups/views/popup-add-publication.html',
                name: 'modal-publication-group',
                className: 'user-publication ngdialog-theme-default',
                scope: $scope,
                preCloseCallback: resetFormNewPublication
            });
        };

        vm.openModalReviewPublication = function (id) {
            getPublication(id).then(function () {
                modalReviewPublication = ngDialog.open({
                    template: '../app/Groups/views/popup-view-group-publication.html',
                    name: 'modal-publication-group',
                    className: 'view-publication ngdialog-theme-default',
                    scope: $scope
                });
            });
        };

        vm.initCity = function () {
            return vm.placeEdited.cities.filter(function (city) {
                return city.id === vm.placeEdited.city_id;
            })[0];
        };
        //
        //
        //// Submit forms
        //vm.submitNewPublication = function () {
        //    vm.newPublication.text = vm.emoji.emojiMessage.messagetext;
        //    vm.newPublication.files = filterAttachFilesByType();
        //    groupsService.addPublication(vm.newPublication)
        //        .then(function (data) {
        //            if (data.status) {
        //                console.log('Publication added!');
        //                modalNewPublication.close();
        //            }
        //        })
        //};
        //
        //
        ////New publication
        //vm.removeAttachFile = function (index) {
        //    vm.files.splice(index, 1);
        //    $scope.$broadcast('rebuild:me');
        //};
        //
        //vm.beforeAttachFileToPublication = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
        //    if (vm.files.length > 4 || files > 4) {
        //        $scope.$broadcast('rebuild:me');
        //    }
        //};
        //
        //
        //vm.deleteGroup = function () {
        //    groupsService.deleteGroup(vm.group.id)
        //        .then(function (data) {
        //            if (data.status) {
        //                $state.go('groups');
        //                modalDeletePlace.close();
        //            }
        //        });
        //};
        //


        // Submit actions
        vm.updatePlace = function () {
            vm.subForm = true;

            var placeEdited = angular.copy(vm.placeEdited);
            place = angular.copy(vm.placeEdited);

            if (!vm.placeEditedForm.logo.$dirty) {
                placeEdited.avatar = null;
            }
            if (!vm.placeEditedForm.cover.$dirty) {
                placeEdited.cover = null;
            }
            if (!vm.placeEditedForm.name.$dirty) {
                placeEdited.name = null;
            }

            if (placeEdited.expired_date) {
                placeEdited.expired_date = moment(placeEdited.expired_date).format('YYYY-MM-DD');
            }

            placesService.updatePlace(placeEdited)
                .then(function (data) {
                    if (data.status) {
                        vm.place = place;
                        if (data.placeData.url_name) {
                            place.url_name = data.placeData.url_name;
                            changePlaceUrlName(data.placeData.url_name);
                        } else {
                            originalCities = angular.copy(vm.cities);
                            $state.go('place', {'placeName': place.url_name});
                            $timeout(function () {
                                vm.subForm = false;
                            }, 0);
                        }
                    }
                });
        };


        // Form actions

        vm.abortUpdatePlace = function () {
            clearWatchers();
            resetFormPlaceEdit();
            $state.go('place', {'placeName': vm.place.url_name});
        };

        vm.openModalMap = function () {
            modalMap = ngDialog.open({
                template: '../app/Places/views/popup-map.html',
                name: 'modal-edit-group',
                className: 'popup-add-group place-map ngdialog-theme-default',
                scope: $scope
            });
        };

        vm.beforeInit = function () {
            var addressStr = vm.placeEdited.country.name + ' ' + vm.placeEdited.city.name;
            ymaps.geocode(addressStr, {results: 1}).then(function (res) {
                // Выбираем первый результат геокодирования.
                var firstGeoObject = res.geoObjects.get(0);
                // Задаем центр карты.
                $scope.$apply(function () {
                    vm.center = firstGeoObject.geometry.getCoordinates();
                });
            }, function (err) {
                // Если геокодирование не удалось, сообщаем об ошибке.
                alert(err.message);
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
            vm.geoObject.geometry.coordinates = coords;

            // Отправим запрос на геокодирование.
            ymaps.geocode(coords).then(function (res) {
                var names = [];
                // Переберём все найденные результаты и
                // запишем имена найденный объектов в массив names.
                res.geoObjects.each(function (obj) {
                    names.push(obj.properties.get('text'));
                });
                vm.placeEdited.address = names[0];

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

                vm.placeEdited.coordinates_x = geoObj.geometry.coordinates[0];
                vm.placeEdited.coordinates_y = geoObj.geometry.coordinates[1];
                $scope.$apply(function () {
                    vm.geoObject = geoObj;
                });
            });
        };

        function resetFormPlaceEdit() {
            vm.placeEdited = angular.copy(vm.place);
            vm.cities = angular.copy(originalCities);
            vm.placeEditedForm.$setPristine();
        }

        function getCities(countryId) {
            return placesService.getCities(countryId).then(
                function (data) {
                    vm.cities = data;
                }
            );
        }

        function getCountries() {
            placesService.getCountries().then(
                function (data) {
                    vm.countries = data;
                }
            );
        }

        function getDynamicPlaceType() {
            placesService.getPlaceTypeDynamic()
                .then(function (data) {
                    vm.typeDynamic = data;
                });
        }

        //
        //vm.abortDeleteGroup = function () {
        //    modalDeletePlace.close();
        //};
        //
        //vm.subscribe = function () {
        //    if (group.is_creator) {
        //        openModalSetCreator();
        //    } else {
        //        groupsService.subscribeGroup(vm.place.id)
        //            .then(function (data) {
        //                if (data.status) {
        //                    vm.group.is_sub = data.is_sub;
        //                    if (data.is_sub) {
        //                        vm.group.users.push({
        //                            avatar_path: myAvatar,
        //                            first_name: firstName,
        //                            last_name: lastName,
        //                            id: myId
        //                        });
        //                        vm.group.count_users += 1;
        //                    } else {
        //                        removeUser({userId: myId});
        //                        vm.group.count_users -= 1;
        //                    }
        //
        //                }
        //            });
        //    }
        //
        //};
        //
        //vm.onItemSelected = function (user) {
        //    var isExist = $filter('getById')(vm.invitedUsers, user.id);
        //
        //    if (!isExist) {
        //        var item = {
        //            userId: user.id,
        //            firstName: user.first_name,
        //            lastName: user.last_name,
        //            avatar: user.avatar_path,
        //
        //            isAdmin: false
        //        };
        //        vm.invitedUsers.push(item);
        //    }
        //};
        //
        //vm.removeUserFromInviteList = function (user) {
        //    for (var i = vm.invitedUsers.length - 1; i >= 0; i--) {
        //        if (vm.invitedUsers[i].userId == user.userId) {
        //            vm.invitedUsers.splice(i, 1);
        //        }
        //    }
        //};
        //
        //vm.removeUser = function (user) {
        //    removeUser({
        //        userId: user.id,
        //        isAdmin: user.is_admin
        //    });
        //};
        //
        //vm.submitInviteUsers = function () {
        //    if (!vm.inviteNotSend) {
        //        return false;
        //    }
        //    groupsService.inviteUsers(group.id, vm.invitedUsers)
        //        .then(function (data) {
        //            if (data.status) {
        //                vm.inviteNotSend = false;
        //                $timeout(function () {
        //                    resetFormInviteUsers();
        //                    modalInviteUsers.close();
        //                }, 2000);
        //            }
        //        });
        //};
        //
        //vm.abortInviteUsers = function () {
        //    resetFormInviteUsers();
        //    modalInviteUsers.close();
        //};
        //
        //vm.setAdmin = function (user) {
        //    if (!vm.group.is_creator) {
        //        return false;
        //    }
        //    groupsService.setAdmin(group.id, user.id)
        //        .then(function (data) {
        //            if (data.status) {
        //                user.is_admin = data.is_admin;
        //            }
        //        });
        //};
        //
        //vm.setCreator = function () {
        //    if (vm.isSend) {
        //        return false;
        //    }
        //    groupsService.setCreator(group.id, vm.creator.id)
        //        .then(function (data) {
        //            if (data.status) {
        //                vm.isSend = true;
        //                $timeout(function () {
        //                    resetFormSetCreator();
        //                    modalSetCreator.close();
        //                    $state.go('groups');
        //                }, 2000);
        //            }
        //        });
        //};
        //
        //vm.abortSetCreator = function () {
        //    resetFormSetCreator();
        //    modalSetCreator.close();
        //};
        //
        vm.changePlaceCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
            Upload.resize(file, 700, 240, 1, null, null, true).then(function (resizedFile) {
                vm.placeEdited.cover = resizedFile;
            });
        };
        vm.changePlaceAvatarFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
            openModalCropAvatarImage(file.name, event);
        };

        vm.saveCropp = function (croppedDataURL) {

            var blob = Upload.dataUrltoBlob(croppedDataURL, vm.selectedLogoImage.name);


            Upload.resize(blob, 100, 100, 1, null, null, true).then(function (resizedFile) {
                vm.placeEdited.avatar = resizedFile;
            });

            modalCropLogoImage.close();
        };

        function openModalCropAvatarImage(fileName, e) {
            var file = e.currentTarget.files[0];
            if (file) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $scope.$apply(function ($scope) {
                        vm.selectedLogoImage = e.target.result;
                        vm.selectedLogoImage.name = fileName;
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

        //
        //vm.changeMainFile = function (file, flag, pub) {
        //    if (file.pivot.video_id) {
        //        vm.mainImage = "";
        //        vm.mainVideo = file.url;
        //    } else if (file.pivot.image_id) {
        //        if (flag) {
        //            vm.mainImageInPopup = file.url;
        //        } else {
        //            vm.mainVideo = "";
        //            vm.mainImage = file.url;
        //        }
        //    }
        //};
        //
        //
        //function getSubscribers() {
        //    return UserService.getSubscribers(myId)
        //        .then(function (subscribers) {
        //            vm.subscribers = subscribers;
        //        });
        //}
        //
        //function getPublication(id) {
        //    return PublicationService.getSinglePublication(id)
        //        .then(function (data) {
        //            vm.activePublication = data;
        //            if (data.images[0] !== undefined) {
        //                vm.mainImage = data.images[0].url;
        //            }
        //        });
        //}
        //
        // Reset Forms
        function resetFormInviteUsers() {
            vm.invitedUsers = [];
            vm.subscribers = [];
            vm.inviteNotSend = true;
        }

        function resetFormSetCreator() {
            vm.adminsList = [];
            vm.creator.id = null;
        }

        function resetFormNewPublication() {
            vm.newPublication = angular.copy(newPublicationObj);
            vm.files = [];
        }

        //
        //
        function removeUser(user) {
            var arr = [];
            var indexToRemove;
            for (var i = vm.place.users.length - 1; i >= 0; i--) {
                if (vm.place.users[i].id == user.userId) {
                    if (user.isAdmin && vm.place.is_creator || !user.isAdmin && vm.place.is_admin || user.userId === myId) {
                        arr.push(user.userId);
                        indexToRemove = i;
                        groupsService.removeUsers(vm.place.id, arr)
                            .then(function (data) {
                                if (data.status) {
                                    vm.place.users.splice(indexToRemove, 1);
                                }
                            });
                    }

                }
            }
        }

        function changePlaceUrlName(str) {
            var url = window.location.toString();
            var pathArray = window.location.href.split('/');
            var urlNamePos = pathArray.indexOf('place');
            pathArray[urlNamePos + 1] = str;
            pathArray.splice(pathArray.length - 1, 1);

            var newPathname = '';
            for (var i = 0; i < pathArray.length; i++) {
                newPathname += pathArray[i];
                newPathname += "/";
            }
            window.location = newPathname.substring(0, newPathname.length - 1);
        }

        function getPlace() {
            placesService.getPlace(place.url_name)
                .then(function (data) {
                    if (data) {
                        vm.place = data;
                    }
                });
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

        //
        //function openModalSetCreator() {
        //    vm.adminsList = getAdminsList();
        //    modalSetCreator = ngDialog.open({
        //        template: '../app/Groups/views/popup-setcreator-group.html',
        //        name: 'modal-setcreator-group',
        //        className: 'popup-setcreator-group ngdialog-theme-default',
        //        scope: $scope
        //    });
        //}
        //
        //function getAdminsList() {
        //    return group.users.filter(function (item) {
        //        return (!!item.is_admin === true && item.id !== myId);
        //    });
        //}
        //
        //function filterAttachFilesByType() {
        //    var filesByType = {
        //        images: [],
        //        videos: []
        //    };
        //    if (vm.files && vm.files.length > 0) {
        //        angular.forEach(vm.files, function (file) {
        //            if (~file.type.indexOf('image')) {
        //                filesByType.images.push(file);
        //            } else if (~file.type.indexOf('video')) {
        //                filesByType.videos.push(file);
        //            }
        //        });
        //    }
        //
        //    return filesByType;
        //}

        //function getGroup() {
        //    return groupsService.getGroup(groupName)
        //        .then(function (data) {
        //            if (data) {
        //                vm.group = data;
        //                vm.group.is_open = !!vm.group.is_open;
        //                vm.group.avatarIsChange = false;
        //
        //                $scope.emoji.messagetext = data.description;
        //            } else {
        //                showNoticeGroupNotFound();
        //            }
        //        });
        //}

    }

})(angular);
