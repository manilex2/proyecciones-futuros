const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
const rentabilidadesCPFut = require('./app');

const app = express();

app.use('/rent/cp/futuros', rentabilidadesCPFut)

const server = awsServerlessExpress.createServer(rentabilidadesCPFut);

module.exports.rentabilidadesCPFut = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  awsServerlessExpress.proxy(server, event, context);
}