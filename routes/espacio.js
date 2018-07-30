var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let moment = require('moment');
let _ = require('lodash');

let jwtUtil = require('../utils/jwtUtil');
let espacioController = require('../controllers/espacioController');

/* GET espacio listing. */
router.get('/espacio/health', function(req, res, next) {
  res.send('live');
});

/* GET espacio listing. */
router.get('/espacio', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
    espacioController.obtenerEspacios((err, result) => {
      if (err) return next(err);
      if (result) return res.json(result);
      return res.sendStatus(200);
    });
    }
  });
});

/* GET espacio by id. */
router.get('/espacio/:espacioid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var espacioid = req.params.espacioid;

      espacioController.obtenerEspacioById(espacioid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* DELETE espacio by id. */
router.delete('/espacio/:espacioid', jwtUtil.ensureToken, function(req, res, next) {
    jwt.verify(req.token, 'login_key', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        var espacioid = req.params.espacioid;
  
        espacioController.eliminarEspacio(espacioid, (err, result) => {
          if (err) return next(err);
          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      }
    });
  });

/* CREATE espacio. */
router.post('/espacio', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
      var params = req.body;
      params.estado = _.get(params, 'estado', 1);
      params.fecha_creacion = moment().utc().format();
      params.fecha_modificacion = moment().utc().format();

      espacioController.crearResgistro(params, (err, result) => {
        if (err) return next(err);

        if (result) return res.json(result);
        return res.sendStatus(200);
      });      
    }
  });
});

/* UPDATE espacio by id. */
router.put('/espacio/:espacioid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
    //   var loggedUser = data.usuario;
      var espacioid = req.params.espacioid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
    //   if(loggedUser[0].id == userid || loggedUser[0].tipo_perfil == 1){
        espacioController.modificarRegistro(espacioid, params, (err, result) => {
          if (err) return next(err);

          if (result) return res.json(result);
          return res.sendStatus(200);
        });
    //   } else {
    //     var msg = "Solo el Administrador o dueño de la cuenta puede modificar.";
    //     return res.status(300).json({status: 300, message: msg});
    //   }
    }
  });
});

module.exports = router;
