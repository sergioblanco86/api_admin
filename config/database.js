var mysql = require('mysql');

var connection = mysql.createPool({
    host : 'us-cdbr-iron-east-01.cleardb.net',
    user : 'b0125b9cedc83f',
    password : 'a581c348',
    database : 'heroku_5a5db7520d1a2f4'
});

module.exports = connection;