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
	connection.query('SELECT chat_rooms.id, chat_rooms.name FROM `chat_rooms` INNER JOIN user_chats ON user_chats.room_id = chat_rooms.id INNER JOIN users ON users.id = user_chats.user_id WHERE users.id = ' + data.userIdFrom, function(error, result){
		var response = [];
		if(error){
			console.error("error to get user rooms: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			Promise.all(result.map(function(item){
				var promise = new Promise(function(resolve, reject){
					connection.query("SELECT avatar_path, login, user_id, first_name, last_name FROM users INNER JOIN user_chats ON user_chats.user_id = users.id WHERE user_chats.room_id = '" + item.id + "' AND users.id!='" + data.userIdFrom + "'", function(error, result){
						result[0].room_id = item.id;
						resolve(result[0]);
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
Queries.prototype.getUserMessages = function(data){
	console.log(data);
	var deferred = Q.defer();
	connection.query("SELECT messages.id, messages.text, users.first_name, users.last_name, users.login, users.avatar_path FROM `messages` INNER JOIN user_rooms_messages ON user_rooms_messages.message_id = messages.id INNER JOIN users ON messages.user_id = users.id WHERE user_rooms_messages.room_id = 90", function(error, result){
		if(error){
			console.error("error to get user messages: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}
module.exports = Queries;