const express = require('express');
const awsServerlessExpress = require('aws-serverless-express')
const proyeccionesCPFutLineal = require('./app');

const app = express();

app.use('/proy/cp/lineal/futuros', proyeccionesCPFutLineal)

const server = awsServerlessExpress.createServer(proyeccionesCPFutLineal);

module.exports.proyeccionesCPFutLineal = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  awsServerlessExpress.proxy(server, event, context);
}