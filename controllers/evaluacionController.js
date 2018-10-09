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

    async.waterfall([
        function(callback){
            sql = mysql.format(sql, inserts);
            con.query(sql, (error, info) => {
                callback(error, info);
            });
        }, function(info, callback){
            eventoController.obtenerEventosByGroupId(params.group_id, (err, eventos) => {
                callback(err, eventos);
            });
        }, function(eventos, callback){
            marcarCalificado(eventos, (err, result) => {
                callback(err, info);
            });
        }
    ], (err, data) => {
        if (err) return done(err);

        return done(null, data);
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

function marcarCalificado(eventos, done){
   
    async.each(eventos, (evento, callback) => {
        eventoController.modificarRegistro(evento.idevento, { calificado: true }, (error, result) => {
            callback(error, result);
        });
    }, (err, data) => {
        if(err) return done(err);

        return done(null, data);
    });
}

module.exports = {
  obtenerEvaluaciones,
  obtenerEvaluacionById,
  obtenerEvaluacionByEventoId,
  eliminarEvaluacion,
  crearResgistro,
  modificarRegistro
};