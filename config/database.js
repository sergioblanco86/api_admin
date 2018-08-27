var mysql = require('mysql');

var connection = mysql.createPool({
    host : 'scpt.barranquilla.gov.co',
    port: 3000,
    user : 'root',
    password : '',
    database : 'eventos'
});

module.exports = connection;