var async = require('async');
let _ = require('lodash');
var mysql = require('mysql');
// let moment = require('moment');
var moment = require('moment-timezone');
moment.tz.setDefault("America/Mexico_City");
moment.locale('es');

const con = require('../config/database');
const SendEmailUtil = require('../utils/sendEmailUtil');
const EspacioController = require('./espacioController');
const UserController = require('./userController');

let tipoNotificaciones = { 
    s: {
        subject: 'Eventos - Nueva solicitud.',
        template: 'solicitud.html'
    }, 
    r: {
        subject: 'Eventos - Respuesta solicitud.',
        template: 'respuesta.html'
    }
};

let estadoEvento = {
    '1': 'Aprobado',
    '2': 'Por aprobar',
    '3': 'Rechazado'
}

const obtenerEventos = (query, done) => {
    let sql = "SELECT * FROM evento";
    let where = " WHERE ";
    if(_.has(query, 'externo')){
        let interno = (query.externo == true) ? 0 : 1;
        let fecha_inicial = moment(query.fecha_inicial).format('YYYY-MM-DD') + 'T00:00:00:000Z';
        let fecha_final = moment(query.fecha_final).format('YYYY-MM-DD') + 'T23:59:00:000Z';
        where += "interno = " + interno + " AND ";
        where += "(start BETWEEN '" + fecha_inicial + "' AND " + "'" + fecha_final + "' OR ";
        where += "end BETWEEN '" + fecha_inicial + "' AND " + "'" + fecha_final + "')";
        sql += where;
    }
    sql = mysql.format(sql);
    con.query(sql, (errors, result) => {
        
        return done(errors, result);
          
    });
};

const obtenerEventosByUserId = (userid,done) => {
    let sql = 'SELECT * FROM evento WHERE created_by = ' + userid;
    sql = mysql.format(sql);
    con.query(sql, (errors, result) => {
       
        return done(errors, result);
        
    });
};

const obtenerEventosByEspacioId = (espacioid, query, done) => {
    let sql = 'SELECT * FROM evento WHERE id_espacio = ' + espacioid;
    let and = " AND ";
    if(_.has(query, 'fecha_inicial')){
        let fecha_inicial = moment(query.fecha_inicial).format('YYYY-MM-DD') + 'T00:00:00:000Z';
        let fecha_final = moment(query.fecha_final).format('YYYY-MM-DD') + 'T23:59:00:000Z';
        and += "(start BETWEEN '" + fecha_inicial + "' AND " + "'" + fecha_final + "' OR ";
        and += "end BETWEEN '" + fecha_inicial + "' AND " + "'" + fecha_final + "')";
        sql += and;
    }
    sql = mysql.format(sql);
    con.query(sql, (errors, result) => {
        return done(errors, result);
    });
};

const obtenerEventoById = (eventoid, done) => {
    con.query('SELECT * FROM evento WHERE idevento = ' + eventoid, (errors, result) => {
       
        return done(errors, result);
        
    });
};

const eliminarEvento = (eventoid, done) => {
    con.query('DELETE FROM evento WHERE idevento = ' + eventoid, (errors, result) => {
        return done(errors, result);
    });
};

const administrarCreacion = (lista, done) => {
    let eventos = _.get(lista, 'eventos', []);
    async.waterfall([ 
        function(callback){
            guardarEventos(eventos, (err, data) => {
                callback(err, data);
            });
        },
        function(data, callback){
            enviarNotificaciones(eventos, (error, result) => {
                callback(error, data);
            });
        }
    ], (err, data) => {
        if(err) return done(err, null);

        return done(err, eventos);
    });
        
};

const crearResgistro = (eventoParams, done) => {
    var params = eventoParams;
    var sql = "INSERT INTO evento SET ?";
    var inserts = params;
    sql = mysql.format(sql, inserts);

    async.waterfall([ 
        function(callback){
            EspacioController.obtenerEspacioById(params.id_espacio, (err, espacio) => {

                callback(err, espacio[0]);
            });
        },
        function(espacio, callback){
            let data = {};
            validarEventoEspacio(params, (err, result) => {
                data.espacio = espacio;
                data.isAvailable = result;
                callback(err, data);
            });
        }
    ], (err, data) => {
        if(err) return done(err, null);

        if(data && _.get(data, 'espacio.estado', 0) == 0) {
            err = new Error('El espacio esta inactivo.');
            return done(err, null);
        }

        // if(data && !_.get(data, 'espacio.isAvailable', false)){
        //     err = new Error('El horario seleccionado no esta disponible.');
        //     return done(err, null);
        // }

        con.query(sql, (error, evento) => {
            if (error) return done(error);
            eventoParams = evento;
            return done(err, eventoParams);
        });
    });
};

