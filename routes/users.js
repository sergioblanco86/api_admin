var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var async = require('async');
let moment = require('moment');
let _ = require('lodash');
const con = require('../config/database');

let passUtil = require('../utils/passwordUtil');
let jwtUtil = require('../utils/jwtUtil');
let userController = require('../controllers/userController');

/* GET users listing. */
router.get('/user/health', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/user/tipo_perfil', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
    userController.obtenerPerfiles((err, result) => {
      if (err) return next(err);
      if (result) return res.json(result);
      return res.sendStatus(200);
      });
    }
  });
});

/* GET users listing. */
router.get('/user', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
    userController.obtenerUsuarios((err, result) => {
      if (err) return next(err);
      if (result) return res.json(result);
      return res.sendStatus(200);
    });
    }
  });
});

/* GET user by id. */
router.get('/user/:userid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var userid = req.params.userid;

      userController.obtenerUsuarioById(userid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* CREATE user. */
router.post('/user', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
      var params = req.body;
      params.estado = _.get(params, 'estado', 1);
      params.fecha_creacion = moment().utc().format();
      params.fecha_modificacion = moment().utc().format();

      userController.crearUsuario(params, (err, result) => {
        if (err) return next(err);

        if (result) return res.json(result);
        return res.sendStatus(200);
      });      
    }
  });
});

/* UPDATE user by id. */
router.put('/user/:userid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var loggedUser = data.usuario;
      var userid = req.params.userid;
      var params = req.body;
      if(loggedUser[0].id == userid || loggedUser[0].tipo_perfil == 1){
        userController.modificarUsuario(userid, params, (err, result) => {
          if (err) return next(err);

          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      } else {
        var msg = "Solo el Administrador o dueño de la cuenta puede modificar.";
        return res.status(300).json({status: 300, message: msg});
      }
    }
  });
});

/* LOGIN user. */
router.post('/user/login', (req, res, next) => {
  // insert code here to actually authenticate, or fake it
  // const user = { id: 3 };
  
  var email = req.body.email;
  var contra = req.body.contrasena;
  
  async.parallel([
    function(callback){
      con.query("SELECT * FROM usuario WHERE email = '" + email + "'", (errors, usuario) => {
        if(errors)
                callback(err, null);
        if (!_.isEmpty(usuario)) {      
          passUtil.comparePassword(contra, usuario[0].contrasena, (err, isPasswordMatch) => {
            if(err)
                callback(err, null);

            if(isPasswordMatch){
              callback(null, usuario);
            }else{
              callback(null, null);
            }
          });
        }else{
          callback(null, null);
        }
      });
    }
  ], (err, data) => {
      if (err) return next(err, {message: err.message});

      if (!_.isEmpty(data) && !_.isEmpty(data[0])) {
        if(data[0][0].estado == 1){

          /// then return a token, secret key should be an env variable
          var usuario = data[0];
          const token = jwt.sign({usuario, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),}, 'login_key');
          return res.json({
            message: 'Authenticated! Use this token in the "Authorization" header',
            token: token
          });
        }else{
          var msg = "El usuario se encuentra inactivo.";
          return res.status(300).json({status: 300, message: msg});
        }
      }else{
        var msg = "Email o Contraseña incorrectos.";
        return res.status(300).json({status: 300, message: msg});
      }
  });
  
});

router.get('/user/protected', jwtUtil.ensureToken, (req, res) => {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        description: 'Protected information. Congrats!'
      });
    }
  });
});

module.exports = router;
