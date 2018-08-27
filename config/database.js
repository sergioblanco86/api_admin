var mysql = require('mysql');

var connection = mysql.createPool({
    host : 'scpt.barranquilla.gov.co',
    port: 4000,
    user : 'root',
    password : '',
    database : 'eventos'
});

module.exports = connection;