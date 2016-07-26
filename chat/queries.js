var DatabaseConnection = require('./databaseConnection');
var Q = require('q');
var connection = new DatabaseConnection();
function Queries(){
	
}
Queries.prototype.createRoom = function(data){
	var deferred = Q.defer();
	if(!data.is_group){
		var sql = "SELECT * FROM user_chats WHERE `room_id` in (SELECT `room_id` FROM `user_chats` INNER JOIN chat_rooms ON user_chats.room_id = chat_rooms.id AND chat_rooms.is_group = 0 WHERE `user_id`='" + data.members[0] + "') AND `user_id` = '" + data.members[1] + "' GROUP BY room_id";
		connection.query(sql, function(error, results, fields){
			if(error){
				console.log("error select users from user_chats: " + error.stack);
				deferred.reject(error);
				return;
			}else{
				deferred.resolve(results);
			}
		});
	}else{
		var sql = "SELECT * FROM chat_rooms WHERE `id` = '" + data.room_id + "'";
		connection.query(sql, function(error, results, fields){
			if(error){
				console.log("error select users from user_chats: " + error.stack);
				deferred.reject(error);
				return;
			}else{
				deferred.resolve(results);
			}
		});
	}
	return deferred.promise;
}
Queries.prototype.getUsers = function(data){
	var deferred = Q.defer();
	var sql = 'SELECT `first_name` FROM `users` WHERE `id` IN (' + data.members[1] + ', ' + data.members[0] + ');';
	connection.query(sql, function(error, results, fields){
		if(error){
			console.log("error select users: " + error.stack);
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
			console.log("error saved to chat rooms: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			console.log("users saved to chat_rooms");
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}
Queries.prototype.addUsersInUserChat = function(roomInfo){
	var deferred = Q.defer();
	for(var i = 0; i < roomInfo.members.length; i++){
		roomInfo.user_id = roomInfo.members[i];
		var sqlReq = {
			user_id: roomInfo.user_id,
			room_id: roomInfo.room_id,
			created_at: roomInfo.created_at,
			updated_at: roomInfo.updated_at
		};
		connection.query('INSERT INTO user_chats SET ?', sqlReq, function(error, result){
			if(error){
				console.log("error to set userIdFrom in chat room: " + error.stack);
				deferred.reject(error);
				return;
			}else{
				console.log("userIdFrom saved to user_chats");
				deferred.resolve(result);
			}
		});
	}
	return deferred.promise;
} 
Queries.prototype.getUserRooms = function(data){
	var deferred = Q.defer(); 
	if(data.userIdFrom){
		data.members = [];
		data.members[0] = data.userIdFrom;
	}
	connection.query('SELECT chat_rooms.id, chat_rooms.name, chat_rooms.is_group, chat_rooms.status, chat_rooms.avatar FROM `chat_rooms` INNER JOIN user_chats ON user_chats.room_id = chat_rooms.id INNER JOIN users ON users.id = user_chats.user_id WHERE user_chats.is_lock = false AND users.id = ' + data.members[0], function(error, result){
		var response = [];
		if(error){
			console.log("error to get user rooms: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			Promise.all(result.map(function(item){
				var promise = new Promise(function(resolve, reject){
					connection.query("SELECT avatar_path, login, user_id as id, first_name, last_name, user_chats.show_notif FROM users INNER JOIN user_chats ON user_chats.user_id = users.id WHERE user_chats.room_id = '" + item.id + "' AND users.id!='" + data.members[0] + "'", function(error, result){
						connection.query("SELECT COUNT(messages.id) FROM messages INNER JOIN user_rooms_messages ON user_rooms_messages.message_id = messages.id WHERE messages.is_new = 1 AND user_rooms_messages.room_id = '" + item.id + "'", function(error, messagesCount){
							connection.query("SELECT u.room_id, u.message_id, messages.id, messages.text, messages.created_at, messages.user_id FROM user_rooms_messages as u INNER JOIN messages ON messages.id = u.message_id WHERE u.message_id = (select max(urm.message_id) FROM user_rooms_messages as urm where urm.room_id = '" + item.id + "')", function(error, lastMessages){
								result = {
									members: result,
									room_id: item.id,
									is_group: item.is_group,
									name: item.name,
									status: item.status,
									avatar: item.avatar,
									last_message: lastMessages[0] ? lastMessages[0].text : "нет сообщений",
									last_message_created_at: lastMessages[0] ? lastMessages[0].last_message_created_at : "",
									messagesCount: messagesCount[0]['COUNT(messages.id)'],
									show_notif: result[0].show_notif
								};
								resolve(result);
							});
						});
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
	if(data.offset === undefined && data.limit === undefined){
		data.offset = 0;
		data.limit = 1000;
	}
	var sql = connection.query("SELECT messages.id, messages.text, messages.created_at, messages.updated_at, users.first_name, users.last_name, users.login, users.avatar_path FROM `messages` INNER JOIN user_rooms_messages ON user_rooms_messages.message_id = messages.id INNER JOIN users ON messages.user_id = users.id WHERE user_rooms_messages.room_id = " + data.room_id + " ORDER BY messages.id DESC LIMIT " + data.limit + " OFFSET " + data.offset + "", function(error, result){
		var response = [];
		if(error){
			console.log("error to get user dialogue: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			Promise.all(result.map(function(item){
				var promise = new Promise(function(resolve, reject){
					connection.query("SELECT images.url FROM images INNER JOIN message_images ON message_images.image_id = images.id WHERE message_images.message_id = '" + item.id + "'", function(error, images){
						resolve(images);
					});
				});
				return promise.then(function(result){
					response.push(result);
				});
			})).then(function(){
				for(var i = 0; i < result.length; i++){
					result[i].images = response[i];
				}
				var res = {
					room_id: data.room_id,
					messages: result
				};
				deferred.resolve(res);
			});
			var oldMessageArray = [];
			result.forEach(function(value){
				connection.query("UPDATE `messages` SET `is_new`= 0 WHERE `id` = ?", [value.id], function(err, results) {
					if(error){
						console.log("error to set old message: " + error.stack);
					}
				});
			});
		}
	});
	return deferred.promise;
}
Queries.prototype.getLastMessage = function(data){
	var deferred = Q.defer();
	connection.query("SELECT users.id, users.first_name, users.last_name, users.login, users.avatar_path, messages.id, messages.text, messages.created_at, messages.updated_at FROM messages INNER JOIN user_rooms_messages ON user_rooms_messages.message_id = messages.id INNER JOIN users ON messages.user_id = users.id WHERE user_rooms_messages.room_id = '" + data.room_id + "' ORDER BY messages.id DESC LIMIT 1", function(error, result){
		if(error){
			console.log("error to get last message: " + error.stack);
			deferred.reject(error);
			return;
		}else{
			connection.query("SELECT images.url FROM images INNER JOIN message_images ON message_images.image_id = images.id WHERE message_images.message_id = '" + result[0].id + "'", function(error, images){
				result[0].images = images;
				result[0].roomId = data.room_id;
				deferred.resolve(result[0]);
			});
		}
	});
	return deferred.promise;
}
Queries.prototype.saveFiles = function(data, messageId){
	var deferred = Q.defer();
	for(var i = 0; i < data.length; i++){
		var imagesObj = {
			"url": data[i],
			"created_at": new Date(),
			"updated_at": new Date()
		};
		connection.query("INSERT INTO images SET ?", imagesObj, function(error, result){
			if(error){
				console.log("error to save files: " + error.stack);
				deferred.reject(error);
				return;
			}else{
				var imageId = result.insertId;
				var objForMessageImages = {
					"message_id": messageId,
					"image_id": imageId,
					"created_at": new Date(),
					"updated_at": new Date()
				};
				connection.query("INSERT INTO message_images SET ?", objForMessageImages, function(error, result){
					if(error){
						console.log("error to save files: " + error.stack);
						deferred.reject(error);
						return;
					}else{
						deferred.resolve(result);
					}
				});
			}
		});
	}
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
			console.log("error to send message in table messages: " + error.stack);
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
					console.log("error to save message in table user_rooms_messages: " + error.stack);
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