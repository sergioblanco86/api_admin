var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let moment = require('moment');
let _ = require('lodash');

let jwtUtil = require('../utils/jwtUtil');
let programaController = require('../controllers/programaController');

/* GET programa listing. */
router.get('/programa/health', function(req, res, next) {
  res.send('live');
});

/* GET programa listing. */
router.get('/programa', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        programaController.obtenerProgramas((err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
        });
    }
  });
});

/* GET programa by id. */
router.get('/programa/:programaid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var programaid = req.params.programaid;

      programaController.obtenerProgramaById(programaid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* DELETE programa by id. */
router.delete('/programa/:programaid', jwtUtil.ensureToken, function(req, res, next) {
    jwt.verify(req.token, 'login_key', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        var programaid = req.params.programaid;
  
        programaController.eliminarPrograma(programaid, (err, result) => {
          if (err) return next(err);
          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      }
    });
  });

/* CREATE programa. */
router.post('/programa', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        var params = req.body;
        params.fecha_creacion = moment().utc().format();
        params.fecha_modificacion = moment().utc().format();

        programaController.crearResgistro(params, (err, result) => {
            if (err) return next(err);

            if (result) return res.json(result);
            return res.sendStatus(200);
        });      
    }
  });
});

/* UPDATE programa by id. */
router.put('/programa/:programaid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
    //   var loggedUser = data.usuario;
      var programaid = req.params.programaid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
    //   if(loggedUser[0].id == userid || loggedUser[0].tipo_perfil == 1){
        programaController.modificarRegistro(programaid, params, (err, result) => {
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
