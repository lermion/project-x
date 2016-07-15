var DatabaseConnection = require('./databaseConnection');
var Q = require('q');
var connection = new DatabaseConnection();
function Queries(){
	
}
Queries.prototype.createRoom = function(data){
	var deferred = Q.defer();
	var sql = "SELECT * FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` WHERE `user_id`='" + data.userIdFrom + "') AND `user_id` = '" + data.userIdTo + "' GROUP BY room_id";
	connection.query(sql, function(error, results, fields){
		if(error){
			console.error("error select users from user_chats: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			deferred.resolve(results);
		}
	});
	return deferred.promise;
}
Queries.prototype.getUsers = function(data){
	var deferred = Q.defer();
	var sql = 'SELECT `first_name` FROM `users` WHERE `id` IN (' + data.userIdTo + ', ' + data.userIdFrom + ');';
	connection.query(sql, function(error, results, fields){
		if(error){
			console.error("error select users: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			deferred.resolve(results);
		}
	});
	return deferred.promise;
}
Queries.prototype.addUsersInChatRoom = function(setUsers){
	var deferred = Q.defer();
	connection.query('INSERT INTO chat_rooms SET ?', setUsers, function(error, result){
		if(error){
			console.error("error saved to chat rooms: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			console.log("users saved to chat_rooms");
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}
Queries.prototype.addUsersInUserChat = function(dataUserFrom, dataUserTo){
	var deferred = Q.defer();
	connection.query('INSERT INTO user_chats SET ?', dataUserFrom, function(error, result){
		if(error){
			console.error("error to set userIdFrom in chat room: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			console.log("userIdFrom saved to user_chats");
			deferred.resolve(result);
		}
	});
	connection.query('INSERT INTO user_chats SET ?', dataUserTo, function(error, result){
		if(error){
			console.error("error to set userIdFrom in chat room: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			console.log("userIdTo saved to user_chats");
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}
Queries.prototype.getUserRooms = function(data){
	var deferred = Q.defer();
	connection.query('SELECT chat_rooms.id, chat_rooms.name FROM `chat_rooms` INNER JOIN user_chats ON user_chats.room_id = chat_rooms.id INNER JOIN users ON users.id = user_chats.user_id WHERE user_chats.is_lock = false AND users.id = ' + data.userIdFrom, function(error, result){
		var response = [];
		if(error){
			console.error("error to get user rooms: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			Promise.all(result.map(function(item){
				var promise = new Promise(function(resolve, reject){
					connection.query("SELECT avatar_path, login, user_id as id, first_name, last_name, user_chats.show_notif FROM users INNER JOIN user_chats ON user_chats.user_id = users.id WHERE user_chats.room_id = '" + item.id + "' AND users.id!='" + data.userIdFrom + "'", function(error, result){
						result = {
							members: result,
							room_id: item.id 
						};
						resolve(result);
					});
				});
				return promise.then(function(result){
					response.push(result);
				});
			})).then(function(){
				deferred.resolve(response);
			});
		}
	});
	return deferred.promise;
}
Queries.prototype.getUserDialogue = function(data){
	var deferred = Q.defer();
	var sql = connection.query("SELECT messages.id, messages.text, messages.created_at, messages.updated_at, users.first_name, users.last_name, users.login, users.avatar_path FROM `messages` INNER JOIN user_rooms_messages ON user_rooms_messages.message_id = messages.id INNER JOIN users ON messages.user_id = users.id WHERE user_rooms_messages.room_id = " + data.room_id + " ORDER BY messages.id", function(error, result){
		if(error){
			console.error("error to get user dialogue: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}
Queries.prototype.sendMessage = function(data){
	var message = {
		"user_id": data.userId,
		"text": data.message,
		"created_at": new Date(),
		"updated_at": new Date()
	};
	var deferred = Q.defer();
	connection.query('INSERT INTO messages SET ?', message, function(error, result){
		if(error){
			console.error("error to send message in table messages: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			var messageId = result.insertId;
			var userRoomsMessages = {
				"message_id": messageId,
				"room_id": data.room_id,
				"created_at": new Date(),
				"updated_at": new Date()
			};
			connection.query('INSERT INTO user_rooms_messages SET ?', userRoomsMessages, function(error, result){
				if(error){
					console.error("error to save message in table user_rooms_messages: " + error.stack);
					deferred.reject(error);
					return;
				}else{
					deferred.resolve(result);
				}
			});
			console.log("message saved in table messages");
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}
module.exports = Queries;