'use strict';

//album
import * as express from 'express';
import { albumController } from '../../controller/album/index';
const Router = express.Router();

const jsonWrapper = (row) => Promise.resolve(res.json(row));

Router.get('/all', (req, res, next) => {
  return albumController.getAll()
  .then(jsonWrapper);
});


Router.get('/album/artist/:artist', (req, res, next) => {
  return albumController.getByArtist(req.param)
  .then(jsonWrapper);
})

Router.get('/*', ()=>{
  return res.json({'Error': 'Path DNE'});
})