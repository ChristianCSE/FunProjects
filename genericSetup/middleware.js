'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const myRouter = require('./src/routes');

const app = express(); 

app.set('port', process.env.PORT || 8080);
// app.set('view engine', 'ejs');

//setup basic middleware
//delivering static files 
// app.use(express.static(__dirname + "/static"));

// app.engine('.html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//all routes with / will be re-routed to myRouter routes
app.use(myRouter);

module.exports = app; 