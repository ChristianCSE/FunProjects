'use strict';

//album
import * as express from 'express';
import { albumController } from '../../controller/album';
const Router = express.Router();



Router.get('/all', (req, res, next) => {
  console.log('wtf');
  return albumController.getAll()
  .then(row => Promise.resolve(res.json(row)));
});


Router.get('/artist/:artist', (req, res, next) => {
  return albumController.getByArtist(req.params.artist)
  .then(row => Promise.resolve(res.json(row)));
})

Router.get('/*', (req, res, next)=>{
  console.log('req', req.params);
  return res.json({'Error': 'Path DNE'});
})

module.exports = Router;