var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const obtenerEventos = (done) => {
    con.query('SELECT * FROM evento', (errors, result) => {
        async.waterfall([
            function (callback){
                if(!_.isEmpty(result)){
                    _.forEach(result, function(item) {
                        item.aprobadores = (!_.isEmpty(item.aprobadores)) ? JSON.parse(item.aprobadores) : item.aprobadores;
                        item.color = (!_.isEmpty(item.color)) ? JSON.parse(item.color) : item.color;
                        item.actions = (!_.isEmpty(item.actions)) ? JSON.parse(item.actions) : item.actions;
                        item.resizable = (!_.isEmpty(item.resizable)) ? JSON.parse(item.resizable) : item.resizable;
                    });
                } 
                callback(errors, result);
            }
        ], (err, result) => {
            return done(err, result);
        });
    });
};

const obtenerEventosByUserId = (userid, done) => {
    con.query('SELECT * FROM evento WHERE created_by = ' + userid, (errors, result) => {
        async.waterfall([
            function (callback){
                if(!_.isEmpty(result)){
                    _.forEach(result, function(item) {
                        item.aprobadores = (!_.isEmpty(item.aprobadores)) ? JSON.parse(item.aprobadores) : item.aprobadores;
                        item.color = (!_.isEmpty(item.color)) ? JSON.parse(item.color) : item.color;
                        item.actions = (!_.isEmpty(item.actions)) ? JSON.parse(item.actions) : item.actions;
                        item.resizable = (!_.isEmpty(item.resizable)) ? JSON.parse(item.resizable) : item.resizable;
                    });
                } 
                callback(errors, result);
            }
        ], (err, result) => {
            return done(err, result);
        });
    });
};

const obtenerEventosByEspacioId = (espacioid, done) => {
    con.query('SELECT * FROM evento WHERE id_espacio = ' + espacioid, (errors, result) => {
        async.waterfall([
            function (callback){
                if(!_.isEmpty(result)){
                    _.forEach(result, function(item) {
                        item.aprobadores = (!_.isEmpty(item.aprobadores)) ? JSON.parse(item.aprobadores) : item.aprobadores;
                        item.color = (!_.isEmpty(item.color)) ? JSON.parse(item.color) : item.color;
                        item.actions = (!_.isEmpty(item.actions)) ? JSON.parse(item.actions) : item.actions;
                        item.resizable = (!_.isEmpty(item.resizable)) ? JSON.parse(item.resizable) : item.resizable;
                    });
                } 
                callback(errors, result);
            }
        ], (err, result) => {
            return done(err, result);
        });
    });
};

const obtenerEventoById = (eventoid, done) => {
    con.query('SELECT * FROM evento WHERE idevento = ' + eventoid, (errors, result) => {
        async.waterfall([
            function (callback){
                if(!_.isEmpty(result)){
                    _.forEach(result, function(item) {
                        item.aprobadores = (!_.isEmpty(item.aprobadores)) ? JSON.parse(item.aprobadores) : item.aprobadores;
                        item.color = (!_.isEmpty(item.color)) ? JSON.parse(item.color) : item.color;
                        item.actions = (!_.isEmpty(item.actions)) ? JSON.parse(item.actions) : item.actions;
                        item.resizable = (!_.isEmpty(item.resizable)) ? JSON.parse(item.resizable) : item.resizable;
                    });
                } 
                callback(errors, result);
            }
        ], (err, result) => {
            return done(err, result);
        });
    });
};

const eliminarEvento = (eventoid, done) => {
    con.query('DELETE FROM evento WHERE idevento = ' + eventoid, (errors, result) => {
        return done(errors, result);
    });
};

const crearResgistro = (eventoParams, done) => {
    var params = eventoParams;
    params.aprobadores = JSON.stringify(params.aprobadores); 
    params.color = JSON.stringify(params.color); 
    params.actions = JSON.stringify(params.actions);
    params.resizable = JSON.stringify(params.resizable);
    var sql = "INSERT INTO evento SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);
    
    con.query(sql, (error, evento) => {
        
        if (error) return done(error);

        return done(error, evento);
        
    });
};

const modificarRegistro = (eventoid, eventoParams, done) => {
    var params = eventoParams;
    params.aprobadores = JSON.stringify(params.aprobadores); 
    params.color = JSON.stringify(params.color); 
    params.actions = JSON.stringify(params.actions);
    params.resizable = JSON.stringify(params.resizable);
    var sql = "UPDATE evento SET ? WHERE idevento = " + eventoid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, evento) => {
        
        if (error) return done(error);

        return done(error, evento);
        
    });
};

module.exports = {
  obtenerEventos,
  obtenerEventosByUserId,
  obtenerEventosByEspacioId,
  obtenerEventoById,
  eliminarEvento,
  crearResgistro,
  modificarRegistro
};