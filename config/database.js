var mysql = require('mysql');

var connection = mysql.createPool({
    host : 'http://scpt.barranquilla.gov.co:4000/',
    user : 'root',
    password : '',
    database : 'eventos'
});

module.exports = connection;