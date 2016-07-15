angular.module('placePeopleApp')
	.controller('chatCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
		'$window', '$http', 'storageService', 'ngDialog', 'ChatService', '$rootScope', 'socket', 'amMoment',
		'PublicationService', 'Upload',
		function ($scope, $state, $stateParams, StaticService, AuthService, UserService, 
			$window, $http, storageService, ngDialog, ChatService, $rootScope, socket, amMoment, 
			PublicationService, Upload) {
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

			$scope.Model.mobile = {};

			if ($window.innerWidth <= 768) {
				$scope.Model.mobile.display = true;								
			} else {
				$scope.Model.mobile.display = false;
			}

			if($state.current.name === 'chat.mobile' && $window.innerWidth > 768){				
				$scope.Model.showChatBlock = true;				
				$state.go('chat.list');
			}
			if($state.current.name === 'chat.contact-mobile' && $window.innerWidth > 768){				
				$scope.Model.showChatBlock = true;				
				$state.go('chat.contacts');
			}

			$scope.Model.checkCurrUrl = function(){
				$scope.Model.currRoute = $state.current.name;				
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
				if ($window.innerWidth <= 768) {
					$scope.Model.mobile.hideContent = false;
				}    
				$state.go(stateName);
			};
			
			$scope.Model.reloadRooms = function(){
				socket.emit("get user rooms", $scope.loggedUserId);
			};
			socket.emit("get user rooms", $scope.loggedUserId);
			//TODO
			$scope.Model.clearChat = function(user){
				console.log(user);
			};
			$scope.Model.deleteChat = function(user){				
				ChatService.deleteChat(user.room_id)
					.then(function(res){
						if (res.status) {
							$scope.Model.displayChatBlock = false;
							$scope.Model.reloadRooms();
						}
					  }, function(err){
						console.log(err);
					  });
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
				// console.log(contact);
				if ($state.current.name === 'chat.list') {
					$scope.Model.showChatBlock = false;
					$state.go('chat.contacts');
				}
				$scope.Model.showContactBlock = true;
				$scope.Model.displayContactBlock = true;
				$scope.Model.contact = contact;
				if ($window.innerWidth <= 768) {							
						$scope.Model.mobile.hideContent	= true;							
						$state.go('chat.contact-mobile');
				}
			};

			$scope.Model.blockContact = function(contact){				
				ChatService.blockUser(contact.id)
					.then(function(response){
						console.log(response);
						if (response.status) {
							contact.is_lock = response.is_lock 
							if (!response.is_lock) {													
								var index;
								for(var i = 0; i < $scope.Model.blockedUsers.length; i++){
									if ($scope.Model.blockedUsers[i].id === contact.id) {
										index = i;
									}
								}
								$scope.Model.blockedUsers.splice(index ,1);								
								$scope.Model.displayBlockedBlock = false;								
							} 						
						}                       
					},
					function(error){
						console.log(error);
					});
			};
			$scope.Model.deleteContact = function(contact){
				ChatService.deleteChatContact(contact.room_id[0].room_id, contact.id)
					.then(function(res){
						if (res.status) {
							$scope.Model.loadUserContactList();
							$scope.Model.displayContactBlock = false;
						}
						console.log(res);
					  }, function(err){
						console.log(err);
					  });
			};
			$scope.Model.openChatWith = function(opponent){                
				if ($state.current.name === 'chat.contacts') {
					$scope.Model.showContactBlock = false;
					if ($window.innerWidth <= 768) {
						$scope.Model.mobile = true;	
						$scope.Model.mobile.hideContent	= true;							
						$state.go('chat.mobile');
					} else {
						$state.go('chat.list');
					}
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

				socket.emit('create room', data);

				if ($window.innerWidth <= 768) {
					// console.log($window.innerWidth);					
					$scope.Model.mobile.hideContent	= true;								
					$state.go('chat.mobile');
				}


			};			
			socket.on("get user rooms", function(response){
				$scope.Model.chatRooms = response;
			});

			socket.on('switchRoom', function(newroom){
				socket.emit("switchRoom", newroom);
			});

			// $scope.Model.Chat = [];
			
			$scope.Model.sendMes = function(message, roomId){
				var data = {
					userId: $scope.loggedUserId,
					room_id: roomId,
					message: message
				}
				$scope.Model.chatMes = '';

				socket.emit('send message', data);

				var mesInFormat = {
					text: message,
					login: $scope.loggedUser
				}

				// $scope.Model.Chat.push(mesInFormat);			

			};	

			$scope.Model.scrollBottom = function(){
				setTimeout(function(){
					var chatWindow = angular.element(document.querySelector('.chat-right-chat-inner'));
					var height = chatWindow[0].scrollHeight;
					// $scope.$broadcast('rebuildScroll');
					chatWindow.scrollTop(height);
				}, 100);

			};
			socket.on('updatechat', function(data){				
				$scope.Model.Chat = data;
			});
			socket.on('send message', function(response){				
				$scope.Model.Chat = response;				
				// 	$scope.Model.Chat.push(response);				
			});

			$scope.Model.sendOnEnter = function(event, message, room_id){						
				if (event.keyCode == 10 && event.ctrlKey == true) {
					$scope.Model.sendMes(message, room_id);
				}
			};

			$scope.Model.getTime = function(time){
				return time.substr(11, 5);
			}

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
				$scope.Model.opponent = user;
				$scope.Model.displayBlockedBlock = true;
				$scope.Model.showBlockedBlock = true;				
				if ($window.innerWidth <= 768) {							
						$scope.Model.mobile.hideContent	= true;							
						$state.go('chat.mobile');
				}
				var data = {
					userIdFrom: $scope.loggedUserId,
					userIdTo: user.id,
					room_id: user.room_id
				};

				socket.emit('create room', data);
			}

			$scope.emojiMessage = {};
			$scope.$on('ngDialog.opened', function(e, $dialog){
				if($dialog.name === "group-chat"){
					window.emojiPicker = new EmojiPicker({
						emojiable_selector: '.create-group-chat-text',
						assetsPath: 'lib/img/',
						popupButtonClasses: 'fa fa-smile-o'
					});
					window.emojiPicker.discover();
					$(".emoji-button").text("");
				}
			});

			var newGroupChatPopup;

			$scope.Model.openGroupChatPopup = function(){
				$scope.Model.newGroupChat = {};
				$scope.Model.newGroupChat.users = [];
				$scope.Model.newGroupChat.name = '';
				$scope.Model.newGroupChat.status = '';
				$scope.Model.newGroupChat.avatar = '';
				newGroupChatPopup = ngDialog.open({
					template: '../app/Chat/views/popup-group-chat.html',
					className: 'popup-group-chat ngdialog-theme-default',
					scope: $scope,
					name: 'group-chat',
					// preCloseCallback: function(value){
					// 	$state.go("user", {username: $stateParams.username});
					// }
				});
			}

			$scope.Model.openSettings = function(user){
				$scope.Model.showNotificationBlock = true;
				$scope.Model.displayNotificationBlock = true;
				$scope.Model.opponent = user;
				console.log(user);
			};

			$scope.Model.cancelNewChat = function(){				
				newGroupChatPopup.close();
			};
			$scope.Model.createChat = function(name, status, avatar){
				// var textToSave = $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + status.messagetext;
				var users = [];				
				users.push(parseInt($scope.loggedUserId));				
				$scope.Model.newGroupChat.users.forEach(function(user){
					users.push(user.id);
				});
				// console.log(avatar);
				// console.log($scope.Model.newGroupChat);
				console.log(name, status, users, avatar);
			};
			$scope.Model.onItemSelected = function(user){				
				var repeated = undefined;
				for (var i = 0; i < $scope.Model.newGroupChat.users.length; i++) {
					if ($scope.Model.newGroupChat.users[i].id === user.id) {
						repeated = i;
						break;
					}					
				}
				if (repeated === undefined) {
					$scope.Model.newGroupChat.users.push(user);
				} else if(repeated!=0){
					var usr = $scope.Model.newGroupChat.users.splice(repeated, 1)[0];					
					$scope.Model.newGroupChat.users.unshift(usr);
				}								
			};

			$scope.Model.changeChatCoverFile = function (files, file, newFiles, duplicateFiles, invalidFiles, event) {
	            Upload.resize(file, 100, 100, 1, null, null, true).then(function (resizedFile) {
	                $scope.Model.newGroupChat.avatar = resizedFile;	                
	            });
	        };
			
			$scope.Model.removeUser = function(index){
				$scope.Model.newGroupChat.users.splice(index, 1);
			};

			$scope.saveNotificationSettings = function(user){
				console.log(user)
			};

			

	}]);