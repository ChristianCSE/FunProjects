

const express = require('express');

let artist = require('./artist');
let album = require('./album');
// let album = require('./album');
const Router = express.Router();


Router.use('/artist', artist);
//Router.use('/albums', album);

Router.use('/album', album);


Router.get('/*', (req, res, next) => {
  return res.send('<h1> Page DNE </h1>');
});

module.exports = Router;