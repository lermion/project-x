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
  password : ''
});
connection.connect(function(err){
	if(err){
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});