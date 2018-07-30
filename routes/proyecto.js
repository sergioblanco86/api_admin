var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let moment = require('moment');
let _ = require('lodash');

let jwtUtil = require('../utils/jwtUtil');
let proyectoController = require('../controllers/proyectoController');

/* GET proyecto listing. */
router.get('/proyecto/health', function(req, res, next) {
  res.send('live');
});

/* GET proyecto listing. */
router.get('/proyecto', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        proyectoController.obtenerProyectos((err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
        });
    }
  });
});

/* GET proyecto by id. */
router.get('/proyecto/:proyectoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var proyectoid = req.params.proyectoid;

      proyectoController.obtenerProyectoById(proyectoid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* DELETE proyecto by id. */
router.delete('/proyecto/:proyectoid', jwtUtil.ensureToken, function(req, res, next) {
    jwt.verify(req.token, 'login_key', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        var loggedUser = data.usuario;
        var proyectoid = req.params.proyectoid;
        if(loggedUser[0].tipo_perfil == 1 || loggedUser[0].tipo_perfil == 2){
          proyectoController.eliminarProyecto(proyectoid, (err, result) => {
            if (err) return next(err);
            if (result) return res.json(result);
            return res.sendStatus(200);
          });
        } else {
          var msg = "Solo el Administrador o Aprobador puede eliminar.";
          return res.status(300).json({status: 300, message: msg});
        }
      }
    });
  });

/* CREATE proyecto. */
router.post('/proyecto', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var loggedUser = data.usuario;
      var params = req.body;
      params.fecha_creacion = moment().utc().format();
      params.fecha_modificacion = moment().utc().format();
      if(loggedUser[0].tipo_perfil == 1 || loggedUser[0].tipo_perfil == 2){
        proyectoController.crearResgistro(params, (err, result) => {
            if (err) return next(err);

            if (result) return res.json(result);
            return res.sendStatus(200);
        });  
      } else {
        var msg = "Solo el Administrador o Aprobador puede crear.";
        return res.status(300).json({status: 300, message: msg});
      } 
    }
  });
});

/* UPDATE proyecto by id. */
router.put('/proyecto/:proyectoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var loggedUser = data.usuario;
      var proyectoid = req.params.proyectoid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
      if(loggedUser[0].tipo_perfil == 1 || loggedUser[0].tipo_perfil == 2){
        proyectoController.modificarRegistro(proyectoid, params, (err, result) => {
          if (err) return next(err);

          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      } else {
        var msg = "Solo el Administrador o Aprobador puede modificar.";
        return res.status(300).json({status: 300, message: msg});
      }
    }
  });
});

module.exports = router;
