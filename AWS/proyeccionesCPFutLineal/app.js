require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.set('port', process.env.PORT);

app.use('/prod/proy/cp/lineal/futuros', express.static(path.join(__dirname, 'public')));
app.use("/static", express.static("public"));

app.get('/proy/cp/lineal/futuros', inicio);
app.get('/proy/cp/lineal/futuros/grafico/:ticker', (req, res) => {
    res.sendFile(__dirname + "/public/grafico.html");
});
app.get('/proy/cp/lineal/futuros/js/grafico.js', (req, res) => {
    res.sendFile(__dirname + "/public/js/grafico.js");
});

function inicio (req, res) {
    res.sendFile(__dirname + "/public/index.html");
}

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(require('./routes'));
app.use('/proy/cp/lineal/futuros/graficos/', require('./routes/graficos'));

module.exports = app;