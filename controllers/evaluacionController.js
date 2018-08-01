var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const obtenerEvaluaciones = (done) => {
    con.query('SELECT * FROM evaluacion', (errors, result) => {
        return done(errors, result);
    });
};

const obtenerEvaluacionById = (evaluacionid, done) => {
    con.query('SELECT * FROM evaluacion WHERE idevaluacion = ' + evaluacionid, (errors, result) => {
        return done(errors, result);
    });
};

const eliminarEvaluacion = (evaluacionid, done) => {
    con.query('DELETE FROM evaluacion WHERE idevaluacion = ' + parseInt(evaluacionid), (errors, result) => {
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

        return done(error, evaluacion);
        
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
  eliminarEvaluacion,
  crearResgistro,
  modificarRegistro
};