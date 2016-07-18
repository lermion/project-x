var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);
var DatabaseConnection = require('./databaseConnection');
var Queries = require('./queries');
var connection = new DatabaseConnection();
var queries = new Queries();
var users = {};
var usersId = {};
GLOBAL.rooms = [];
server.listen(config.port);
io.sockets.on('connection', function(socket){
	socket.on('create room', function(data){
		queries.createRoom(data).then(function(response){
			console.log(response);
			if(response.length >= 1 && !data.is_group){
				if(data.room_id === socket.room){
					var indexRooms = GLOBAL.rooms.indexOf(data.room_id);
					socket.room = GLOBAL.rooms[indexRooms];
					socket.join(GLOBAL.rooms[indexRooms]);
					socket.emit('updatechat', 'SERVER', 'you have connected to room: ' + GLOBAL.rooms[indexRooms]);
					data.created_at = new Date();
					data.updated_at = new Date();
				}else{
					socket.emit("switchRoom", data.room_id);
				}
				queries.getUserDialogue(data).then(function(response){
					socket.emit('send message', response);
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
					if(data.avatar === undefined){
						data.avatar = "";
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
							var socketId = usersId[response[0].id];
							io.sockets.connected[socketId].emit("get user rooms", response);
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
			response.forEach(function(value){
				GLOBAL.rooms.push(value.room_id);
			});
			socket.emit("get user rooms", response);
		},
		function(error){
			console.log(error);
		});
	});
	socket.on('send message', function(data){
		queries.sendMessage(data).then(function(response){
			queries.getUserDialogue(data).then(function(response){
				io.sockets.in(socket.room).emit('updatechat', response);
			},
			function(error){
				console.log(error);
			});
		},
		function(error){
			console.log(error);
		});
	});
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.room = newroom;
	});
});