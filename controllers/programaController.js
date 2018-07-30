var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const obtenerProgramas = (done) => {
    con.query('SELECT * FROM programa', (errors, result) => {
        return done(errors, result);
    });
};

const obtenerProgramaById = (programaid, done) => {
  con.query('SELECT * FROM programa WHERE idprograma = ' + programaid, (errors, result) => {
        return done(errors, result);
  });
};

const eliminarPrograma = (programaid, done) => {
    con.query('DELETE * FROM programa WHERE idprograma = ' + programaid, (errors, result) => {
        return done(errors, result);
    });
};

const crearResgistro = (programaParams, done) => {
    var params = programaParams;
    var sql = "INSERT INTO programa SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);
    
    con.query(sql, (error, programa) => {
        
        if (error) return done(error);

        return done(error, programa);
        
    });
};

const modificarRegistro = (programaid, programaParams, done) => {
    var params = programaParams;
    var sql = "UPDATE programa SET ? WHERE idprograma = " + programaid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, programa) => {
        
        if (error) return done(error);

        return done(error, programa);
        
    });
};

module.exports = {
  obtenerProgramas,
  obtenerProgramaById,
  eliminarPrograma,
  crearResgistro,
  modificarRegistro
};