var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

let passUtil = require('../utils/passwordUtil');

const obtenerPerfiles = (done) => {
  con.query('SELECT * FROM tipo_perfil', (errors, result) => {
    return done(errors, result);
  });
};

const obtenerUsuarios = (done) => {
  con.query('SELECT * FROM usuario', (errors, result) => {
    return done(errors, result);
  });
};

const obtenerUsuarioById = (userid, done) => {
  con.query('SELECT * FROM usuario WHERE id = ' + userid, (errors, result) => {
    return done(errors, result);
  });
};

const crearUsuario = (usuarioParams, done) => {
    var params = usuarioParams;

    async.parallel([
        function(callback){
          passUtil.cryptPassword(params.contrasena, (err, hash) => {
            if(err)
              return done(err);

            params.contrasena = hash;
            var sql = "INSERT INTO usuario SET ?";
            var inserts = params;
            sql = mysql.format(sql, inserts);

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
          if(!_.has(params, 'editC')){
            delete params.contrasena;
          }
          var sql = "UPDATE usuario SET ? WHERE id = " + userid;
          var inserts = params;
          sql = mysql.format(sql, inserts);

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
  obtenerPerfiles,
  obtenerUsuarios,
  obtenerUsuarioById,
  checkExitencia,
  crearUsuario,
  modificarUsuario
};