var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');

let passUtil = require('../utils/passwordUtil');

const crearUsuario = (usuarioParams, done) => {
    var params = usuarioParams;

    async.parallel([
        function(callback){
          passUtil.cryptPassword(params.contrasena, (err, hash) => {
            if(err)
              return done(err);

            params.contrasena = hash;
            var values = Object.keys(params).map(function (key) { return params[key]; });
            var sql = "INSERT INTO usuario" +
                      "(nombre," +
                      "apellido," +
                      "cedula, " +
                      "email, " +
                      "contrasena, " +
                      "tipo_perfil, " +
                      "estado, " +
                      "fecha_creacion, " +
                      "fecha_modificacion)" + 
                      "VALUES('" + params.nombre + "', " + 
                              "'" + params.apellido + "', " +
                              params.cedula + ", " +
                              "'" + params.email + "', " +
                              "'" + params.contrasena + "', " +
                              params.tipo_perfil + ", " +
                              params.estado + ", " +
                              "'" + params.fecha_creacion + "', " +
                              "'" + params.fecha_modificacion + "')";
                      
            con.query(sql, (error, usuario) => {
                var errorCode = _.get(error, 'code', null);
                if(errorCode == 'ER_DUP_ENTRY'){
                  userController.checkExitencia(params.email, params.cedula, (err, duplicado) => {
                    if (err) return done(err);

                    var msg = "El campo " + duplicado + " ya esta registrado.";
                    return res.status(300).json({status: 300, 
                                                message: msg,
                                                field: duplicado, 
                                                value: params[duplicado] });
                  });
                } else {
                  callback(error, usuario);
                }
              });
          });
        }
      ], (err, data) => {
            if (err) return done(err);

            return done(err, data);
      });
};

const modificarUsuario = (userid, usuarioParams, done) => {
    var params = usuarioParams;
    async.waterfall([
        function(callback){
          if(_.has(params, 'contrasena')){
            passUtil.cryptPassword(params.contrasena, (err, hash) => {
              if(err)
                return done(err);
              
              callback(err, hash);
            });
          }else{
            callback(null, null);
          }
        }, function(contra, callback){

          params.contrasena = contra;
          var sqlUpdateContra = (params.contrasena != null) ? "contrasena = '" + params.contrasena + "', " : "";
          var sql = "UPDATE usuario SET " +
                      "nombre = '" + params.nombre + "', " +
                      "apellido = '" + params.apellido + "', " +
                      "cedula = " + params.cedula + ", " +
                      "email = '" + params.email + "', " +
                      sqlUpdateContra +
                      "tipo_perfil = " + params.tipo_perfil + ", " +
                      "estado = " + params.estado + ", " +
                      "fecha_modificacion = '" + moment().utc().format() + "' " +
                    "WHERE id = " + userid;

            con.query(sql, (error, usuario) => {
                var errorCode = _.get(error, 'code', null);
                if(errorCode == 'ER_DUP_ENTRY'){
                  userController.checkExitencia(params.email, params.cedula, (err, duplicado) => {
                    if (err) return done(err);

                    var msg = "El campo " + duplicado + " ya esta registrado.";
                    return res.status(300).json({status: 300, 
                                                message: msg,
                                                field: duplicado, 
                                                value: params[duplicado] });
                  });
                } else {
                  callback(error, usuario);
                }
            });
        }
      ], (err, data) => {
        if (err) return done(err);

        return done(err, data);
      });
};

const checkExitencia = (email, cedula, done) => {

    con.query("SELECT * FROM usuario WHERE email = '" + email + "' OR cedula = " + cedula, (errors, usuario) => { 
        if (errors) return done(errors);
        
        let campo = (_.get(usuario[0], 'email', null) == email) ? 'email' : 'cedula';
        return done(null, campo);
        
    });
};

module.exports = {
    checkExitencia,
    crearUsuario,
    modificarUsuario
};