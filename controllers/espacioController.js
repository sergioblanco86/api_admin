var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');

const obtenerEspacios = (done) => {
  con.query('SELECT * FROM espacio', (errors, result) => {
    return done(errors, result);
  });
};

const obtenerEspacioById = (espacioid, done) => {
  con.query('SELECT * FROM espacio WHERE idespacio = ' + espacioid, (errors, result) => {
    return done(errors, result);
  });
};

const eliminarEspacio = (espacioid, done) => {
    con.query('DELETE * FROM espacio WHERE idespacio = ' + espacioid, (errors, result) => {
      return done(errors, result);
    });
};

const crearResgistro = (espacioParams, done) => {
    var params = espacioParams;
            
    var sql = "INSERT INTO espacio" +
                "(nombre," +
                "ubicacion," +
                "dias_disponibles, " +
                "horas_disponibles, " +
                "aprobadores, " +
                "elementos, " +
                "fecha_creacion, " +
                "fecha_modificacion)" + 
                "VALUES('" + params.nombre + "', " + 
                        "'" + params.ubicacion + "', " +
                        params.dias_disponibles + ", " +
                        "'" + params.horas_disponibles + "', " +
                        "'" + params.aprobadores + "', " +
                        params.elementos + ", " +
                        "'" + params.fecha_creacion + "', " +
                        "'" + params.fecha_modificacion + "')";
                
    con.query(sql, (error, espacio) => {
        
        if (error) return done(error);

        return done(error, espacio);
        
    });
};

const modificarRegistro = (espacioid, espacioParams, done) => {
    var params = espacioParams;

    var sql = "UPDATE espacio SET " +
                "nombre = '" + params.nombre + "', " +
                "ubicacion = '" + params.ubicacion + "', " +
                "dias_disponibles = " + params.dias_disponibles + ", " +
                "horas_disponibles = '" + params.horas_disponibles + "', " +
                "aprobadores = " + params.aprobadores + ", " +
                "elementos = " + params.elementos + ", " +
                "fecha_modificacion = '" + moment().utc().format() + "' " +
            "WHERE idespacio = " + espacioid;

    con.query(sql, (error, espacio) => {
        
        if (error) return done(error);

        return done(error, espacio);
        
    });
};

module.exports = {
  obtenerEspacios,
  obtenerEspacioById,
  eliminarEspacio,
  crearResgistro,
  modificarRegistro
};