require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.set('port', process.env.PORT);

app.use('/prod/rent/cp/futuros', express.static(path.join(__dirname, 'public')));
app.use("/static", express.static("public"));

app.get('/rent/cp/futuros', inicio);
app.get('/rent/cp/futuros/grafico/:ticker', (req, res) => {
    res.sendFile(__dirname + "/public/grafico.html");
});
app.get('/rent/cp/futuros/js/grafico.js', (req, res) => {
    res.sendFile(__dirname + "/public/js/grafico.js");
});

function inicio (req, res) {
    res.sendFile(__dirname + "/public/index.html");
}

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(require('./routes'));
app.use('/rent/cp/futuros/graficos/', require('./routes/graficos'));

module.exports = app;