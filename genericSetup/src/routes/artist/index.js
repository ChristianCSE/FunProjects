'use strict';

// import require from 'express';
import * as express from 'express';
const Router = express.Router();
//DNE yet (need to know what this will be doing)
import { getNames, getArtist } from '../../controllers/artist';


Router.get('/', getNames);
Router.get('/:name', getArtist);

export default Router;