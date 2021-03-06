angular.module('placePeopleApp')
	.controller('authCtrl', ['$rootScope', '$scope', '$state', '$timeout', '$http', 'AuthService', 'ngDialog', 'storageService', '$window',
		'countries',
		function ($rootScope, $scope, $state, $timeout, $http, AuthService, ngDialog, storageService, $window, countries) {


			$scope.countries = countries ? countries : [];

			$scope.createAccountForm = {};
			$scope.createAccountFirstStepForm = {};

			$scope.newUserCountryId = null;
            $scope.newUserConfirmPassword = null;

			$scope.phoneCode = null;

			$scope.isAcceptRules = false;


			init();

			//////////////////////////////////////////

			function init() {
				if( $state.is('reg') ) {
					$timeout(function() {
						setUserCountry();
						setCountryCode();
					}, 0);
				}
			}



			$scope.$emit('authPoint', 'auth');

			$timeout(function () {
				$scope.dataLoaded = true;
			}, 1300);


			$scope.phoneRegExp = /[0-9]{3,18}/;

			$http.get('/static_page/get/name')
				.success(function (res) {
					$scope.staticPages = res.static_page;
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

			$scope.$on('location:ready', function() {
				if( $state.is('reg') ) {
					$timeout(function() {
						setUserCountry();
						setCountryCode();
					}, 0);
				}
			});

			$scope.loginPage = function () {
				$scope.hideForm = true;
				$state.go('login');
			};
			function getAreas(){
				AuthService.getAreas().then(function(response){
					$scope.areas = response;
					$scope.topics = angular.copy(response);
				},
				function(error){
					console.log(error);
				});
			}

			getAreas();

			$scope.regWithCode = function(code){
				AuthService.checkInviteCode(code).then(function(response){
					if(response.status){
						$rootScope.isRightCode = true;
						$state.go("reg");
					}else if(!response.status && parseInt(response.error.code) === 2){
						$rootScope.isRightCode = false;
						$scope.wrongCode = true;
						$scope.bruteForceError = false;
					}else if(!response.status && parseInt(response.error.code) === 1){
						$rootScope.isRightCode = false;
						$scope.wrongCode = false;
						$scope.bruteForceError = true;
					}
				},
				function(error){
					console.log(error);
				});
			};

			$scope.pwdRestore = function () {
				state.go('restore');
			};

			$scope.setCoutryCode = function () {
				var countryId = parseInt($scope.newUserCountryId);
				$scope.countries.forEach(function (country) {
					if (country.id === countryId) {
						$scope.phoneCode = "+" + country.code;
					}
				});
			};

			$scope.checkedAreas = [];

			$scope.selectArea = function(index, areaId){
				$scope.checkedAreas[0] = areaId;
				$scope.currentIndex = index;
				$scope.selectedOption = $scope.areas[index];
			};

			$scope.isSelected = function(index){
				return index === $scope.currentIndex;
			};

			$scope.calcPadding = function () {
				return parseInt(angular.element(document.querySelector("#phone"))[0].clientWidth);
			};

			$scope.userRegisterS1 = function () {

				$scope.createAccountFirstStepForm.$setSubmitted();

				if ($scope.createAccountFirstStepForm.$invalid) return false;

				if (!$scope.isAcceptRules) {
					return false;
				}

				if($scope.checkedAreas.length === 0){
					$scope.nupnErr = "Вы не выбрали область видимости";
					return;
				}
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
				AuthService.sendMessage(phoneNum, countryId).then(function(res){
					if(res.status){
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
				},
				function (error){
					console.log(error);
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
				$scope.fileName = file.name;
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


			$scope.saveCropp = function (img, cropped) {
				$scope.originalImageBlobFile = blobToFile($scope.myImage, $scope.fileName);
				$scope.originalImageBlobFile.filename = $scope.fileName;
				$scope.croppedImg = img;
				$scope.croppedFile = cropped;
				$scope.showEditAva = false;
				ngDialog.closeAll();
			};
			$scope.showAnotherTopic = false;
			$scope.changeTopic = function(selectedOption){
				if(selectedOption.id !== undefined){
					$scope.checkedAreas[0] = selectedOption.id;
				}else{
					$scope.checkedAreas = [];
				}
				if(selectedOption.name === "Другое"){
					$scope.showAnotherTopic = true;
				}else{
					$scope.showAnotherTopic = false;
				}
			}

			function blobToFile(dataURI){
				var byteString = atob(dataURI.split(',')[1]);
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ab], { type: 'image/jpeg' });
			}

			$scope.userRegisterS3 = function (firstName, lastName, gender, login, pwd, countryId, uId) {

				$scope.regLoader = true;

				//TODO: replace to ng-messages validation
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

				$scope.createAccountForm.$setSubmitted();

				if (errors > 0) {
					$scope.regLoader = false;
					return;
				}

				if ($scope.createAccountForm.$invalid) {
					return false;
				}

				AuthService.registerUser(firstName, lastName, gender, login, pwd, countryId, $scope.croppedImg, uId, $scope.originalImageBlobFile, $scope.checkedAreas)
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
			$scope.login = function(login, pwd){

				var number = '',
					isInternationalPhoneCode = false;

				var phoneCode = getPhoneCodeByCountryName($rootScope.countryName);

				// console.log('Login - ' + login);
				// console.log(phoneCode);

				var firstChar = login.charAt(0);

				// удалим пробельные символы в начале и в конце логина
				login = login.trim();

				// удалим символ '+'
				if (firstChar === '+') {
					login = login.substr(1);
				}


				// логин для авторизации не должен содержать ничего кроме цифр
				var regexp = /^\d+$/;
				var result = regexp.test(login);

				if (!result) {
					$scope.loginError = 'Авторизируйтесь через номер телефона';
					return false;
				}

				// если РФ
				if (phoneCode === '7') {
					// если начинается с 8ки - 8ку заменяем 7кой
					if (firstChar === '8') {
						login = '7' + login.slice(1);
					}
				// если не РФ, то номер должен быть в международном формате
				} else {
					isInternationalPhoneCode = true;
				}


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

				AuthService.userLogIn(login, pwd).then(function(res){
					if(res.status){
						storageService.setStorageItem('username', res.login);
						storageService.setStorageItem('userId', res.user_id);
						$rootScope.isAuthorized = true;
						$rootScope.user.userId = res.user_id;
						$rootScope.user.username = res.login;
						//$state.go('user', {username: res.login});
						$state.go('feed');
					}else{
						$scope.loginError = 'Неверный номер телефона или пароль';
					}
					$scope.loginLoader = false;

				},
				function (error){
					console.log(error);
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

			$scope.changeStateTo = function(stateName) {
			    $state.go(stateName);
            };

            $scope.transitionToRules = function(rulesPageName) {
				var state = $scope.staticPages
					.filter(function(item) {
						return item.name === rulesPageName;
					});
				if (state.length > 0) {
					$state.go('static', {pageName: rulesPageName});
				} else {
					return false;
				}
			};


			/**
			 * Set user country for registration select element
			 */
			function setUserCountry() {
				$scope.countries.forEach(function (elem) {
					if (elem.name === $rootScope.countryName) {
						$scope.newUserCountryId = +elem.id;
					}
				});
			}

			function setCountryCode() {
				var countryId = parseInt($scope.newUserCountryId);
				$scope.countries.forEach(function (country) {
					if (country.id === countryId) {
						$scope.phoneCode = country.code;
					}
				});
			}

			/**
			 * Get prefix phone code by name of country
			 * @param countryName
			 */
			function getPhoneCodeByCountryName(countryName) {

				var code = '';

				$scope.countries.forEach(function (country) {
					if (country.name === countryName) {
						code = country.code;
					}
				});

				return code;

			}


		}]);
