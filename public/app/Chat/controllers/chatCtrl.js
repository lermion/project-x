angular.module('placePeopleApp')
	.controller('chatCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
		'$window', '$http', 'storageService', 'ngDialog', 'ChatService', '$rootScope', 'socket', 'amMoment',
		'PublicationService',
		function ($scope, $state, $stateParams, StaticService, AuthService, UserService, 
			$window, $http, storageService, ngDialog, ChatService, $rootScope, socket, amMoment, 
			PublicationService) {
			$scope.$emit('userPoint', 'user');
			amMoment.changeLocale('ru');
			var storage = storageService.getStorage();
			$scope.loggedUser = storage.username;
			$scope.loggedUserId = storage.userId;
			$scope.Model = $scope.Model || {Name : "xxx"};
			$http.get('/static_page/get/name')
				.success(function (response) {
					$scope.staticPages = response;
				})
				.error(function (error) {
					console.log(error);
				});
			$scope.logOut = function () {
				AuthService.userLogOut()
					.then(function (res) {
						storageService.deleteStorage();
						$state.go('login');
					}, function (err) {
						console.log(err);
					});
			};

			$scope.openMenu = function () {
				if ($window.innerWidth <= 800) {
					$scope.showMenu = !$scope.showMenu;
				} else {
					$scope.showMenu = true;
				}
			};

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
					if (value <= 800) {
						$scope.showMenu = false;
					} else {
						$scope.showMenu = true;
					}

					if (value <= 650) {
						$scope.showBottomMenu = false;
					} else {
						$scope.showBottomMenu = true;
					}

					if (value < 520) {
						var blockThirdthLength = (parseInt(w[0].innerWidth) - 21) / 4;
						$scope.resizeSizes = 'width:' + blockThirdthLength + 'px;height:' + blockThirdthLength + 'px;';
						$scope.resizeHeight = 'height:' + blockThirdthLength + 'px;';
					} else {
						$scope.resizeSizes = '';
						$scope.resizeHeight = '';
					}
				},
				true
			);
			w.bind('resize', function () {
				$scope.$apply();
			});

			/*Page content*/

			if($state.current.name === "chat"){           
				$state.go("chat.list");
			}
			//FOR TEST	

			$scope.pub = {
				comment_count:0,
				comments:[],
				cover:"",
				created_at:"2016-07-08 12:21:05",
				group:[],
				id:46,
				images:[
					],
				is_anonym:0,
				is_main:0,
				is_moderate:0,
				is_topic:0,
				like_count:0,
				text:"asd sad asd asd",
				updated_at:"2016-07-08 12:55:11",
				user_id:2,
				user_like:false,
				videos:[]
			};

			$scope.pub.user = {
				avatar_path:"http://www.iconarchive.com/download/i47477/hopstarter/face-avatars/Male-Face-H2.ico",
				birthday:"0000-00-00",
				country_id:12,
				created_at:"2016-06-21 06:38:44",
				first_name:"Елена",
				gender:"0",
				id:2,
				is_avatar:1,
				is_online:true,
				is_private:1,
				is_sub:false,
				is_visible:1,
				last_name:"Новикова",
				login:"lenka-kolenka",
				original_avatar_path:"/upload/avatars/tx3bEJMG10.png",
				phone:"380930000000",
				publications_count:29,
				status:"Azaza",
				subscribers_count:2,
				subscription_count:2,
				updated_at:"2016-07-08 09:55:09"
			}

			$scope.refTo = function(stateName){    
				$state.go(stateName);
			};
			$scope.currTabName = $state.current.name;
			$scope.showContactData = function(contactId){
				console.log(contactId);
			};
			$scope.clearChat = function(userId, chatId){
				console.log(userId, chatId);
			};
			$scope.deleteChat = function(userId, chatId){
				console.log(userId, chatId);
			};

			function loadUserContacts(){
				PublicationService.getSubscribers($scope.loggedUserId)
					.then(function(response){
						$scope.Model.subscribers = response;                        
					},
					function(error){
						console.log(error);
					});

				PublicationService.getSubscription($scope.loggedUserId)
					.then(function(response){
						$scope.Model.subscriptions = response;                        
					},
					function(error){
						console.log(error);
					});                
			}

			$scope.Model.loadUserContactList = function(){
				loadUserContacts();
			};

			$scope.Model.showContactData = function(contact){
				console.log(contact);
				if ($state.current.name === 'chat.list') {
					$scope.Model.showChatBlock = false;
					$state.go('chat.contacts');
				}
				$scope.Model.showContactBlock = true;
				$scope.Model.displayContactBlock = true;
				$scope.Model.contact = contact;
			};

            $scope.Model.blockContact = function(contactId){
            	console.log(contactId);
                ChatService.blockUser(contactId)
                    .then(function(response){
                        console.log(response);                        
                    },
                    function(error){
                        console.log(error);
                    });
            };
            $scope.Model.deleteContact = function(contact){
                console.log('deleteContact');
                console.log(contact);
            };           

			$scope.Model.openChatWith = function(opponent){                
				if ($state.current.name === 'chat.contacts') {
					$scope.Model.showContactBlock = false;
					$state.go('chat.list');
				}
				$scope.Model.opponent = opponent; 
				$scope.Model.showChatBlock = true; 
				$scope.Model.displayChatBlock = true;
				$scope.Model.displayBlockedBlock = false;

				var data = {
					userIdFrom: $scope.loggedUserId,
					userIdTo: opponent.id,
                    room_id: opponent.room_id
				};

				socket.emit('create room', data, function(res){
                    console.log(res);
                });
			};
			socket.emit("get user rooms", $scope.loggedUserId);
			socket.on("get user rooms", function(response){
				// console.log(response);
                $scope.Model.chatRooms = response;
			});

			$scope.Model.Chat = [];
			
			$scope.Model.sendMes = function(message, roomId){				
				var data = {
					userId: $scope.loggedUserId,
					room_id: roomId,
					message: message
				}
				$scope.Model.chatMes = '';

				socket.emit('send message', data, function(res){
					// $scope.Model.Chat.push(res);
				});

				var mesInFormat = {
					text: message,
					login: $scope.loggedUser
				}

				$scope.Model.Chat.push(mesInFormat);

			};
			socket.on('send message', function(response){
				if ($scope.Model.Chat.length === 0) {
					$scope.Model.Chat = response;
				} else if(response.length === 1){
					$scope.Model.Chat.push(response);
				} 				
			});

            $scope.Model.getLockedUsers = function(){
                ChatService.getLockedUsers()
                    .then(function(response){
                    	console.log(response);
                        $scope.Model.blockedUsers = response;                           
                    },
                    function(error){
                        console.log(error);
                    });
            };

            $scope.Model.showBlockedContactChat = function(user){
            	console.log(user);
            	$scope.Model.opponent = user;
            	$scope.Model.displayBlockedBlock = true;
            }

            // $scope.Model.getLockedUsers();

            

	}]);