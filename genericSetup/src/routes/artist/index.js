'use strict';

import require from 'express';
const Router = express.Router();
const artistController = require('../../controllers/artist');


Router.get('/', artistController.getNames);
Router.get('/:name', artistController.getArtist);

module.exports = Router;