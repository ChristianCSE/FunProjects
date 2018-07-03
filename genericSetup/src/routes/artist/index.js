'use strict';

// import require from 'express';
import * as express from 'express';
import { fetchUsers } from '../../dumbGetters/peeps';
const Router = express.Router();
//DNE yet (need to know what this will be doing)
//import { getNames, getArtist } from '../../controllers/artist';


//middleware related to a particular route should be here

const getArtist = (req, res, next) => {
  return res.send('<h1>bye</h1>');
}


Router.get('/', (req, res, next) => {
  return fetchUsers()
  .then(row => res.json(row));
});

Router.get('/:name', getArtist);


module.exports = Router;