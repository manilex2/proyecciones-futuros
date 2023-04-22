const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/grafico/:indice', async (req, res) => {
    const { indice } = req.params;
    var sql = `SELECT id, cripto, fecha, precio, forecast, pesimista, optimista, id_grupo FROM ${process.env.TABLE_CRIPTO_PROY_NOLINEAL} WHERE cripto = ? ORDER BY fecha ASC`;
    const datos = await pool.query(sql, [indice]);
    const datosExtraidos = JSON.stringify(datos);
    res.send(datosExtraidos);
});

module.exports = router; 