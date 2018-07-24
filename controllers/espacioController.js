var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const obtenerEspacios = (done) => {
  con.query('SELECT * FROM espacio', (errors, result) => {
    async.waterfall([
      function (callback){
        if(!_.isEmpty(result)){
          _.forEach(result, function(item) {
            item.disponibilidad = (!_.isEmpty(item.disponibilidad)) ? JSON.parse(item.disponibilidad) : item.disponibilidad;
            item.aprobadores = (!_.isEmpty(item.aprobadores)) ? JSON.parse(item.aprobadores) : item.aprobadores;
            item.elementos = (!_.isEmpty(item.elementos)) ? JSON.parse(item.elementos) : item.elementos;
          });
        } 

        callback(null, result);
      }
    ], (err, result) => {
      return done(errors, result);
    });
    
  });
};

const obtenerEspacioById = (espacioid, done) => {
  con.query('SELECT * FROM espacio WHERE idespacio = ' + espacioid, (errors, result) => {
    async.waterfall([
      function (callback){
        if(!_.isEmpty(result)){
          _.forEach(result, function(item) {
            item.disponibilidad = (!_.isEmpty(item.disponibilidad)) ? JSON.parse(item.disponibilidad) : item.disponibilidad;
            item.aprobadores = (!_.isEmpty(item.aprobadores)) ? JSON.parse(item.aprobadores) : item.aprobadores;
            item.elementos = (!_.isEmpty(item.elementos)) ? JSON.parse(item.elementos) : item.elementos;
          });
        } 

        callback(null, result);
      }
    ], (err, result) => {
      return done(errors, result);
    });
  });
};

const eliminarEspacio = (espacioid, done) => {
    con.query('DELETE * FROM espacio WHERE idespacio = ' + espacioid, (errors, result) => {
      return done(errors, result);
    });
};

const crearResgistro = (espacioParams, done) => {
    var params = espacioParams;
    params.disponibilidad = JSON.stringify(params.disponibilidad); 
    params.aprobadores = JSON.stringify(params.aprobadores); 
    params.elementos = JSON.stringify(params.elementos); 
    var sql = "INSERT INTO espacio SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);
                
    con.query(sql, (error, espacio) => {
        
        if (error) return done(error);

        return done(error, espacio);
        
    });
};

const modificarRegistro = (espacioid, espacioParams, done) => {
    var params = espacioParams;
    var sql = "UPDATE espacio SET ? WHERE idespacio = " + espacioid;
    var inserts = params;
    sql = mysql.format(sql, inserts);
    // var sql = ' UPDATE espacio SET  '  +
    //             ' nombre = " '  + params.nombre +  ' ",  '  +
    //             ' ubicacion = " '  + params.ubicacion +  ' ",  '  +
    //             ' disponibilidad = " '  + params.disponibilidad +  ' ",  '  +
    //             ' aprobadores = " '  + params.aprobadores +  ' ",  '  +
    //             ' elementos = " '  + params.elementos +  ' ",  '  +
    //             ' fecha_modificacion = " '  + moment().utc().format() +  ' "  '  +
    //         ' WHERE idespacio =  '  + espacioid;

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