var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let moment = require('moment');
let _ = require('lodash');

let jwtUtil = require('../utils/jwtUtil');
let eventoController = require('../controllers/eventoController');

/* GET evento listing. */
router.get('/evento/health', function(req, res, next) {
  res.send('live');
});

/* GET evento listing. */
router.get('/evento', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      let query = req.query;
      eventoController.obtenerEventos(query, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
          return res.sendStatus(200);
        });
    }
  });
});

/* GET evento by id. */
router.get('/evento/:eventoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var eventoid = req.params.eventoid;

      eventoController.obtenerEventoById(eventoid, (err, result) => {
        if (err) return next(err);
        if (result) return res.json(result);
        return res.sendStatus(200);
      });
    }
  });
});

/* GET evento by userid. */
router.get('/evento/usuario/:userid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var userid = req.params.userid;
      eventoController.obtenerEventosByUserId(userid, (err, result) => {
      if (err) return next(err);
      if (result) return res.json(result);
      return res.sendStatus(200);
      });
    }
  });
});

/* GET evento by userid. */
router.get('/evento/espacio/:espacioid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var espacioid = req.params.espacioid;
      let query = req.query;
      eventoController.obtenerEventosByEspacioId(espacioid, query, (err, result) => {
      if (err) return next(err);
      if (result) return res.json(result);
      return res.sendStatus(200);
      });
    }
  });
});

/* DELETE evento by id. */
router.delete('/evento/:eventoid', jwtUtil.ensureToken, function(req, res, next) {
    jwt.verify(req.token, 'login_key', function(err, data) {
      if (err) {
        res.sendStatus(403);
      } else {
        var eventoid = req.params.eventoid;
  
        eventoController.eliminarEvento(eventoid, (err, result) => {
          if (err) return next(err);
          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      }
    });
  });

/* CREATE evento. */
router.post('/evento', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      
        var params = req.body;

        eventoController.administrarCreacion(params, (err, result) => {
            if (err) return next(err);

            if (result) return res.json(result);
            return res.sendStatus(200);
        });      
    }
  });
});

/* UPDATE evento by id. */
router.put('/evento/:eventoid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
    //   var loggedUser = data.usuario;
      var eventoid = req.params.eventoid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
    //   if(loggedUser[0].id == userid || loggedUser[0].tipo_perfil == 1){
        eventoController.modificarRegistro(eventoid, params, (err, result) => {
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

/* UPDATE evento by id. */
router.put('/evento/:eventoid/gestionar', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var loggedUser = data.usuario;
      var eventoid = req.params.eventoid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
      if(loggedUser[0].tipo_perfil == 1 || loggedUser[0].tipo_perfil == 2){
        eventoController.administrarEvento(eventoid, params, (err, result) => {
          if (err) return next(err);

          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      } else {
        var msg = "Solo el Administrador o Aprobador puede gestionar eventos.";
        return res.status(300).json({status: 300, message: msg});
      }
    }
  });
});

/* UPDATE evento by id. */
router.put('/evento/gestionar/grupo/:groupid', jwtUtil.ensureToken, function(req, res, next) {
  jwt.verify(req.token, 'login_key', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      var loggedUser = data.usuario;
      var groupid = req.params.groupid;
      var params = req.body;
      params.fecha_modificacion = moment().utc().format();
      if(loggedUser[0].tipo_perfil == 1 || loggedUser[0].tipo_perfil == 2){
        eventoController.administrarEventos(groupid, params, (err, result) => {
          if (err) return next(err);

          if (result) return res.json(result);
          return res.sendStatus(200);
        });
      } else {
        var msg = "Solo el Administrador o Aprobador puede gestionar eventos.";
        return res.status(300).json({status: 300, message: msg});
      }
    }
  });
});

module.exports = router;
