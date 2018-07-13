var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users listing. */
router.get('/user', function(req, res, next) {
  var con = req.con;
  async.parallel([
    function(callback){
      con.query('SELECT * FROM usuario', (errors, usuarios) => {
        callback(errors, usuarios);
      });
    }
  ], (err, data) => {
        if (err) return next(err);
        if (data) return res.json(data);
        return res.sendStatus(200);
      // res.render('users');
  });
});

/* GET user by id. */
router.get('/user/:userid', function(req, res, next) {
  var con = req.con;
  var userid = req.params.userid;
  async.parallel([
    function(callback){
      con.query('SELECT * FROM usuario WHERE id = ' + userid, (errors, usuario) => {
        callback(errors, usuario);
      });
    }
  ], (err, data) => {
        if (err) return next(err);
        if (data) return res.json(data);
        return res.sendStatus(200);
      // res.render('users');
  });
});

/* CREATE user. */
router.post('/user', function(req, res, next) {
  var con = req.con;
  var params = req.body;
  async.parallel([
    function(callback){
      con.query('INSERT INTO usuario(nombre,' +
                             'apellido,' +
                             'cedula, ' +
                             'email, ' +
                             'contrasena, ' +
                             'tipo_perfil, ' +
                             'fecha_creacion, ' +
                             'fecha_modificacion', params, (errors, usuario) => {
        callback(errors, usuario);
      });
    }
  ], (err, data) => {
        if (err) return next(err);
        if (data) return res.json(data);
        return res.sendStatus(200);
      // res.render('users');
  });
});

/* LOGIN user. */
router.post('/user/login', (req, res) => {
  // insert code here to actually authenticate, or fake it
  // const user = { id: 3 };
  var con = req.con;
  var email = req.body.email;
  var contra = req.body.contra;
  async.parallel([
    function(callback){
      con.query('SELECT * FROM usuario WHERE email = ' + email + ' AND contrasena = ' + contra, (errors, usuario) => {
        callback(errors, usuario);
      });
    }
  ], (err, data) => {
      if (err) return next(err);
      // if (data) return res.json(data);
      // return res.sendStatus(200);
      /// then return a token, secret key should be an env variable
      const token = jwt.sign(data, 'login_key');
      return res.json({
        message: 'Authenticated! Use this token in the "Authorization" header',
        token: token
      });
  });
  
});

router.get('/user/protected', ensureToken, (req, res) => {
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

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
