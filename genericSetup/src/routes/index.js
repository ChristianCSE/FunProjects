
import express from 'express';
const Router = express.Router();

router.use('/artists', require('./artists'));
router.use('/albums', require('./albums'));
