'use strict';

// import require from 'express';
import * as express from 'express';
import { artistController } from '../../controller/artist';
const Router = express.Router();




Router.get('/', (req, res, next) => {
  return artistController.getAll()
  .then(row => Promise.resolve(res.json(row)));
});

Router.get('/:artist', (req, res, next) => {
  const artistName = res.params.artist;
  return artistController.getByArtist(artistName)
  .then(row => res.json(row));
});


module.exports = Router;