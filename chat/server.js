var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);
var Queries = require('./queries');
var queries = new Queries();
var users = {};
var usersId = {};
GLOBAL.rooms = [];
GLOBAL.ABSPATH = __dirname;
server.listen(config.port);
io.sockets.on('connection', function(socket){
	socket.on('create room', function(data){
		queries.createRoom(data).then(function(response){
			if(socket.room !== undefined && socket.room.length !== undefined){
				for(var i = 0; i < socket.room.length; i++){
					if(socket.room[i] === data.room_id){
						var indexRooms = GLOBAL.rooms.indexOf(data.room_id);
						socket.room = GLOBAL.rooms[indexRooms];
						socket.join(GLOBAL.rooms[indexRooms]);
						data.created_at = new Date();
						data.updated_at = new Date();
					}else{
						socket.emit("switchRoom", data.room_id);
					}
				}
			}
			if(data.room_id === socket.room){
				var indexRooms = GLOBAL.rooms.indexOf(data.room_id);
				socket.room = GLOBAL.rooms[indexRooms];
				socket.join(GLOBAL.rooms[indexRooms]);
				data.created_at = new Date();
				data.updated_at = new Date();
			}else{
				socket.emit("switchRoom", data.room_id);
			}
			if(response.length >= 1){
				queries.getUserDialogue(data).then(function(response){
					socket.emit('updatechat', response);
				},
				function(error){
					console.log(error);
				});
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
							response[response.length - 1].isNew = true;
							//var socketId = usersId[response[0].id];
							//io.sockets.connected[socketId].emit("get user rooms", response);
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
	socket.on('send message', function(data, callback){
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
		if(data.room_id === socket.room){
			var indexRooms = GLOBAL.rooms.indexOf(data.room_id);
			socket.room = GLOBAL.rooms[indexRooms];
			socket.join(GLOBAL.rooms[indexRooms]);
			data.created_at = new Date();
			data.updated_at = new Date();
		}else{
			socket.emit("switchRoom", data.room_id);
		}
		queries.sendMessage(data).then(function(response){
			if(imagesPath !== undefined && imagesPath.length >= 1){
				queries.saveFiles(imagesPath, response.insertId).then(function(response){
					queries.getLastMessage(data).then(function(response){
						io.sockets.in(socket.room).emit('updatechat', response);
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
					io.sockets.in(socket.room).emit('updatechat', response);
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
	socket.on('switchRoom', function(newRoom){
		socket.leave(socket.room);
		socket.join(newRoom);
		socket.room = newRoom;
	});
});