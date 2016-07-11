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
server.listen(config.port);
io.sockets.on('connection', function(socket){
	socket.on('create room', function(data){
		queries.createRoom(data).then(function(response){
			if(response.length >= 1){
				console.log("these users already have the room");
				return;
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
							console.log("response", response);
							//socket.emit("get user rooms", result);
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
		connection.query('SELECT chat_rooms.id, chat_rooms.name FROM `chat_rooms` INNER JOIN user_chats ON user_chats.room_id = chat_rooms.id INNER JOIN users ON users.id = user_chats.user_id WHERE users.id = ' + data, function(error, result){
			if(error){
				console.error("error to get user rooms: " + error.stack);
				return;
			}
			socket.emit("get user rooms", result);
		});
	});
	socket.on('send message', function(data){
		var message = {
			user_id: data.userId,
			text: data.message,
			created_at: new Date(),
			updated_at: new Date()
		};
		connection.query('INSERT INTO messages SET ?', message, function(error, result){
			console.log(result);
			var messageId = result.insertId;
			console.log(messageId);
			return;
			if(error){
				console.error("error to set message in table messages: " + error.stack);
				return;
			}
			console.log("message saved in table messages");
			connection.query("SELECT messages.id, messages.text, users.first_name, users.last_name, users.login, users.avatar_path FROM `messages` INNER JOIN user_rooms_messages ON user_rooms_messages.message_id = messages.id INNER JOIN users ON messages.user_id = users.id WHERE user_rooms_messages.room_id = 90", function(error, result){
				if(error){
					console.error("error to get user rooms: " + error.stack);
					return;
				}
				console.log(result);
				return;
				//socket.emit("get user rooms", result);
			});
		});
	});
});