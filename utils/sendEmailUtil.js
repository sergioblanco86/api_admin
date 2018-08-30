var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
var async = require('async');

exports.sendEmail = function(mailOptions, done) {

    let account = {email: 'infoservicio.interno@gmail.com', pass: '9pz7qmms!', service: 'gmail'};

    var transporter = nodemailer.createTransport({
        service: account.service,
        auth: {
          user: account.email,
          pass: account.pass
        }
    });

    async.waterfall([ 
        function(callback){
            readHTMLFile(__dirname + '/../templates/' + mailOptions.template, function(err, html) {
                
                callback(err, html)
            });   
        }
    ], (err, html) => {
        if (err) return done(err);

        let template = handlebars.compile(html);
        let htmlToSend = template(mailOptions.parameters);

        mailOptions.from = account.email;
        mailOptions.html = htmlToSend;

        delete mailOptions.template;
        delete mailOptions.parameters;

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return done(error);
            } else {
                console.log('Email sent: ' + info.response);
                return done(null, info);  
            }
        });
        
    });
};

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            // throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};