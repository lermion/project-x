angular.module('placePeopleApp')
	.controller('chatCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
		'$window', '$http', 'storageService', 'ngDialog', 'ChatService', '$rootScope', 'socket', 'amMoment',
		'PublicationService', 'Upload', '$q', '$timeout',
		function ($scope, $state, $stateParams, StaticService, AuthService, UserService, 
			$window, $http, storageService, ngDialog, ChatService, $rootScope, socket, amMoment, 
			PublicationService, Upload, $q, $timeout) {
			$scope.$emit('userPoint', 'user');
			amMoment.changeLocale('ru');
			var storage = storageService.getStorage();
			$scope.loggedUser = storage.username;
			$scope.status = {
				loading: false,
				loaded: false
			};
			$scope.counter = 0;
			$scope.loggedUserId = parseInt(storage.userId);
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
					}, function (error) {
						console.log(error);
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
			$scope.abortConfirmation = function(){
				ngDialog.closeAll();
			}

			$scope.Model.clearChat = function(roomId){
				ngDialog.open({
					template: '../app/Chat/views/confirmation-popup.html',
					className: 'confirmation-popup ngdialog-theme-default',
					scope: $scope,
					data: {
						text: "Вы уверены, что хотите очистить чат?",
						type: "clearChat",
						data: roomId
					}
				});
			};
			function clearChat(roomId){
				if(!roomId){
					for (var i = 0; i < $scope.Model.chatRooms.length; i++) {
						for (var j = 0; j < $scope.Model.chatRooms[i].members.length; j++) {
							if (!$scope.Model.chatRooms[i].is_group) {
								if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id) {								
									roomId = $scope.Model.chatRooms[i].room_id;
								}
							}
						}
					}
				}
				ChatService.clearChat(roomId).then(function(res){
					if(res.status){
						ngDialog.closeAll();
						$scope.Model.Chat = [];
					}						
				},
				function(error){
					console.log(error);
				});
			}
			function deleteChat(roomId){
				if(!roomId){
					for (var i = 0; i < $scope.Model.chatRooms.length; i++) {
						for (var j = 0; j < $scope.Model.chatRooms[i].members.length; j++) {
							if (!$scope.Model.chatRooms[i].is_group) {
								if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id) {								
									roomId = $scope.Model.chatRooms[i].room_id;
								}
							}
						}
					}
				}
				ChatService.deleteChat(roomId).then(function(res){
					if(res.status){
						ngDialog.closeAll();
						$scope.Model.displayChatBlock = false;
						$scope.Model.reloadRooms();
					}
				},
				function(error){
					console.log(error);
				});
			}
			$scope.acceptConfirmation = function(type, data){
				if(type === "clearChat"){
					clearChat(data);
				}else if(type === "deleteChat"){
					deleteChat(data);
				}else if(type === "blockContact"){
					blockContact(data);
				}else if(type === "deleteContact"){
					deleteContact(data);
				}
			};
			function deleteContact(contact){
				ChatService.deleteChatContact(contact.room_id, contact.id).then(function(res){
					if(res.status){
						ngDialog.closeAll();
						$scope.Model.loadUserContactList();
						$scope.Model.displayContactBlock = false;
					}
				},
				function(error){
					console.log(error);
				});
			}
			$scope.Model.deleteChat = function(roomId){
				ngDialog.open({
					template: '../app/Chat/views/confirmation-popup.html',
					className: 'confirmation-popup ngdialog-theme-default',
					scope: $scope,
					data: {
						text: "Вы уверены, что хотите удалить чат?",
						type: "deleteChat",
						data: roomId
					}
				});
			};

			$scope.deleteChatFiles = function(files, index){
				files.splice(index, 1);
			}
			$scope.loadMoreMessages = function(roomId){
				if(!roomId){
					for (var i = 0; i < $scope.Model.chatRooms.length; i++) {
						for (var j = 0; j < $scope.Model.chatRooms[i].members.length; j++) {
							if (!$scope.Model.chatRooms[i].is_group) {
								if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id) {								
									roomId = $scope.Model.chatRooms[i].room_id;
								}
							}
						}
					}
				}
				var data = {
					room_id: roomId,
					offset: $scope.counter,
					limit: 10
				};
				var deferred = $q.defer();
				if(!$scope.status.loading && $scope.Model.Chat !== undefined && $scope.Model.Chat.length >= 10){
					socket.emit("load more messages", data);
				}else{
					deferred.reject();
				}
				return deferred.promise;
			};

			socket.on("load more messages", function(response){
				if(response.length === 0){
					$scope.status.loading = true;
					$scope.counter = 0;
				}else{
					response.messages.forEach(function(value){
						$scope.Model.Chat.unshift(value);
					});
					$scope.counter += 10;
				}
			});

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
			function blockContact(contact){
				ChatService.blockUser(contact.id).then(function(response){
					if(response.status){
						ngDialog.closeAll();
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
			}
			$scope.Model.blockContact = function(contact, isLock){
				ngDialog.open({
					template: '../app/Chat/views/confirmation-popup.html',
					className: 'confirmation-popup ngdialog-theme-default',
					scope: $scope,
					data: {
						text: isLock ? "Вы уверены, что хотите разблокировать контакт?" : "Вы уверены, что хотите заблокировать контакт?",
						type: "blockContact",
						data: contact
					}
				});
			};
			$scope.Model.deleteContact = function(contact){
				ngDialog.open({
					template: '../app/Chat/views/confirmation-popup.html',
					className: 'confirmation-popup ngdialog-theme-default',
					scope: $scope,
					data: {
						text: "Вы уверены, что хотите удалить контакт?",
						type: "deleteContact",
						data: contact
					}
				});
			};
			$scope.Model.openChatWith = function(chat){
				$scope.status.loading = false;
				$scope.counter = 0;
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

				var data = {};
				var members = [];
				members.push($scope.loggedUserId);
				if (chat.is_group) {
					$scope.Model.opponent = chat;
					chat.members.forEach(function(member){
						members.push(member.id);
					});					
					data = {					
						members: members, 
						room_id: chat.room_id,
						is_group: true,
						offset: 0,
						limit: 10
					};
				} else {
					if (chat.members) {
						$scope.Model.opponent = chat.members[0];
						members.push(chat.members[0].id);
					} else {
						$scope.Model.opponent = chat;
						members.push(chat.id);
					}					
					data = {					
						members: members, 
						room_id: chat.room_id,
						is_group: false,
						offset: 0,
						limit: 10
					};
				}
				 
				$scope.Model.showChatBlock = true; 
				$scope.Model.displayChatBlock = true;
				$scope.Model.displayBlockedBlock = false;

				if (chat.room_id === false) {
					$scope.Model.Chat = [];
				}
				
				socket.emit('create room', data);

				if ($window.innerWidth <= 768) {					
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
			
			$scope.Model.sendMes = function(message, roomId, files){
				var imagesObj = {
					imageName: [],
					imageType: [],
					images: files
				};
				files.forEach(function(value){
					imagesObj.imageName.push(value.name);
					imagesObj.imageType.push(value.type);
				});
				if(!roomId){
					for (var i = 0; i < $scope.Model.chatRooms.length; i++) {
						for (var j = 0; j < $scope.Model.chatRooms[i].members.length; j++) {
							if (!$scope.Model.chatRooms[i].is_group) {
								if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id) {								
									roomId = $scope.Model.chatRooms[i].room_id;
								}
							}
						}
					}
				}
				var data = {
					userId: $scope.loggedUserId,
					room_id: roomId,
					message: message,
					imagesObj: imagesObj
				}				
				$scope.Model.chatMes = '';
				socket.emit('send message', data);
				$scope.emojiMessage.rawhtml = "";
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
				socket.emit("get user rooms", $scope.loggedUserId);
				if(data.messages){
					$scope.Model.Chat = data.messages;
				}else{
					$scope.Model.Chat.push(data);
				}
			});
			$scope.Model.sendOnEnter = function(event, message, room_id){
				if(event.keyCode == 13){
					event.preventDefault();
					if (!$scope.Model.displayBlockedBlock) {					
						$scope.Model.sendMes(message, room_id);					
					}
				}			
			};

			$scope.Model.getLockedUsers = function(){
				ChatService.getLockedUsers()
					.then(function(response){	
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
				var members = [];
				members.push($scope.loggedUserId);
				members.push(user.id);
				var data = {					
					members: members,
					room_id: user.room_id,
					is_group: false,
					offset: 0,
					limit: 10
				};
				socket.emit('create room', data);
			}

			$scope.emojiMessage = {
				replyToUser: function(){
					console.log("it will be added in the future");
				}
			};
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
			};

			$scope.Model.cancelNewChat = function(){				
				newGroupChatPopup.close();
			};
			$scope.Model.createGroupChat = function(name, status, avatar){
				var statusToSave = $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + status.messagetext;
				var users = [];				
				users.push(parseInt($scope.loggedUserId));				
				$scope.Model.newGroupChat.users.forEach(function(user){
					users.push(user.id);
				});				
				var data = {
					is_group: true,
					name: name,
					status: statusToSave,
					avatar: avatar,
					members: users,
					offset: 0,
					limit: 10
				};				
				socket.emit('create room', data);
				newGroupChatPopup.close();
				$scope.Model.displayChatBlock = false;
				$scope.Model.displayContactBlock = false;
				$scope.Model.displayNotificationBlock = false;
				$state.go('chat.list');				
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

			$scope.Model.saveNotificationSettings = function(chat){			
				ChatService.setNotification(chat.room_id)
					.then(function(response){						
						
					},
					function(error){
						console.log(error);
					});				
			};

			$scope.checkMessageType = function(message){						
				var regExp = /^http:\/\/pp.dev\/#\/(\w+)\/pub(lication)?\/(\d+)$/;
				var match = regExp.exec(message.text);
				if (match) {
					message.type = 'pub';
					message.pub = {};
					message.pub.username = match[1];					
					message.pub.id = parseInt(match[3]);
				}			
			};

			$scope.loadPubIntoChat = function(message, pubId){				
				if (pubId != undefined) {
					PublicationService.getSinglePublication(pubId)
					.then(function(response){						
							message.pub = response;
						},
						function(error){
							console.log(error);
						});
				}
			};

			$scope.getPubText = function(text){				
				if (text != undefined) {
					var mes = text.split(' messagetext: ');
					return mes[1];
				}			
			};

			$scope.Model.addPublicationLike = function(pub){
				PublicationService.addPublicationLike(pub.id)
					.then(function(response){
						pub.user_like = response.user_like;
						pub.like_count = response.like_count;
					},
					function(error){
						console.log(error);
					});
			};

			

	}]);