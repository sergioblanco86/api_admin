var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let moment = require('moment');
let _ = require('lodash');

let jwtUtil = require('../utils/jwtUtil');
let evaluacionController = require('../controllers/evaluacionController');

/* GET evaluacion listing. */
router.get('/evaluacion/health', function(req, res, next) {
  res.send('live');
});

/* GET evaluacion listing. */
router.get('/evaluacion', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
      evaluacionController.obtenerEvaluaciones((err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* GET evaluacion by id. */
router.get('/evaluacion/:evaluacionid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var evaluacionid = req.params.evaluacionid;

      evaluacionController.obtenerEvaluacionById(evaluacionid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* GET evaluacion by id. */
router.get('/evaluacion/evento/:eventoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var eventoid = req.params.eventoid;

      evaluacionController.obtenerEvaluacionByEventoId(eventoid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* DELETE evaluacion by id. */
router.delete('/evaluacion/:evaluacionid', jwtUtil.ensureToken, function(req, res, next) {
    jwt.verify(req.token, 'login_key', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        var evaluacionid = req.params.evaluacionid;
  
        evaluacionController.eliminarEvaluacion(evaluacionid, (err, result) => {
          if (err) return next(err);
          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      }
    });
  });

/* CREATE evaluacion. */
router.post('/evaluacion', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        var params = req.body;
        params.fecha_creacion = moment().utc().format();
        params.fecha_modificacion = moment().utc().format();

        evaluacionController.crearResgistro(params, (err, result) => {
            if (err) return next(err);

            if (result) return res.json(result);
            return res.sendStatus(200);
        });      
    }
  });
});

/* UPDATE evaluacion by id. */
router.put('/evaluacion/:evaluacionid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
    //   var loggedUser = data.usuario;
      var evaluacionid = req.params.evaluacionid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
    //   if(loggedUser[0].id == userid || loggedUser[0].tipo_perfil == 1){
        evaluacionController.modificarRegistro(evaluacionid, params, (err, result) => {
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
