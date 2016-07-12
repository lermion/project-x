var fs = require('fs');
var mysql = require('mysql');
var data = fs.readFileSync('./config.json');
var config = JSON.parse(data);
var connection = mysql.createConnection({
	host     : config.host,
	user     : config.user,
	password : config.password,
	database: config.database
});
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);
connection.connect(function(error){
	if(error){
		console.log('error connecting: ' + error.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});
function DatabaseConnection(){
	return connection;
}
module.exports = DatabaseConnection;