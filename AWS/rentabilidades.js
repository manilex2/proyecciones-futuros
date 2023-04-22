require('dotenv').config()
const mysql = require('mysql2/promise');
const mysql2 = require('mysql2');
const { database } = require('./keys');
const RentabilidadCP = require("./rentabilidadcpModel");
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
});

exports.handler = async function (event, context, callback) {
    const promise = new Promise(async function() {
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
            const rentabilidadescp = [];
            const rentabilidadeslp = [];
            var requestRentabilidadesCP = (await googleSheet.spreadsheets.values.get({
                auth,
                spreadsheetId,
                range: `${process.env.ID_HOJA_RENT_CP}`
            })).data;
            var recogerRentabilidadesCP = requestRentabilidadesCP.values;
    
            for (let i = 0; i < recogerRentabilidadesCP.length; i++) {
                var secuencial = recogerRentabilidadesCP[i][0];
                var escenario = recogerRentabilidadesCP[i][1];
                var cripto = recogerRentabilidadesCP[i][2];
                var h24 = recogerRentabilidadesCP[i][3];
                var h48 = recogerRentabilidadesCP[i][4];
                var d5 = recogerRentabilidadesCP[i][5];
                var idGrupo = recogerRentabilidadesCP[i][6];
                let newRentabilidadCP = new RentabilidadCP(
                    secuencial,
                    escenario,
                    cripto,
                    h24,
                    h48,
                    d5,
                    idGrupo
                );
                newRentabilidadCP.push(rentabilidadescp);
            }
            await agregarDatos(rentabilidadescp, process.env.TABLE_CRIPTO_RENT_CP);
            await finalizarEjecucion();
            return {
                statusCode: 200,
                body: JSON.stringify("OK")
            }
        } catch (err) {
            console.error(err);
        }
    
        async function agregarDatos(datos, table) {
            console.log(datos);
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
        };
    });
    return promise;
};