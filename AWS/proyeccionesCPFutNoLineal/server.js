const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const proyeccionesCPFutNoLineal = require('./app');

const app = express();

app.use('/proy/cp/nolineal/futuros', proyeccionesCPFutNoLineal)

const server = awsServerlessExpress.createServer(proyeccionesCPFutNoLineal);

module.exports.proyeccionesCPFutNoLineal = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  awsServerlessExpress.proxy(server, event, context);
}