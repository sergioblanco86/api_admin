var mysql = require('mysql');

var connection = mysql.createPool({
    host : 'eventos.ccgeehskphbz.us-east-1.rds.amazonaws.com',
    user : 'root',
    password : '3d11f4ab',
    database : 'eventos'
});

module.exports = connection;