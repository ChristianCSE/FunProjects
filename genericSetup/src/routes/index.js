
import * as express from 'express';
const Router = express.Router();

Router.use('/artists', require('./artist'));
Router.use('/albums', require('./album'));
