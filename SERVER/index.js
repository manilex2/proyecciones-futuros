require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const mysql = require('mysql2/promise');
const mysql2 = require('mysql2');
const Proyeccion = require("./proyeccionModel");
const { database } = require('./keys');
const {google} = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});
const PUERTO = 4300;

app.use(morgan('dev'));

app.get('/', async function (solicitud, respuesta) {
    const conexion = await mysql.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        port: database.port,
        database: database.database
    });
    const conn = mysql2.createConnection({
        host: database.host,
        user: database.user,
        password: database.password,
        port: database.port,
        database: database.database
    });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const client = await auth.getClient();
    const googleSheet = google.sheets({ version: 'v4', auth: client });
    try {
        const proyecciones = [];
        var requestProyecciones = (await googleSheet.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range: `${process.env.ID_HOJA_PROY}`
        })).data;
        var recogerProyecciones = requestProyecciones.values;

        for (let i = 0; i < recogerProyecciones.length; i++) {
            var cripto = recogerProyecciones[i][0].toString();
            var fecha = recogerProyecciones[i][1].toString();
            var precio = parseFloat(recogerProyecciones[i][2]).toFixed(6);
            var forecast = parseFloat(recogerProyecciones[i][3]).toFixed(6);
            var pesimista = parseFloat(recogerProyecciones[i][4]).toFixed(6);
            var optimista = parseFloat(recogerProyecciones[i][5]).toFixed(6);
            var idGrupo = parseInt(recogerProyecciones[i][6]);
            let newProyeccion = new Proyeccion(
                cripto,
                fecha,
                precio,
                forecast,
                pesimista,
                optimista,
                idGrupo
            );
            newProyeccion.push(proyecciones);
        }

        await agregarDatos(proyecciones, process.env.TABLE_CRIPTO_PROY);
        await finalizarEjecucion();
    } catch (err) {
        console.error(err);
    }

    async function agregarDatos(datos, table) {
        if (!datos || datos[0][0]==="#N/A") {
            console.log("No se encontraron datos.");
            return;
        } else {
            let sql1 = `DELETE FROM ${table} WHERE id_grupo=${datos[0].id_grupo}`;
            let sql2 = `ALTER TABLE ${table} AUTO_INCREMENT=1`;
            conn.query(sql1, function (err, result) {
                if (err) throw err;
            });
            conn.query(sql2, function (err, result) {
                if (err) throw err;
            });
            let sql3 = `INSERT INTO ${table} SET ?`;
            for (let i = 0; i < datos.length; i++) {
                const element = datos[i];
                conn.query(sql3, [element], function (err, result) {
                    if (err) throw err;
                });   
            }    
            console.log(`Agredados ${datos.length} datos a ${table}`);
        }
    };
    async function finalizarEjecucion() {
        conexion.end();
        respuesta.send("OK");
    };
});

app.listen(PUERTO || process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${PUERTO || process.env.PORT}`);
});
