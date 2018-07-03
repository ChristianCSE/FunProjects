'use strict';

//album
import * as express from 'express';
import { albumController } from '../../controller/album';
const Router = express.Router();



Router.get('/all', (req, res, next) => {
  return albumController.getAll()
  .then(row => Promise.resolve(res.json(row)));
});


Router.get('/artist/:artist', (req, res, next) => {
  const artistName = req.params.artist;
  return albumController.getByArtist(artistName)
  .then(row => res.json(row));
})

Router.get('/*', (req, res, next)=>{
  return res.json({'Error': 'Path DNE'});
})

module.exports = Router;