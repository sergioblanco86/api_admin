var async = require('async');
const con = require('../config/database');
let _ = require('lodash');

const checkExitencia = (email, cedula, done) => {

    con.query("SELECT * FROM usuario WHERE email = '" + email + "' OR cedula = " + cedula, (errors, usuario) => { 
        if (errors) return done(errors);
        
        let campo = (_.get(usuario[0], 'email', null) == email) ? 'email' : 'cedula';
        return done(null, campo);
        
    });
};

module.exports = {
    checkExitencia
};