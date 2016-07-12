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
GLOBAL.rooms = [];
var usernames = {
	username: null
};
var rooms = ['room1','room2','room3'];
server.listen(config.port);
io.sockets.on('connection', function(socket){
	socket.on('create room', function(data){
		socket.username = username;
		var indexRooms = GLOBAL.rooms.indexOf(data.room_id);
		var username = "vlad";
		socket.room = "room: " + GLOBAL.rooms[indexRooms];
		usernames[username] = username;
		// send client to room 1
		socket.join("room: " + GLOBAL.rooms[indexRooms]);
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to room: ' + GLOBAL.rooms[indexRooms]);
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
		data.created_at = new Date();
		data.updated_at = new Date();
		queries.createRoom(data).then(function(response){
			if(response.length >= 1){
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
					var setUsers  = {
						name: "" + users.userNameFrom + ", " + users.userNameTo,
						created_at: new Date(),
						updated_at: new Date()
					};
					queries.addUsersInChatRoom(setUsers).then(function(response){
						var roomId = response.insertId;
						var dataUserFrom = {
							room_id: roomId,
							user_id: data.userIdFrom,
							created_at: new Date(),
							updated_at: new Date()
						};
						var dataUserTo = {
							room_id: roomId,
							user_id: data.userIdTo,
							created_at: new Date(),
							updated_at: new Date()
						};
						queries.addUsersInUserChat(dataUserFrom, dataUserTo).then(function(response){
							
						},
						function(error){
							console.log(error);
						});
						queries.getUserRooms(data).then(function(response){
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
					console.log();
				});
			}
		},
		function(error){
			console.log();
		});
});
	socket.on('get user rooms', function(data){
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
				console.log(socket.room);
				io.sockets.in(socket.room).emit('updatechat', socket.username, response);
				//socket.emit('send message', response);
			},
			function(error){
				console.log(error);
			});
		},
		function(error){
			console.log(error);
		});
	});
});