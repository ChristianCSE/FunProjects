

const express = require('express');

let artist = require('./artist');
let album = require('./album');
let song = require('./song');
const Router = express.Router();


Router.use('/artist', artist);

Router.use('/album', album);

Router.use('/song', song);

Router.get('/*', (req, res, next) => {
  return res.json({"Error": "Path DNE"});
});

module.exports = Router;