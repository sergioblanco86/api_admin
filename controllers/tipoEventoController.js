var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const obtenerTipoEventos = (done) => {
    con.query('SELECT * FROM tipo_evento', (errors, result) => {
        return done(errors, result);
    });
};

const obtenerTipoEventoById = (tipoEventoid, done) => {
  con.query('SELECT * FROM tipo_evento WHERE idTipoEvento = ' + tipoEventoid, (errors, result) => {
        return done(errors, result);
  });
};

const eliminarTipoEvento = (tipoEventoid, done) => {
    con.query('DELETE FROM tipo_evento WHERE idTipoEvento = ' + tipoEventoid, (errors, result) => {
        return done(errors, result);
    });
};"DELETE * FROM tipo_evento WHERE idTipoEvento = 1"

const crearResgistro = (tipoEventoParams, done) => {
    var params = tipoEventoParams;
    var sql = "INSERT INTO tipo_evento SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);
    
    con.query(sql, (error, tipo_evento) => {
        
        if (error) return done(error);

        return done(error, tipo_evento);
        
    });
};

const modificarRegistro = (tipoEventoid, tipoEventoParams, done) => {
    var params = tipoEventoParams;
    var sql = "UPDATE tipo_evento SET ? WHERE idTipoEvento = " + tipoEventoid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, tipo_evento) => {
        
        if (error) return done(error);

        return done(error, tipo_evento);
        
    });
};

module.exports = {
  obtenerTipoEventos,
  obtenerTipoEventoById,
  eliminarTipoEvento,
  crearResgistro,
  modificarRegistro
};