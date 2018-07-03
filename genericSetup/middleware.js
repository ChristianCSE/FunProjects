'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const myRouter = require('./src/routes');

const app = express(); 

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(myRouter);

module.exports = app; 