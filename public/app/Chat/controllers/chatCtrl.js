angular.module('placePeopleApp')
	.controller('chatCtrl', ['$scope', '$state', '$stateParams', 'StaticService', 'AuthService', 'UserService', 
		'$window', '$http', 'storageService', 'ngDialog', 'ChatService', '$rootScope', 'socket', 'amMoment',
		'PublicationService', 'Upload', '$q', '$timeout', '$location', '$anchorScroll',
		function($scope, $state, $stateParams, StaticService, AuthService, UserService, 
			$window, $http, storageService, ngDialog, ChatService, $rootScope, socket, amMoment, 
			PublicationService, Upload, $q, $timeout, $location, $anchorScroll){
			$scope.$emit('userPoint', 'user');
			amMoment.changeLocale('ru');
			var storage = storageService.getStorage();
			$scope.loggedUser = storage.username;
			$scope.showFileAddMenu = false;
			$scope.myCroppedImage = null;
			$scope.counter = 10;
			var editGroupChat = null;
			var leaveGroupPopup = null;
			$scope.loggedUserId = parseInt(storage.userId);
			$scope.notCodedmessage = false;
			$scope.Model = $scope.Model || {Name : "xxx"};
			$http.get('/static_page/get/name').success(function(response){
				$scope.staticPages = response;
			}).error(function(error){
				console.log(error);
			});
			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
				$scope.currentPath = $location.path();
			});
			$scope.Model.mobile = {};
			if($window.innerWidth <= 768){
				$scope.Model.mobile.display = true;								
			}else{
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

			if($state.current.name === "chat"){
				$state.go("chat.list");
			}

			$scope.refTo = function(stateName, opponent){
				$scope.Model.openSettings(opponent);
				if($window.innerWidth <= 768){
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
			};

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
					for(var i = 0; i < $scope.Model.chatRooms.length; i++){
						for(var j = 0; j < $scope.Model.chatRooms[i].members.length; j++){
							if (!$scope.Model.chatRooms[i].is_group) {
								if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id){
									roomId = $scope.Model.chatRooms[i].room_id;
								}
							}
						}
					}
				}
				ChatService.clearChat(roomId).then(function(response){
					if(response.status){
						ngDialog.closeAll();
						$scope.Model.Chat = [];
						socket.emit("get user rooms", $scope.loggedUserId);
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
				ChatService.deleteChat(roomId).then(function(response){
					if(response.status){
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
				ChatService.deleteChatContact(contact.room_id, contact.id).then(function(response){
					if(response.status){
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

			$scope.showFileAdd = function(){
				if($scope.showFileAddMenu){
					$scope.showFileAddMenu = false;
					$scope.hideFileAdd = undefined;
				}else{
					$scope.showFileAddMenu = true;
					setTimeout(function(){
						$scope.hideFileAdd = hideFileAdd;
					}, 0);
				}
			};
			var hideFileAdd = function(){
				if($scope.showFileAddMenu){
					$scope.showFileAddMenu = false;
					$scope.hideFileAdd = undefined;
				}
			}

			$scope.deleteChatFiles = function(files, index){
				files.splice(index, 1);
			};
			$scope.statusLoading = true;
			$scope.busyMessages = false;
			$scope.loadMoreMessages = function(roomId){
				$scope.isNeededScroll = function(){
					return false;
				}
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
				var members = [];
				members[0] = $scope.loggedUserId;
				var data = {
					room_id: roomId,
					offset: $scope.counter,
					limit: 10,
					members: members
				};
				var deferred = $q.defer();
				if($scope.Model.Chat !== undefined && $scope.Model.Chat.length !== 0 && $scope.busyMessages !== true && $scope.statusLoading){
					$scope.busyMessages = true;
					socket.emit("load more messages", data);
				}else{
					deferred.reject();
				}
				return deferred.promise;
			};

			socket.on("load more messages", function(response){
				if(response.messages.length === 0){
					$scope.statusLoading = false;
					$scope.counter = 0;
				}else{
					$scope.busyMessages = false;
					var itemsProcessed = 0;
					response.messages.forEach(function(value){
						$scope.Model.Chat.unshift(value);
						itemsProcessed++;
						if(itemsProcessed === response.messages.length) {
							setTimeout(function(){
								returnToBackCB(response.messages[0].id);
							}, 50);
      					}
					});
					$scope.counter += 10;
				}
			});

			function returnToBackCB(lastMessageId){
				$scope.returnToBack(lastMessageId);
			}

			function loadUserContacts(){
				PublicationService.getSubscribers($scope.loggedUserId).then(function(response){
					$scope.Model.subscribers = response;                        
				},
				function(error){
					console.log(error);
				});
				PublicationService.getSubscription($scope.loggedUserId).then(function(response){
					$scope.Model.subscriptions = response;
				},
				function(error){
					console.log(error);
				});
			}

			$scope.Model.loadUserContactList = function(){
				loadUserContacts();
			};

			$scope.setActive = function(member){
				$scope.activeMenu = member;
				$scope.member = member;
			};

			$scope.cancelLeaveGroupChat = function(){
				leaveGroupPopup.close();
			};

			$scope.saveNewAdmin = function(roomId, userId){
				if($scope.member !== undefined){
					ChatService.changeGroupChatAdmin(roomId, userId).then(function(response){
						if(response.status){
							leaveGroupPopup.close();
							socket.emit("get user rooms", $scope.loggedUserId);
							$scope.Model.opponent = [];
							$scope.Model.showChatBlock = false;
							$scope.Model.displayChatBlock = false;
							$scope.Model.displayBlockedBlock = true;
						}
					},
					function(error){
						console.log(error);
					});
				}
			};

			$scope.Model.leaveGroupChat = function(opponent){
				if(opponent.is_admin === 1){
					leaveGroupPopup = ngDialog.open({
						template: '../app/Chat/views/popup-leave-group-chat.html',
						className: 'popup-group-chat popup-leave-group-chat ngdialog-theme-default',
						scope: $scope,
						cache: false,
						data: {
							members: opponent.members,
							roomId: opponent.room_id
						}
					});
				}else{
					ChatService.exitUserFromGroupChat(opponent.room_id).then(function(response){
						if(response.status){
							$scope.Model.opponent = [];
							$scope.Model.showChatBlock = false;
							$scope.Model.displayChatBlock = false;
							$scope.Model.displayBlockedBlock = true;
							socket.emit("get user rooms", $scope.loggedUserId);
						}
					},
					function(error){
						console.log(error);
					});
				}
			}

			$scope.Model.showContactData = function(contact){
				if($state.current.name === 'chat.list'){
					$scope.Model.showChatBlock = false;
					$state.go('chat.contacts');
				}
				$scope.Model.showContactBlock = true;
				$scope.Model.displayContactBlock = true;
				$scope.Model.contact = contact;
				if($scope.Model.contact.status !== undefined){
					$scope.Model.contact.status = $scope.Model.contact.status.split(' messagetext: ')[1];
				}
				if($window.innerWidth <= 768){
					$scope.Model.mobile.hideContent	= true;							
					$state.go('chat.contact-mobile');
				}
			};
			function blockContact(contact){
				ChatService.blockUser(contact.id).then(function(response){
					if(response.status){
						ngDialog.closeAll();
						contact.is_lock = response.is_lock 
						if(!response.is_lock){
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
			$scope.Model.openChatWith = function(chat, index){
				$scope.currentRoomId = chat.room_id;
				if($scope.files !== undefined){
					$scope.files.length = 0;
				}
				$scope.statusLoading = true;
				$scope.busyMessages = false;
				$scope.counter = 10;
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
				if(chat.is_group){
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
				}else{
					if(chat.members){
						$scope.Model.opponent = chat.members[0];
						members.push(chat.members[0].id);
					}else{
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
				$scope.Model.opponent.room_id = chat.room_id;
				$scope.Model.showChatBlock = true; 
				$scope.Model.displayChatBlock = true;
				$scope.Model.displayBlockedBlock = false;
				if(chat.room_id === false){
					$scope.Model.Chat = [];
				}
				socket.emit('create room', data);
				$rootScope.countChatMessages--;
				if($window.innerWidth <= 768){
					$scope.Model.mobile.hideContent	= true;								
					$state.go('chat.mobile');
				}
				$rootScope.currentChat = chat;
			};
			
			if($stateParams.fromMobile && $rootScope.currentChat !== undefined){
				$scope.Model.openChatWith($rootScope.currentChat);
			}
			socket.on("get user rooms", function(response){
				var lastDialogue = response[response.length - 1];
				if(lastDialogue !== undefined){
					if(lastDialogue.is_group && lastDialogue.isNew){
						$scope.currentRoomId = lastDialogue.room_id;
						$scope.Model.opponent = lastDialogue;
						$scope.Model.Chat = [];
						$scope.Model.showChatBlock = true;
						$scope.Model.displayChatBlock = true;
						$scope.Model.displayBlockedBlock = false;
					}
				}
				$scope.Model.chatRooms = response;
			});

			function checkURL(url){
				return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
			}
			$scope.messageVideos = [];
			$scope.Model.sendMes = function(message, roomId, files){
				$scope.disabledSendMessage = true;
				if(files !== undefined){
					var imagesObj = {
						imageName: [],
						imageType: [],
						images: []
					};
					files.forEach(function(value){
						if(checkURL(value.name)){
							imagesObj.imageName.push(value.name);
							imagesObj.imageType.push(value.type);
							imagesObj.images.push(value);
						}else{
							$scope.sendMessageLoader = true;
							$scope.messageVideos.push(value);
						}
					});
				}
				if(!roomId){
					for (var i = 0; i < $scope.Model.chatRooms.length; i++) {
						for (var j = 0; j < $scope.Model.chatRooms[i].members.length; j++) {
							if (!$scope.Model.chatRooms[i].is_group){
								if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id) {								
									roomId = $scope.Model.chatRooms[i].room_id;
								}
							}
						}
					}
				}
				var data = {
					userId: $scope.loggedUserId,
					room_id: roomId ? roomId : $scope.Model.opponent.room_id,
					message: message ? message : "",
					imagesObj: imagesObj !== "" ? imagesObj : undefined
				};
				$scope.Model.chatMes = '';
				socket.emit('send message', data, function(){
					if(files){
						files.length = 0;
					}
					$scope.emojiMessage.rawhtml = "";
					data.message = "";
					imagesObj = {
						imageName: [],
						imageType: [],
						images: []
					};
					if(data.message === "" && $scope.emojiMessage.rawhtml === ""){
						setTimeout(function(){
							$scope.disabledSendMessage = false;
						}, 200);
					}
				});
			};

			$scope.changeMainFile = function(file, flag, pub){
				if(flag){
					if(file.video_url){
						ChatService.getVideo(file.id).then(function(response){
							if(response.status && response.is_coded){
								$scope.mainImageInPopup = null;
								$scope.mainVideoInPopup = file.video_url;
								$scope.notCodedmessage = false;
							}else{
								$scope.mainVideoInPopup = null;
								$scope.mainImageInPopup = null;
								$scope.notCodedmessage = true;
							}
						},
						function(error){
							console.log(error);
						});
					}else{
						$scope.notCodedmessage = false;
						$scope.mainVideoInPopup = null;
						$scope.mainImageInPopup = file.url;
					}
				}else{
					$scope.mainVideo = "";
					$scope.mainImage = file.url;
				}
				if(flag === 'list'){
					pub.mainFile = file;
				}
			};

			$scope.showPopupWithFiles = function(files){
				if(files[0].video_url){
					ChatService.getVideo(files[0].id).then(function(response){
						if(response.status && response.is_coded){
							$scope.mainImageInPopup = null;
							$scope.mainVideoInPopup = files[0].video_url;
							$scope.notCodedmessage = false;
						}else{
							$scope.mainImageInPopup = null;
							$scope.mainVideoInPopup = null;
							$scope.notCodedmessage = true;
						}
					},
					function(error){
						console.log(error);
					});
				}else{
					$scope.notCodedmessage = false;
					$scope.mainVideoInPopup = null;
					$scope.mainImageInPopup = files[0].url;
				}
				$scope.imagesInPopup = files;
				angular.element(document.querySelector('.view-publication')).addClass('posFixedPopup');
				ngDialog.open({
					template: '../app/User/views/popup-comment-images.html',
					className: 'popup-comment-images ngdialog-theme-default',
					scope: $scope,
					data: {
						files: files
					},
					preCloseCallback: function (value) {
						angular.element(document.querySelector('.view-publication')).removeClass('posFixedPopup');
					}
				});
			};

			$scope.isSelected = function (roomId) {
				return roomId === $scope.currentRoomId;
			};
			$scope.returnToBack = function(messageId){
				$location.hash(messageId + "");
			}
			socket.on("done message", function(data){
				if(data.doneMessage){
					if($scope.Model.Chat !== undefined){
						$scope.Model.Chat.forEach(function(value){
							if(value.isRead === "no-done"){
								value.isRead = "done";
							}
						});
					}
				}
			});
			socket.forward('updatechat', $scope);
			$scope.$on('socket:updatechat', function(event, data){
				if($scope.Model.opponent !== undefined && !$scope.Model.opponent.room_id){
					$scope.Model.opponent.room_id = data.roomId;
				}
				if(data.messages){
					$scope.getMessagesCount = function(chat){
						if(chat.room_id === data.room_id){
							return chat.countMessages = 0;
						}
					};
					$scope.Model.Chat = data.messages.reverse();
					$scope.isNeededScroll = function(){
						return $scope.Model.Chat;
					}
				}else if(data.isRead){
					if($scope.Model.opponent !== undefined && $scope.Model.opponent.room_id === data.roomId && data.userId !== $scope.loggedUserId){
						$scope.Model.Chat.forEach(function(value){
							value.isRead = 'read';
						});
					}
				}else{
					if($scope.Model.opponent !== undefined && $scope.Model.opponent.room_id === data.roomId || $scope.Model.opponent !== undefined && $scope.Model.opponent.id === $scope.loggedUserId){
						if($scope.messageVideos.length > 0){
							ChatService.sendVideos(data.id, $scope.messageVideos).then(function(response){
								$scope.messageVideos = [];
								if(response.data.status){
									$scope.sendMessageLoader = false;
									data.videos = [];
									Object.keys(response.data).forEach(function(value){
										if(response.data[value] !== true){
											data.videos.push(response.data[value]);
										}
									});
									if(data.login === $scope.loggedUser){
										data.isRead = 'no-done';
									}else{
										$scope.Model.Chat.forEach(function(value){
											value.isRead = 'read';
										});
									}
									$scope.Model.Chat.push(data);
									$scope.isNeededScroll = function(){
										return $scope.Model.Chat;
									}
								}
							},
							function(error){
								console.log(error);
							});
						}else{
							data.videos = [];
							if(data.login === $scope.loggedUser){
								data.isRead = 'no-done';
							}else{
								$scope.Model.Chat.forEach(function(value){
									value.isRead = 'read';
								});
							}
							var readMessages = {
								members: []
							};
							readMessages.members[0] = $scope.loggedUserId;
							readMessages.room_id = data.roomId;
							socket.emit("read message", readMessages);
							$scope.Model.Chat.push(data);
							$scope.isNeededScroll = function(){
								return $scope.Model.Chat;
							}
						}
					}else{
						socket.emit("get user rooms", $scope.loggedUserId);
						// $scope.getLastMessage = function(chat){
						// 	if(chat.room_id === data.roomId){
						// 		return chat.last_message = data.text;
						// 	}
						// };
						// $scope.getLastMessageCreatedAt = function(chat){
						// 	if(chat.room_id === data.roomId){
						// 		return chat.last_message_created_at = data.created_at;
						// 	}
						// };
						// $scope.getMessagesCount = function(chat){
						// 	if(chat.room_id === data.roomId){
						// 		return chat.countMessages = 1;
						// 	}
						// };
					}
				}
			});

			$scope.Model.getLockedUsers = function(){
				ChatService.getLockedUsers().then(function(response){	
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
				if($window.innerWidth <= 768){							
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
			};

			$scope.emojiMessage = {
				replyToUser: function(){
					if(!$scope.disabledSendMessage && $scope.currentPath !== "/chat/blocked"){
						$scope.Model.sendMes($scope.emojiMessage.messagetext, undefined, $scope.files);
					}
				}
			};
			$scope.beforeChange = function(files){
				$scope.files = files;
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
					preCloseCallback: function(){
						$scope.showErrorMessageAvatar = false;
						$scope.showErrorMessage = false;
					}
					// preCloseCallback: function(value){
					// 	$state.go("user", {username: $stateParams.username});
					// }
				});
			};
			$scope.$on('ngDialog.opened', function(e, $dialog){
				if($dialog.name === "edit-group-chat" && $scope.currentOpponent.status !== undefined){
					$(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML = $scope.currentOpponent.status.split(' messagetext: ')[0];
				}
			});

			$scope.showPublication = function(publication){
				getSinglePublication(publication);
			};

			$scope.limit = 6;

			$scope.loadMorePubFiles = function (key, flag, pub) {
				if (flag === 'list') {
					if (key === false) {
						$scope.limit = pub.images.length + pub.videos.length;
					} else {
						$scope.limit = 7;
					}
					// pub.morePubFiles = true;
					$scope.$broadcast('loadPubFiles');
				} else {
					if (key === false) {
						$scope.limit = $scope.singlePublication.images.length + $scope.singlePublication.videos.length;
					} else {
						$scope.limit = 7;
					}
					$scope.morePubFiles = true;
					$scope.$broadcast('loadPubFiles');
				}
			};

			function getSinglePublication(publication, flag) {
				PublicationService.getSinglePublication(publication.id).then(function (response) {
					//getAllCommentsPublication(pubId);
					$scope.limit = 6;
					$scope.singlePublication = response;
					if(response.images[0] !== undefined){
						$scope.mainImage = response.images[0].url;
					}
					if($window.innerWidth <= 700){
						$state.go('mobile-pub-view', {username: $scope.loggedUser, id: publication.id, fromChat: true});
					}else{
						ngDialog.open({
							template: '../app/common/views/pub-item-modal.html',
							className: 'view-publication ngdialog-theme-default',
							scope: $scope,
							name: "view-publication",
							data: {
								pub: publication
							}
						});
					}
				},
				function(error){
					console.log(error);
				});
			}

			$scope.getAllCommentsPublication = function (flag, pub, showAllComments) {
				getAllCommentsPublication(flag, pub, showAllComments);
			}
			function getAllCommentsPublication(flag, pub, showAllComments) {
				PublicationService.getAllCommentsPublication(pub.id).then(function (response) {
					if(showAllComments === true){
						if (flag === "userPage") {
							pub.comments = response;
						} else {
							$scope.singlePublication.comments = response;
						}
					}
					$scope.lengthAllComments = response.length;
				},
				function (error) {
					console.log(error);
				});
			}

			$scope.addNewComment = function (flag, pub, pubText, files) {
				$scope.disableAddComment = true;
				var images = [];
				var videos = [];
				if (files != undefined) {
					files.forEach(function (file) {
						var type = file.type.split('/')[0];
						if (type === 'image') {
							images.push(file);
						} else if (type === 'video') {
							videos.push(file);
						}
					});
				}
				PublicationService.addCommentPublication(pub.id, pubText.messagetext, images, videos).then(function (response) {
						$scope.showAddComment = false;
						$scope.disableAddComment = false;
						if (response.data.status) {
							$(".emoji-wysiwyg-editor").html("");
							pub.files = [];
							if (flag === "userPage") {
								pub.comments.push(response.data.comment);
								pub.comment_count++;
							} else {
								$scope.singlePublication.comments.push(response.data.comment);
								$scope.singlePublication.comment_count++;
							}

						}
					},
					function (error) {
						console.log(error);
					});
			}

			$scope.addCommentLike = function(comment){
				PublicationService.addCommentLike(comment.id).then(function(response){
					comment.like_count = response.like_count;
				},
				function(error){
					console.log(error);
				});
			};

			$scope.Model.editGroupChat = function(opponent){
				$scope.currentOpponent = opponent;
				$scope.Model.newGroupChat = {};
				$scope.Model.newGroupChat.users = opponent.members;
				$scope.Model.newGroupChat.name = opponent.name;
				$scope.Model.newGroupChat.avatar = opponent.avatar;
				editGroupChat = ngDialog.open({
					template: '../app/Chat/views/popup-edit-group-chat.html',
					className: 'popup-group-chat ngdialog-theme-default',
					scope: $scope,
					name: 'edit-group-chat',
				});
			};

			$scope.Model.saveGroupChat = function(name, status, avatar, users){
				var statusToSave = $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + status.messagetext;
				var usersInChat = [];
				usersInChat.push(parseInt($scope.loggedUserId));				
				users.forEach(function(user){
					usersInChat.push(user.id);
				});
				ChatService.updateGroupChat($scope.currentOpponent.room_id, name, statusToSave, avatar, usersInChat).then(function(response){						
					if(response.data.status){
						$scope.showErrorMessage = false;
						$scope.Model.opponent.name = name;
						$scope.currentOpponent.status = statusToSave;
						if(typeof avatar === "object"){
							var reader = new window.FileReader();
							reader.readAsDataURL(avatar); 
							reader.onloadend = function(){
								$scope.Model.opponent.avatar = reader.result;
							}
						}
						socket.emit("get user rooms", $scope.loggedUserId);
						ngDialog.closeAll();
					}
				},
				function(error){
					console.log(error);
				});
			};

			$scope.Model.openSettings = function(user){
				$scope.Model.showNotificationBlock = true;
				$scope.Model.displayNotificationBlock = true;
				$scope.Model.opponent = user;
			};

			$scope.Model.cancelNewChat = function(){				
				newGroupChatPopup.close();
			};

			$scope.Model.cancelEditGroupChat = function(){
				editGroupChat.close();
			};

			$scope.Model.createGroupChat = function(name, status){
				var statusToSave = $(".ngdialog .emoji-wysiwyg-editor")[0].innerHTML + ' messagetext: ' + status.messagetext;
				var users = [];
				users.push(parseInt($scope.loggedUserId));
				if($scope.Model.newGroupChat.users.length === 0){
					$scope.showErrorMessage = true;
					$scope.showErrorMessageAvatar = false;
					return;
				}else{
					$scope.Model.newGroupChat.users.forEach(function(user){
						users.push(user.id);
					});
					if($scope.avatarGroupChat === undefined){
						$scope.showErrorMessageAvatar = true;
						$scope.showErrorMessage = false;
						return;
					}
					var avatarObj = {
						avatarName: $scope.avatarGroupChat.name,
						avatarType: $scope.avatarGroupChat.type,
						avatar: $scope.avatarGroupChat
					};
					var data = {
						is_group: true,
						name: name,
						status: statusToSave,
						avatarObj: avatarObj,
						members: users,
						offset: 0,
						limit: 10
					};
					socket.emit('create room', data);
					newGroupChatPopup.close();
					$scope.showErrorMessage = false;
					$scope.Model.displayChatBlock = false;
					$scope.Model.displayContactBlock = false;
					$scope.Model.displayNotificationBlock = false;
					$state.go('chat.list');
				}
			};

			$scope.Model.onItemSelected = function(user){
				var repeated = undefined;
				for(var i = 0; i < $scope.Model.newGroupChat.users.length; i++){
					if($scope.Model.newGroupChat.users[i].id === user.id){
						repeated = i;
						break;
					}					
				}
				if(repeated === undefined){
					$scope.Model.newGroupChat.users.push(user);
				}else if(repeated != 0){
					var usr = $scope.Model.newGroupChat.users.splice(repeated, 1)[0];					
					$scope.Model.newGroupChat.users.unshift(usr);
				}								
			};

			$scope.Model.cropImageGroupChat = function(file){
				if(file){
					var reader = new FileReader();
					reader.onload = function(e){
						$scope.$apply(function($scope){
							$scope.myImage = e.target.result;
							modalCropImage = ngDialog.open({
								template: '../app/Chat/views/popup-crop-image-group-chat.html',
								className: 'settings-add-ava ngdialog-theme-default',
								scope: $scope,
								data: {
									fileName: file.name
								}
							});
						});
					};
					reader.readAsDataURL(file);
				}
				// Upload.resize(file, 100, 100, 1, null, null, true).then(function (resizedFile) {
				// 	$scope.Model.newGroupChat.avatar = resizedFile;	                
				// });
			};

			$scope.saveCropp = function(myCroppedImage, fileName){
				$scope.showErrorMessageAvatar = false;
				$scope.Model.newGroupChat.avatar = myCroppedImage;
				var blobFile = blobToFile(myCroppedImage);
				blobFile.name = fileName;
				blobFile.lastModifiedDate = new Date();
				$scope.avatarGroupChat = blobFile;
				modalCropImage.close();
			};

			function blobToFile(dataURI){
				var byteString = atob(dataURI.split(',')[1]);
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ab], {type: 'image/jpeg', name: 'fewfewfewfe'});
			}
			
			$scope.Model.removeUser = function(index){
				if($scope.Model.newGroupChat.users.length !== 1){
					$scope.Model.newGroupChat.users.splice(index, 1);
				}else{
					$scope.showErrorMessage = true;
				}
			};

			$scope.Model.saveNotificationSettings = function(){
				var roomId = null;
				for(var i = 0; i < $scope.Model.chatRooms.length; i++){
					for(var j = 0; j < $scope.Model.chatRooms[i].members.length; j++){
						if (!$scope.Model.chatRooms[i].is_group) {
							if ($scope.Model.chatRooms[i].members[j].id === $scope.Model.opponent.id){
								roomId = $scope.Model.chatRooms[i].room_id;
							}
						}
					}
				}
				ChatService.setNotification(roomId).then(function(response){
					
				},
				function(error){
					console.log(error);
				});
			};
			$scope.checkMessageType = function(message){
				var regExp = "^" + $location.protocol() + "://" + $location.host();
				var match = (new RegExp(regExp)).exec(message.text);
				if(match){
					var publicationUrl = match.input.split("/publication/");
					if(publicationUrl[1]){
						message.pub = {};
						message.type = 'pub';
						message.pub.username = message.login;
						message.pub.id = parseInt(publicationUrl[1]);
					}
				}
			};

			$scope.loadPubIntoChat = function(message, pubId){
				if(pubId != undefined){
					PublicationService.getSinglePublication(pubId).then(function(response){
						message.pub = response;
						message.pub.files = response.images.concat(response.videos);
					},
					function(error){
						console.log(error);
					});
				}
			};

			$scope.getPubText = function(text){
				if(text != undefined){
					var mes = text.split(' messagetext: ');
					return mes[1];
				}			
			};

			$scope.Model.addPublicationLike = function(pub){
				pub.user_like = !pub.user_like ;
				pub.like_count = pub.user_like ? ++pub.like_count : --pub.like_count;
				PublicationService.addPublicationLike(pub.id).then(function(response){
					pub.user_like = response.user_like;
					pub.like_count = response.like_count;
				},
				function(error){
					console.log(error);
				});
			};

			$scope.addPublicationLike = function(pub, isCurrentUser){
				pub.user_like = !pub.user_like ;
				pub.like_count = pub.user_like ? ++pub.like_count : --pub.like_count;
				PublicationService.addPublicationLike(pub.id).then(function(response){
					pub.user_like = response.user_like;
					pub.like_count = response.like_count;
				},
				function(error){
					console.log(error);
				});
			}
	}]);