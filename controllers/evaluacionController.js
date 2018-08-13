var async = require('async');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const con = require('../config/database');
const eventoController = require('./eventoController');

const obtenerEvaluaciones = (done) => {
    con.query('SELECT * FROM evaluacion', (errors, result) => {
        return done(errors, result);
    });
};

const obtenerEvaluacionById = (evaluacionid, done) => {
    let sql = 'SELECT * FROM evaluacion WHERE idevaluacion = ' + evaluacionid;
    
    sql = mysql.format(sql);
    con.query(sql, (errors, result) => {
        return done(errors, result);
    });
};

const obtenerEvaluacionByEventoId = (eventoid, done) => {
    let sql = 'SELECT * FROM evaluacion WHERE idevento = ' + eventoid;

    sql = mysql.format(sql);

    con.query(sql, (errors, result) => {
        return done(errors, result);
    });
};

const eliminarEvaluacion = (evaluacionid, done) => {
    let sql = 'DELETE FROM evaluacion WHERE idevaluacion = ' + parseInt(evaluacionid);

    sql = mysql.format(sql);
    con.query(sql, (errors, result) => {
        return done(errors, result);
    });
};

const crearResgistro = (evaluacionParams, done) => {
    var params = evaluacionParams;
    var sql = "INSERT INTO evaluacion SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);
    
    con.query(sql, (error, evaluacion) => {
        
        if (error) return done(error);

        eventoController.modificarRegistro(params.idevento, { calificado: true }, (err, result) => {
            if (err) return done(err);

            return done(error, evaluacion);
        });
        
    });
};

const modificarRegistro = (evaluacionid, evaluacionParams, done) => {
    var params = evaluacionParams;
    var sql = "UPDATE evaluacion SET ? WHERE idevaluacion = " + evaluacionid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, evaluacion) => {
        
        if (error) return done(error);

        return done(error, evaluacion);
        
    });
};

module.exports = {
  obtenerEvaluaciones,
  obtenerEvaluacionById,
  obtenerEvaluacionByEventoId,
  eliminarEvaluacion,
  crearResgistro,
  modificarRegistro
};