var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let moment = require('moment');
let _ = require('lodash');

let jwtUtil = require('../utils/jwtUtil');
let tipoEventoController = require('../controllers/tipoEventoController');

/* GET tipoEvento listing. */
router.get('/tipoEvento/health', function(req, res, next) {
  res.send('live');
});

/* GET tipoEvento listing. */
router.get('/tipoEvento', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        tipoEventoController.obtenerTipoEventos((err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
        });
    }
  });
});

/* GET tipoEvento by id. */
router.get('/tipoEvento/:tipoEventoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var tipoEventoid = req.params.tipoEventoid;

      tipoEventoController.obtenerTipoEventoById(tipoEventoid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* DELETE tipoEvento by id. */
router.delete('/tipoEvento/:tipoEventoid', jwtUtil.ensureToken, function(req, res, next) {
    jwt.verify(req.token, 'login_key', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        var tipoEventoid = req.params.tipoEventoid;
  
        tipoEventoController.eliminarTipoEvento(tipoEventoid, (err, result) => {
          if (err) return next(err);
          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      }
    });
  });

/* CREATE tipoEvento. */
router.post('/tipoEvento', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        var params = req.body;
        params.fecha_creacion = moment().utc().format();
        params.fecha_modificacion = moment().utc().format();

        tipoEventoController.crearResgistro(params, (err, result) => {
            if (err) return next(err);

            if (result) return res.json(result);
            return res.sendStatus(200);
        });      
    }
  });
});

/* UPDATE tipoEvento by id. */
router.put('/tipoEvento/:tipoEventoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
    //   var loggedUser = data.usuario;
      var tipoEventoid = req.params.tipoEventoid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
    //   if(loggedUser[0].id == userid || loggedUser[0].tipo_perfil == 1){
        tipoEventoController.modificarRegistro(tipoEventoid, params, (err, result) => {
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
