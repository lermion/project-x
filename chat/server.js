var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var striptags = require('striptags');
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);
var Queries = require('./queries');
var queries = new Queries();
var users = {};
var usersId = {};
var currentRoom = null;
GLOBAL.rooms = [];
GLOBAL.ABSPATH = __dirname;
server.listen(config.port);
io.sockets.on('connection', function(socket){
	socket.on('create room', function(data, callback){
		queries.createRoom(data).then(function(response){
			data.created_at = new Date();
			data.updated_at = new Date();
			if(response.length >= 1){
				if(data.share){
					callback(response[0]);
				}else{
					var result = {
						roomId: data.room_id,
						userId: data.members[0],
						isRead: {
							isReadMessage: true
						}
					};
					io.sockets.in(data.room_id).emit('updatechat', result);
					queries.changeRoom(data, currentRoom).then(function(response){
						queries.getUserDialogue(data).then(function(response){
							socket.emit('updatechat', response);
						},
						function(error){
							console.log(error);
						});
					},
					function(error){
						console.log(error);
					});
				}
			}else{
				queries.getUsers(data).then(function(response){
					users.userNameFrom = response[0].first_name;
					users.userNameTo = response[1].first_name;
					if(data.name === undefined){
						data.name = response[1].first_name;
					}
					if(data.status === undefined){
						data.status = "";
					}
					if(data.avatarObj === undefined){
						data.avatar = "";
					}else if(data.avatarObj.avatar === ""){
						data.avatar = "/upload/preview-chat-no-avatar.png";
					}else{
						fs.writeFile(GLOBAL.ABSPATH + "/../public/upload/" + data.avatarObj.avatarName, data.avatarObj.avatar, function(error){
							if(error){
								console.log(error);
								return;
							}else{
								console.log('group avatar saved in folder upload');
							}
						});
						data.avatar = "/upload/" + data.avatarObj.avatarName;
					}
					var setUsers  = {
						name: data.name,
						is_group: data.is_group,
						created_at: new Date(),
						updated_at: new Date(),
						status: data.status,
						avatar: data.avatar
					};
					queries.addUsersInChatRoom(setUsers).then(function(response){
						var roomId = response.insertId;
						var roomInfo = {
							room_id: roomId,
							created_at: new Date(),
							updated_at: new Date(),
							members: data.members
						};
						queries.addUsersInUserChat(roomInfo).then(function(response){
							
						},
						function(error){
							console.log(error);
						});
						queries.getUserRooms(data).then(function(response){
							var shareResponse = response.filter(function( obj ) {
    							return obj.is_group !== 1;
    							callback(shareResponse);
							});
							var roomsArray = [];
							response.forEach(function(value){
								roomsArray.push(value.room_id);
								GLOBAL.rooms = roomsArray;
								socket.room = GLOBAL.rooms;
								socket.join(value.room_id);
							});
							response[response.length - 1].isNew = true;
							//var socketId = usersId[response[0].id];
							//io.sockets.connected[socketId].emit("get user rooms", response);
							console.log("gegewgege!!!");
							socket.emit("get user rooms", response);
						},
						function(error){
							console.log(error);
						});
					},
					function(error){
						console.log(error);
					});
				},
				function(error){
					console.log(error);
				});
			}
		},
		function(error){
			console.log(error);
		});
		currentRoom = data.room_id;
	});
	socket.on('get user rooms', function(data){
		userId = {};
		userId.socketId = socket.id;
		usersId[data] = userId.socketId;
		var data = {
			"userIdFrom": data
		};
		queries.getUserRooms(data).then(function(response){
			var roomsArray = [];
			response.forEach(function(value){
				roomsArray.push(value.room_id);
				GLOBAL.rooms = roomsArray;
				socket.room = GLOBAL.rooms;
				socket.join(value.room_id);
			});
			socket.emit("get user rooms", response);
		},
		function(error){
			console.log(error);
		});
	});
	socket.on("get group chat dialogue", function(data){
		socket.room = data.room_id;
		socket.join(data.room_id);
		queries.getGroupChatDialogue(data).then(function(response){
			socket.emit("get group chat dialogue", response);
		},
		function(error){
			console.log(error);
		});
	});
	socket.on("connection to chat", function(data){
		var result = {
			roomId: data.room_id,
			userId: data.userId,
			isRead: {
				isReadMessage: true
			}
		};
		io.sockets.in(data.room_id).emit('updatechat', result);
	});
	socket.on('send message', function(data, callback){
		data.message = striptags(data.message);
		if(data.imagesObj !== undefined){
			var imagesPath = [];
			for(var i = 0; i < data.imagesObj.images.length; i++){
				imagesPath.push("/upload/" + data.imagesObj.imageName[i]);
				fs.writeFile(GLOBAL.ABSPATH + "/../public/upload/" + data.imagesObj.imageName[i], data.imagesObj.images[i], function(error){
					if(error){
						console.log(error);
						return;
					}else{
						console.log('Files saved in folder upload');
					}
				});
			}
		}
		queries.sendMessage(data).then(function(response){
			if(imagesPath !== undefined && imagesPath.length >= 1){
				queries.saveFiles(imagesPath, response.insertId).then(function(response){
					queries.getLastMessage(data).then(function(response){
						io.sockets.in(data.room_id).emit('updatechat', response);
						callback();
					},
					function(error){
						console.log(error);
					});
				},
				function(error){
					console.log(error);
				});
			}else{
				queries.getLastMessage(data).then(function(response){
					if(socket.room === undefined){
						socket.room = [];
						socket.room[0] = data.room_id;
						socket.join(data.room_id);
					}
					io.sockets.in(data.room_id).emit('updatechat', response);
					callback();
				},
				function(error){
					console.log(error);
				});
			}
		},
		function(error){
			console.log(error);
		});
	});
	socket.on("load more messages", function(data){
		queries.getUserDialogue(data).then(function(response){
			socket.emit("load more messages", response);
		},
		function(error){
			console.log(error);
		});
	});
});