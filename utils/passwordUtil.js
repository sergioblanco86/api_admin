var bcrypt = require('bcrypt');

exports.cryptPassword = function(password, done) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) 
            return done(err);

        bcrypt.hash(password, salt, function(err, hash) {
            return done(err, hash);
        });
    });
};
 
exports.comparePassword = function(plainPass, hashword, done) {
    bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
        return err == null ? done(null, isPasswordMatch) : done(err);
    });
};
