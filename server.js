var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var mysql = require('mysql');
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database: "pp"
});
var users = {};
server.listen(config.port);
connection.connect(function(error){
	if(error){
		console.log('error connecting: ' + error.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});
io.sockets.on('connection', function(socket){
	socket.on('create room', function(data){
		var getUsers = 'SELECT `first_name` FROM `users` WHERE `id` IN (' + data.userIdTo + ', ' + data.userIdFrom + ');';
		connection.query(getUsers, function(error, results, fields){
			users.userNameFrom = results[0].first_name;
			users.userNameTo = results[1].first_name;
			var setUsers  = {
				name: "" + users.userNameFrom + ", " + users.userNameTo,
				created_at: new Date(),
				updated_at: new Date()
			};
			connection.query('INSERT INTO chat_rooms SET ?', setUsers, function(error, result){
				if(error){
					console.error("error saved to chat rooms: " + error.stack);
					return;
				}
				console.log("users saved to chat_rooms");
			});
			connection.query('SELECT `id` FROM chat_rooms', function(error, result){
				if(error){
					console.error("error to get chat room: " + error.stack);
					return;
				}
				var roomId = result[0].id;
				connection.query('INSERT INTO user_chats SET ?', {room_id: roomId, user_id: data.userIdFrom, created_at: new Date(), updated_at: new Date()}, function(error, result){
					if(error){
						console.error("error to set userIdFrom in chat room: " + error.stack);
						return;
					}
					console.log("userIdFrom saved to user_chats");
				});
				connection.query('INSERT INTO user_chats SET ?', {room_id: roomId, user_id: data.userIdTo, created_at: new Date(), updated_at: new Date()}, function(error, result){
					if(error){
						console.error("error to set userIdTo in chat room: " + error.stack);
						return;
					}
					console.log("userIdTo saved to user_chats");
				});
				connection.query('SELECT chat_rooms.id, chat_rooms.name FROM `chat_rooms` INNER JOIN user_chats ON user_chats.room_id = chat_rooms.id INNER JOIN users ON users.id = user_chats.user_id WHERE users.id = ' + data.userIdFrom, function(error, result){
					if(error){
						console.error("error to get user rooms: " + error.stack);
						return;
					}
					console.log(result);
					socket.emit("get user rooms", result);
				});
			});
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
});