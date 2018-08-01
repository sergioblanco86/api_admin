var async = require('async');
const con = require('../config/database');
let _ = require('lodash');
let moment = require('moment');
var mysql = require('mysql');

const obtenerProyectos = (done) => {
    con.query('SELECT * FROM proyecto', (errors, result) => {
        return done(errors, result);
    });
};

const obtenerProyectoById = (proyectoid, done) => {
  con.query('SELECT * FROM proyecto WHERE idproyecto = ' + proyectoid, (errors, result) => {
        return done(errors, result);
  });
};

const eliminarProyecto = (proyectoid, done) => {
    con.query('DELETE FROM proyecto WHERE idproyecto = ' + proyectoid, (errors, result) => {
        return done(errors, result);
    });
};

const crearResgistro = (proyectoParams, done) => {
    var params = proyectoParams;
    var sql = "INSERT INTO proyecto SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);
    
    con.query(sql, (error, proyecto) => {
        
        if (error) return done(error);

        return done(error, proyecto);
        
    });
};

const modificarRegistro = (proyectoid, proyectoParams, done) => {
    var params = proyectoParams;
    var sql = "UPDATE proyecto SET ? WHERE idproyecto = " + proyectoid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, proyecto) => {
        
        if (error) return done(error);

        return done(error, proyecto);
        
    });
};

module.exports = {
  obtenerProyectos,
  obtenerProyectoById,
  eliminarProyecto,
  crearResgistro,
  modificarRegistro
};