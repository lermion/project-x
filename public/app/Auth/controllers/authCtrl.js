angular.module('placePeopleApp')
    .controller('authCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'AuthService', 'ngDialog', 'storageService', '$window',
        'countries',
        function ($rootScope, $scope, $state, $timeout, $http, AuthService, ngDialog, storageService, $window, countries) {


            $scope.countries = countries ? countries : [];

            init();

            //////////////////////////////////////////

            function init() {

                setUserCountry();

            }


            /**
             * Set user country for registration select element
             */
            function setUserCountry() {
                $scope.countries.forEach(function (elem) {
                    if (elem.name === $rootScope.countryName) {
                        $scope.newUserCountryId = +elem.id;
                        console.log($scope.newUserCountryId);
                    }
                });
            }

            $scope.$emit('authPoint', 'auth');

            $timeout(function () {
                $scope.dataLoaded = true;
            }, 1300);


            $scope.phoneRegExp = /[0-9]{3,18}/;

            $http.get('/static_page/get/name')
                .success(function (res) {
                    $scope.staticPages = res;
                })
                .error(function (err) {
                    console.log(err);
                });
            var storage = storageService.getStorage();

            if (storage.length) {
                $scope.userLogged = true;
                $scope.username = storage.username;
            } else {
                $scope.userLogged = false;
            }

            $scope.openBottomMenu = function () {
                if ($window.innerWidth <= 650) {
                    $scope.showBottomMenu = !$scope.showBottomMenu;
                } else {
                    $scope.showBottomMenu = false;
                }
            };

            var w = angular.element($window);
            $scope.$watch(
                function () {
                    return $window.innerWidth;
                },
                function (value) {
                    if (value <= 650) {
                        $scope.showBottomMenu = false;
                    } else {
                        $scope.showBottomMenu = true;
                    }
                },
                true
            );
            w.bind('resize', function () {
                $scope.$apply();
            });

            $scope.loginPage = function () {
                $scope.hideForm = true;
                $state.go('login');
            };

            $scope.pwdRestore = function () {
                state.go('restore');
            };

            $scope.setCoutryCode = function () {
                console.log($scope.newUserCountryId);
                var countryId = parseInt($scope.newUserCountryId);
                $scope.countries.forEach(function (country) {
                    if (country.id === countryId) {
                        $scope.phoneCode = country.code;
                    }
                });
            };

            $scope.calcPadding = function () {
                return parseInt(angular.element(document.querySelector("#phone"))[0].clientWidth);
            };

            $scope.userRegisterS1 = function () {
                $scope.codeSendLoader = true;
                if (!$scope.newUserCountryId && !$scope.newUserPhoneNumber) {
                    $scope.nupnErr = 'Заполните все поля';
                } else if (!$scope.newUserCountryId) {
                    $scope.nupnErr = 'Выберите страну';
                } else if (!$scope.newUserPhoneNumber) {
                    $scope.nupnErr = 'Введён некорректный номер телефона';
                } else {
                    var countryId = parseInt($scope.newUserCountryId);
                    var phoneNum = parseInt($scope.phoneCode + $scope.newUserPhoneNumber);
                }
                if ($scope.nupnErr) {
                    $scope.codeSendLoader = false;
                    return;
                }
                AuthService.sendMessage(phoneNum, countryId)
                    .then(function (res) {
                        if (res.status) {
                            $scope.codeSendLoader = false;
                            $scope.newUserId = res.user_id;
                            $scope.regStep1 = true;
                        } else {
                            if (parseInt(res.error.code) === 1) {
                                $scope.nupnErr = 'Данный номер уже зарегистрирован';
                            } else if (parseInt(res.error.code) === 3) {
                                $scope.nupnErr = 'Ошибка при отправке кода подтверждения';
                            } else if (parseInt(res.error.code) === 10) {
                                var endDate = new Date(res.error.date);
                                var today = new Date(((new Date).toISOString()).slice(0, 10));
                                if (endDate >= today) {
                                    var diff = (endDate - today) / 1000 / 60 / 60 / 24;
                                    $scope.nupnErr = 'Номер заблокирован для регистрации еще на ' + diff + ' дней';
                                } else {
                                    $scope.nupnErr = 'Номер заблокирован навсегда';
                                }
                            }
                            $scope.codeSendLoader = false;
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };

            $scope.userRegisterS2 = function () {
                $scope.smsConfirmLoader = true;
                if (!$scope.newUserSmsCode) {
                    $scope.nuscErr = 'Введите код';
                    $scope.smsConfirmLoader = false;
                    return;
                } else {
                    var code = parseInt($scope.newUserSmsCode);
                }
                AuthService.checkSms(code)
                    .then(function (res) {
                        if (res.status) {
                            $scope.regConfirmed = true;
                            $scope.smsConfirmLoader = false;
                        } else {
                            $scope.nuscErr = 'Неверный код';
                            $scope.smsConfirmLoader = false;
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };

            $scope.myImage = '';
            $scope.myCroppedImage = '';
            var handleFileSelect = function (evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function ($scope) {
                        $scope.myImage = evt.target.result;
                        ngDialog.open({
                            template: '../app/Auth/views/crop-image.html',
                            className: 'ngdialog-theme-default',
                            scope: $scope
                        });
                    });
                };
                reader.readAsDataURL(file);
            };
            angular.element(document.querySelector('#avatarImg')).on('change', handleFileSelect);

            // 	function blobToFile(blob){
            // 	blob.lastModifiedDate = new Date();
            // 	blob.name = 'image';
            // 	return blob;
            // }

            $scope.saveCropp = function (img, cropped) {
                $scope.croppedImg = img;
                $scope.croppedFile = cropped;
                $scope.showEditAva = false;
                ngDialog.closeAll();
            };

            $scope.userRegisterS3 = function (firstName, lastName, gender, login, pwd, countryId, uId) {

                $scope.regLoader = true;
                var errors = 0;
                if (!firstName) {
                    $scope.nunErr = 'Введите имя';
                    errors++;
                }
                if (!lastName) {
                    $scope.nusErr = 'Введите фамилию';
                    errors++;
                }
                if (gender === undefined) {
                    $scope.nugErr = 'Выберите пол';
                    errors++;
                }
                if (!login) {
                    $scope.nulErr = 'Введите логин';
                    errors++;
                }
                if (!pwd || pwd.length < 6) {
                    $scope.nupErr = 'Длина пароля должна быть не меньше 6 знаков';
                    errors++;
                }
                if (errors > 0) {
                    $scope.regLoader = false;
                    return;
                }
                AuthService.registerUser(firstName, lastName, gender, login, pwd, countryId, $scope.croppedImg, uId)
                    .then(function (res) {
                        if (res.status) {
                            $scope.regLoader = false;
                            $scope.userRegistred = true;
                            storageService.setStorageItem('username', res.login);
                            storageService.setStorageItem('userId', res.user_id);
                            $state.go('user', {username: res.login});
                        } else {
                            if (parseInt(res.error.code) === 1) {
                                $scope.nulErr = 'Такой логин уже существует';
                            } else if (parseInt(res.error.code) === 8) {
                                $scope.nupErr = 'Прекратите эти попытки';
                            }
                            $scope.regLoader = false;
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };

            /*LOGIN PAGE*/
            $scope.login = function (login, pwd) {
                $scope.loginLoader = true;
                if (!login && !pwd) {
                    $scope.loginError = 'Введите логин и пароль';
                } else if (!login) {
                    $scope.loginError = 'Введите логин';
                } else if (!pwd) {
                    $scope.loginError = 'Введите пароль';
                }

                if ($scope.loginError) {
                    $scope.loginLoader = false;
                    return;
                }
                AuthService.userLogIn(login, pwd)
                    .then(function (res) {
                        if (res.status) {
                            storageService.setStorageItem('username', res.login);
                            storageService.setStorageItem('userId', res.user_id);
                            $state.go('user', {username: res.login});
                        } else {
                            $scope.loginError = 'Неверный логин или пароль';
                        }
                        $scope.loginLoader = false;

                    }, function (err) {
                        console.log(err);
                    });
            };

            $scope.keyPress = function (event, login, password) {
                if (event === 13) {
                    $scope.login(login, password);
                }
            };

            /*RESTORE PAGE*/
            $scope.sendRestoreSms = function () {
                $scope.restoreSmsLoader = true;
                if (!$scope.restoreUserPhone) {
                    $scope.ruphErr = 'Введите корректный номер';
                    $scope.restoreSmsLoader = false;
                    return;
                }
                AuthService.sendRestoreSms($scope.restoreUserPhone)
                    .then(function (res) {
                        if (res.status) {
                            $scope.restoreSmsLoader = false;
                            $scope.smsSend = true;
                        } else {
                            if (parseInt(res.error.code) === 3) {
                                $scope.ruphErr = 'Ведутся технические работы. Попробуйте позже';
                            } else if (parseInt(res.error.code) === 1) {
                                $scope.ruphErr = 'По данному номеру нет зарегистрированных пользователей';
                            }
                            $scope.restoreSmsLoader = false;
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };

            $scope.sendRestoreCode = function () {
                $scope.checkSmsLoader = true;
                if (!$scope.restoreUserSms) {
                    $scope.checkSmsLoader = false;
                    $scope.rusError = 'Введите код';
                    return;
                }
                AuthService.validateRestoreSms($scope.restoreUserSms)
                    .then(function (res) {
                        if (res.status) {
                            $scope.checkSmsLoader = false;
                            $scope.smsConfirmed = true;
                        } else {
                            if (parseInt(res.error.code) === 4) {
                                $scope.rusError = 'Введён неверный код';
                            } else {
                                $scope.rusError = 'Ошибка';
                            }
                            $scope.checkSmsLoader = false;
                        }
                    }, function (err) {
                        console.log(err);
                    });
            };

            $scope.setNewPwd = function () {
                $scope.newPwdLoader = true;
                if (!$scope.restoreUserPwd || !$scope.restoreUserPwdConf || $scope.restoreUserPwd != $scope.restoreUserPwdConf) {
                    $scope.rupErr = 'Пароли не совпадают';
                } else if ($scope.restoreUserPwd.length < 6) {
                    $scope.rupErr = 'Длина пароля должна быть от 6 символов';
                }
                if ($scope.rupErr) {
                    $scope.newPwdLoader = false;
                    return;
                }
                AuthService.changePwd($scope.restoreUserPwd)
                    .then(function (res) {
                        if (res.status) {
                            $scope.changePwdSuccess = true;
                            $timeout(function () {
                                $state.go('login');
                            }, 1500);
                        } else {
                            $scope.rupErr = 'Вы не вышли из аккаунта';
                        }
                        $scope.newPwdLoader = false;
                    }, function (err) {
                        console.log(err);
                    });
            };

        }]);