const enviarNotificacionAprobadores = (tipoNotificacion, evento, userid, done) => {
    let mailOptions = {};
    let to = '';
    let data ={};
    let idEspacio = evento.id_espacio;

    async.waterfall([ 
        function(callback){
            EspacioController.obtenerEspacioById(idEspacio, (err, espacio) => {

                callback(err, espacio[0]);
            });
        },
        function(espacio, callback){
            UserController.obtenerAprobadores(espacio.aprobadores, (err, aprobadores) => {
                data.espacio = espacio;
                data.aprobadores = aprobadores;
                callback(err, data);
            });
        },
        function(data, callback){
            UserController.obtenerUsuarioById(userid, (err, usuario) => {
                data.usuario = usuario[0];
                callback(err, data);
            });
        }
    ], (err, data) => {
        if (err) return done(err);

        let espacio = data.espacio;
        let usuario = data.usuario;
        _.forEach(data.aprobadores, (aprobador, key) => {
            to += aprobador.email;
            to += (key <  data.aprobadores.length - 1) ? ', ' : '';
        });

        mailOptions.parameters = {
            usuarioSolicitud: usuario.nombre + ' ' + usuario.apellido,
            lugarEvento: espacio.nombre,
            nombreEvento: evento.title,
            diaEvento: moment(evento.start).format('DD'),
            mesEvento: moment(evento.start).format('MMMM'),
            anoEvento: moment(evento.start).format('YYYY'),
            horaInicial: moment(evento.start).format('hh:mm A'),
            horaFinal: moment(evento.end).format('hh:mm A')
        };
        mailOptions.to = to;
        mailOptions.subject = tipoNotificaciones[tipoNotificacion].subject;
        mailOptions.template = tipoNotificaciones[tipoNotificacion].template;
        SendEmailUtil.sendEmail(mailOptions, (error, info) => {
            if (error) return done(error);
    
            return done(error, info);
        });
    });
};

const enviarNotificacionRespuesta = (tipoNotificacion, evento, userid, done) => {

    let mailOptions = {};

    async.waterfall([ 
        function(callback){
            UserController.obtenerUsuarioById(userid, (err, usuario) => {
                callback(err, usuario);
            });
        }
    ], (err, data) => {
        if (err) return done(err);

        mailOptions.parameters = {
            nombreEvento: evento.title,
            fechaEvento: moment(evento.start).format('DD-MM-YYYY'),
            horaInicial: moment(evento.start).format('hh:mm A'),
            horaFinal: moment(evento.end).format('hh:mm A'),
            respuestaEvento: estadoEvento[evento.estado]
        };

        mailOptions.to = data[0].email;
        mailOptions.subject = tipoNotificaciones[tipoNotificacion].subject;
        mailOptions.template = tipoNotificaciones[tipoNotificacion].template;
        SendEmailUtil.sendEmail(mailOptions, (error, info) => {
            if (error) return done(error);
    
            return done(error, info);
        });
    });

    
};

const enviarNotificacion = (tipoNotificacion, evento, userid, done) => {
    if(tipoNotificacion == 's'){
        enviarNotificacionAprobadores(tipoNotificacion, evento, userid, done);
    } else {
        enviarNotificacionRespuesta(tipoNotificacion, evento, userid, done);
    }
};

const modificarRegistro = (eventoid, eventoParams, done) => {
    var params = eventoParams;
    var sql = "UPDATE evento SET ? WHERE idevento = " + eventoid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, evento) => {
        
        if (error) return done(error);

        return done(error, evento);
        
    });
};

const administrarEvento = (eventoid, eventoParams, done) => {
    var params = {};
    params.estado = _.get(eventoParams, 'estado');
    params.revisado_by = _.get(eventoParams, 'revisado_by');

    var sql = "UPDATE evento SET ? WHERE idevento = " + eventoid;
    var inserts = params;
    sql = mysql.format(sql, inserts);

    con.query(sql, (error, evento) => {
        
        if (error) return done(error);

        // return done(error, evento);
        enviarNotificacion('r', eventoParams, params.revisado_by, (err, info) => {
            if (err) return done(err);

            return done(error, evento);
        });
    });
};

function validarEventoEspacio(evento, done){
    let query = { fecha_inicial: evento.start, fecha_final: evento.end};
    let isAvailable = false;
    obtenerEventosByEspacioId(evento.id_espacio, query, (err, data) => {
        if (err) return done(err, null);

        if(!data.length > 0){
            isAvailable = true;
            return done(null, isAvailable);
        }

        return done(null, isAvailable);
    });
}

function guardarEventos(eventos, done){
    async.each(eventos, (evento, callback) => {
        evento.fecha_creacion = moment().utc().format();
        evento.fecha_modificacion = moment().utc().format();
        crearResgistro(evento, (error, result) => {
            if(!error){
                if(result.affectedRows > 0){
                    evento.idevento = result.insertId;
                }
            }
            callback(error, result);
        })
    }, (err, data) => {
        if(err) return done(err);

        return done(null, eventos);
    });
}

function enviarNotificaciones(eventos, done){
    async.each(eventos, (evento, callback) => {
        enviarNotificacion('s', evento, evento.created_by, (err, info) => {
            callback(err, info);
        });
    }, (err, data) => {
        if(err) return done(err);

        return done(null, data);
    });
}

module.exports = {
  obtenerEventos,
  obtenerEventosByUserId,
  obtenerEventosByEspacioId,
  obtenerEventoById,
  eliminarEvento,
  crearResgistro,
  modificarRegistro,
  administrarEvento,
  administrarCreacion
};