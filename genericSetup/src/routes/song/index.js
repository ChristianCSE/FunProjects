'use strict';

import * as express from 'express';
import { songController } from '../../controller/song';
const Router = express.Router();


Router.get('/all', (req, res, next) => {
  return songController.getAll()
  .then(row => {
    console.log(row);
    return res.json(row);
  });
});

Router.get('/artist/:arist', (req, res, next) => {

});

Router.get('/artist/:artist/album/:album', (req, res, next) => {

});


Router.get('/*', (req, res, next) => {
  return res.json({"Error": "Path DNE"});
})

module.exports = Router;